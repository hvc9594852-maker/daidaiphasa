//go:build darwin

// KeySwap for Mac — a menu-less background app. Select text in any app (LINE included),
// press a shortcut, and the text is replaced in place:
//
//	⌃⇧T  swap Thai (Kedmanee) <-> English (QWERTY)
//	⌃⌥R  ถอดเสียง   ⌃⌥B  Braille   ⌃⌥M  Morse   ⌃⌥L  แปลภาษา (needs internet)
//
// Works by sending ⌘C, converting the clipboard, sending ⌘V, then restoring the clipboard.
// Needs Accessibility permission once (System Settings › Privacy & Security › Accessibility).
// Built without cgo: Carbon / CoreGraphics / AppKit are called through purego.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"syscall"
	"time"
	"unsafe"

	"github.com/ebitengine/purego"
	"github.com/ebitengine/purego/objc"
)

func init() { runtime.LockOSThread() } // AppKit and Carbon must run on the main thread

const (
	cmdKey     = 1 << 8
	shiftKey   = 1 << 9
	optionKey  = 1 << 11
	controlKey = 1 << 12

	kVK_C = 8
	kVK_V = 9

	flagShift = 0x20000
	flagCtrl  = 0x40000
	flagAlt   = 0x80000
	flagCmd   = 0x100000

	hidSystemState = 1
	hidEventTap    = 0
)

type hotkey struct {
	id    uint32
	key   uint32 // virtual key code
	mods  uint32
	label string
	mode  string
}

var hotkeys = []hotkey{
	{1, 17, controlKey | shiftKey, "⌃⇧T  สลับแป้น ไทย ⇄ อังกฤษ", "swap"},
	{2, 15, controlKey | optionKey, "⌃⌥R  ถอดเสียง", "romanize"},
	{3, 11, controlKey | optionKey, "⌃⌥B  อักษรเบรลล์", "braille"},
	{4, 46, controlKey | optionKey, "⌃⌥M  รหัสมอร์ส", "morse"},
	{5, 37, controlKey | optionKey, "⌃⌥L  แปลภาษา (ต้องต่อเน็ต)", "translate"},
}

type eventTypeSpec struct{ class, kind uint32 }
type eventHotKeyID struct{ signature, id uint32 }

var (
	GetApplicationEventTarget     func() uintptr
	InstallEventHandler           func(target, handler uintptr, n uint32, list *eventTypeSpec, userData uintptr, out *uintptr) int32
	RegisterEventHotKey           func(key, mods uint32, id uint64, target uintptr, options uint32, out *uintptr) int32
	GetEventParameter             func(ev uintptr, name, typ uint32, actualType, size, actualSize uintptr, data unsafe.Pointer) int32
	CGEventCreateKeyboardEvent    func(src uintptr, key uint16, down bool) uintptr
	CGEventSetFlags               func(ev uintptr, flags uint64)
	CGEventPost                   func(tap uint32, ev uintptr)
	CGEventSourceFlagsState       func(state int32) uint64
	CFRelease                     func(uintptr)
	AXIsProcessTrusted            func() bool
	AXIsProcessTrustedWithOptions func(opts uintptr) bool
)

func fourCC(s string) uint32 {
	return uint32(s[0])<<24 | uint32(s[1])<<16 | uint32(s[2])<<8 | uint32(s[3])
}

func load(path string) uintptr {
	h, err := purego.Dlopen(path, purego.RTLD_NOW|purego.RTLD_GLOBAL)
	if err != nil {
		fatal("โหลด " + filepath.Base(path) + " ไม่ได้")
	}
	return h
}

func sel(s string) objc.SEL { return objc.RegisterName(s) }

func nsString(s string) objc.ID {
	b := append([]byte(s), 0)
	id := objc.ID(objc.GetClass("NSString")).Send(sel("stringWithUTF8String:"), uintptr(unsafe.Pointer(&b[0])))
	runtime.KeepAlive(b)
	return id
}

func goString(id objc.ID) string {
	if id == 0 {
		return ""
	}
	p := objc.Send[uintptr](id, sel("UTF8String"))
	if p == 0 {
		return ""
	}
	var b []byte
	for i := uintptr(0); ; i++ {
		c := *(*byte)(unsafe.Pointer(p + i))
		if c == 0 {
			break
		}
		b = append(b, c)
	}
	return string(b)
}

var pasteboard objc.ID

func pbCount() int { return objc.Send[int](pasteboard, sel("changeCount")) }

func pbText() (string, bool) {
	s := pasteboard.Send(sel("stringForType:"), nsString("public.utf8-plain-text"))
	if s == 0 {
		return "", false
	}
	return goString(s), true
}

func pbSet(s string) {
	pasteboard.Send(sel("clearContents"))
	pasteboard.Send(sel("setString:forType:"), nsString(s), nsString("public.utf8-plain-text"))
}

func pressCmd(key uint16) {
	for _, down := range []bool{true, false} {
		ev := CGEventCreateKeyboardEvent(0, key, down)
		CGEventSetFlags(ev, flagCmd)
		CGEventPost(hidEventTap, ev)
		CFRelease(ev)
		time.Sleep(8 * time.Millisecond)
	}
}

func osascript(script string) string {
	out, _ := exec.Command("/usr/bin/osascript", "-e", script).Output()
	return strings.TrimSpace(string(out))
}

func q(s string) string {
	return `"` + strings.ReplaceAll(strings.ReplaceAll(s, `\`, `\\`), `"`, `\"`) + `"`
}

func notify(text string) {
	go osascript("display notification " + q(text) + " with title \"KeySwap\"")
}

func fatal(text string) {
	logf_("fatal: %s", text)
	osascript("display dialog " + q(text) + " with title \"KeySwap\" buttons {\"ตกลง\"} default button 1 with icon caution")
	os.Exit(1)
}

var eng *engine

func convert(mode, text string) (string, error) {
	if mode == "translate" {
		return Translate(text)
	}
	return eng.Run(mode, text)
}

func replaceSelection(h hotkey) {
	if !AXIsProcessTrusted() {
		logf_("%s: not trusted", h.mode)
		askPermission()
		return
	}
	// wait until the shortcut's modifier keys are released
	deadline := time.Now().Add(900 * time.Millisecond)
	for time.Now().Before(deadline) && CGEventSourceFlagsState(hidSystemState)&(flagShift|flagCtrl|flagAlt) != 0 {
		time.Sleep(10 * time.Millisecond)
	}
	saved, hadText := pbText()
	before := pbCount()
	pressCmd(kVK_C)
	changed := false
	for i := 0; i < 60; i++ {
		time.Sleep(10 * time.Millisecond)
		if pbCount() != before {
			changed = true
			break
		}
	}
	if !changed {
		logf_("%s: clipboard did not change (nothing selected?)", h.mode)
		return // nothing selected
	}
	text, ok := pbText()
	if !ok || text == "" {
		return
	}
	out, err := convert(h.mode, text)
	if err != nil || out == "" || out == text {
		if hadText {
			pbSet(saved)
		}
		if err != nil {
			notify(err.Error())
		}
		return
	}
	logf_("%s: %d chars -> %d chars", h.mode, len(text), len(out))
	pbSet(out)
	time.Sleep(20 * time.Millisecond)
	pressCmd(kVK_V)
	time.Sleep(400 * time.Millisecond)
	if hadText {
		pbSet(saved)
	}
}

func onHotKey(_ uintptr, event uintptr, _ uintptr) uintptr {
	defer func() {
		if r := recover(); r != nil {
			logf_("hotkey panic: %v", r)
		}
	}()
	var hk eventHotKeyID
	GetEventParameter(event, fourCC("----"), fourCC("hkid"), 0, unsafe.Sizeof(hk), 0, unsafe.Pointer(&hk))
	logf_("hotkey id=%d", hk.id)
	for _, h := range hotkeys {
		if h.id == hk.id {
			replaceSelection(h)
		}
	}
	return 0
}

// bundlePath is the .app that holds this executable.
func bundlePath() string {
	exe, _ := os.Executable()
	return filepath.Dir(filepath.Dir(filepath.Dir(exe)))
}

// relaunch starts a fresh copy (macOS only sees a new permission after a restart) and exits.
func relaunch() {
	logf_("relaunch")
	os.Remove(pidFile())
	exec.Command("/usr/bin/open", "-n", bundlePath()).Start()
	time.Sleep(300 * time.Millisecond)
	os.Exit(0)
}

var asking bool

// askPermission explains the one-time permission and offers a restart once it is switched on.
func askPermission() {
	if asking {
		return
	}
	asking = true
	go func() {
		defer func() { asking = false }()
		ans := osascript(`button returned of (display dialog "KeySwap ต้องได้รับอนุญาตก่อนใช้งาน (ครั้งเดียว)\n\nเปิด System Settings › Privacy & Security › Accessibility (บาง macOS ชื่อ Device Control and Data Access) แล้วเปิดสวิตช์ KeySwap\n\nเปิดสวิตช์แล้ว กด รีสตาร์ต KeySwap" with title "KeySwap" buttons {"เปิด System Settings", "รีสตาร์ต KeySwap"} default button 2)`)
		if ans == "เปิด System Settings" {
			exec.Command("/usr/bin/open", "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility").Run()
		} else if ans == "รีสตาร์ต KeySwap" {
			relaunch()
		}
	}()
}

// watchPermission restarts KeySwap by itself as soon as the permission is switched on.
func watchPermission() {
	go func() {
		for i := 0; i < 600; i++ { // up to 20 minutes
			time.Sleep(2 * time.Second)
			if AXIsProcessTrusted() {
				logf_("permission granted while running")
				notify("KeySwap ได้รับอนุญาตแล้ว พร้อมใช้งาน")
				return
			}
		}
	}()
}

// setupMenu puts a "ๆ" item in the menu bar: shortcuts, permission, restart, quit.
func setupMenu() {
	openURL := func(u string) { exec.Command("/usr/bin/open", u).Start() }
	cls, err := objc.RegisterClass("KSMenuTarget", objc.GetClass("NSObject"), nil, nil, []objc.MethodDef{
		{Cmd: sel("quit:"), Fn: func(_ objc.ID, _ objc.SEL, _ objc.ID) { logf_("quit from menu"); os.Remove(pidFile()); os.Exit(0) }},
		{Cmd: sel("restart:"), Fn: func(_ objc.ID, _ objc.SEL, _ objc.ID) { relaunch() }},
		{Cmd: sel("permission:"), Fn: func(_ objc.ID, _ objc.SEL, _ objc.ID) {
			openURL("x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")
		}},
		{Cmd: sel("website:"), Fn: func(_ objc.ID, _ objc.SEL, _ objc.ID) { openURL("https://daidaiphasa.com/keyboard") }},
	})
	if err != nil {
		logf_("menu class: %v", err)
		return
	}
	target := objc.ID(cls).Send(sel("new"))
	menu := objc.ID(objc.GetClass("NSMenu")).Send(sel("alloc")).Send(sel("initWithTitle:"), nsString("KeySwap"))
	menu.Send(sel("setAutoenablesItems:"), false)
	add := func(title, action, key string) {
		if title == "-" {
			menu.Send(sel("addItem:"), objc.ID(objc.GetClass("NSMenuItem")).Send(sel("separatorItem")))
			return
		}
		var act objc.SEL
		if action != "" {
			act = sel(action)
		}
		it := objc.ID(objc.GetClass("NSMenuItem")).Send(sel("alloc")).Send(sel("initWithTitle:action:keyEquivalent:"), nsString(title), act, nsString(key))
		if action != "" {
			it.Send(sel("setTarget:"), target)
		} else {
			it.Send(sel("setEnabled:"), false)
		}
		menu.Send(sel("addItem:"), it)
	}
	add("KeySwap · ใดๆภาษา.com — คลุมดำข้อความแล้วกด", "", "")
	add("-", "", "")
	for _, h := range hotkeys {
		add(h.label, "", "")
	}
	add("-", "", "")
	add("อนุญาตการใช้งาน (Accessibility)…", "permission:", "")
	add("รีสตาร์ต KeySwap", "restart:", "")
	add("เปิดเว็บ ใดๆภาษา.com", "website:", "")
	add("-", "", "")
	add("ปิด KeySwap", "quit:", "q")

	bar := objc.ID(objc.GetClass("NSStatusBar")).Send(sel("systemStatusBar"))
	item := bar.Send(sel("statusItemWithLength:"), float64(-1)) // NSVariableStatusItemLength
	item.Send(sel("retain"))
	item.Send(sel("button")).Send(sel("setTitle:"), nsString("ๆ"))
	item.Send(sel("setMenu:"), menu)
	logf_("menu bar item ready")
}

// single instance: opening KeySwap again offers to close the running one
func pidFile() string {
	dir, err := os.UserCacheDir()
	if err != nil {
		dir = os.TempDir()
	}
	return filepath.Join(dir, "KeySwap.pid")
}

func checkRunning() {
	b, err := os.ReadFile(pidFile())
	if err == nil {
		if pid, err := strconv.Atoi(strings.TrimSpace(string(b))); err == nil && pid != os.Getpid() && syscall.Kill(pid, 0) == nil {
			ans := osascript(`button returned of (display dialog "KeySwap กำลังทำงานอยู่แล้ว\n\nต้องการปิด KeySwap ไหม?" with title "KeySwap" buttons {"ยกเลิก", "ปิด KeySwap"} default button 2)`)
			if ans == "ปิด KeySwap" {
				syscall.Kill(pid, syscall.SIGTERM)
				os.Remove(pidFile())
			}
			os.Exit(0)
		}
	}
	os.WriteFile(pidFile(), []byte(strconv.Itoa(os.Getpid())), 0o644)
}

var logf *os.File

func logf_(format string, a ...any) {
	if logf != nil {
		fmt.Fprintf(logf, time.Now().Format("15:04:05.000 ")+format+"\n", a...)
	}
}

// openLog writes to ~/Library/Logs/KeySwap.log and sends Go's own crash output there too.
func openLog() {
	home, _ := os.UserHomeDir()
	f, err := os.OpenFile(filepath.Join(home, "Library", "Logs", "KeySwap.log"), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		return
	}
	logf = f
	syscall.Dup2(int(f.Fd()), 2)
	logf_("start pid=%d exe=%s", os.Getpid(), os.Args[0])
}

func main() {
	openLog()
	defer func() {
		if r := recover(); r != nil {
			logf_("panic: %v", r)
			fatal(fmt.Sprint("KeySwap หยุดทำงาน: ", r))
		}
	}()
	checkRunning()
	logf_("single-instance ok")

	carbon := load("/System/Library/Frameworks/Carbon.framework/Carbon")
	appSvc := load("/System/Library/Frameworks/ApplicationServices.framework/ApplicationServices")
	load("/System/Library/Frameworks/AppKit.framework/AppKit")
	purego.RegisterLibFunc(&GetApplicationEventTarget, carbon, "GetApplicationEventTarget")
	purego.RegisterLibFunc(&InstallEventHandler, carbon, "InstallEventHandler")
	purego.RegisterLibFunc(&RegisterEventHotKey, carbon, "RegisterEventHotKey")
	purego.RegisterLibFunc(&GetEventParameter, carbon, "GetEventParameter")
	purego.RegisterLibFunc(&CGEventCreateKeyboardEvent, appSvc, "CGEventCreateKeyboardEvent")
	purego.RegisterLibFunc(&CGEventSetFlags, appSvc, "CGEventSetFlags")
	purego.RegisterLibFunc(&CGEventPost, appSvc, "CGEventPost")
	purego.RegisterLibFunc(&CGEventSourceFlagsState, appSvc, "CGEventSourceFlagsState")
	purego.RegisterLibFunc(&CFRelease, appSvc, "CFRelease")
	purego.RegisterLibFunc(&AXIsProcessTrusted, appSvc, "AXIsProcessTrusted")
	purego.RegisterLibFunc(&AXIsProcessTrustedWithOptions, appSvc, "AXIsProcessTrustedWithOptions")

	logf_("frameworks loaded")
	var err error
	if eng, err = newEngine(); err != nil {
		fatal("KeySwap เริ่มทำงานไม่ได้: " + err.Error())
	}
	logf_("engine ready")

	app := objc.ID(objc.GetClass("NSApplication")).Send(sel("sharedApplication"))
	app.Send(sel("setActivationPolicy:"), 1) // accessory: no Dock icon, no menu bar
	pasteboard = objc.ID(objc.GetClass("NSPasteboard")).Send(sel("generalPasteboard"))
	setupMenu()

	spec := eventTypeSpec{fourCC("keyb"), 5} // kEventClassKeyboard, kEventHotKeyPressed
	var handlerRef uintptr
	st := InstallEventHandler(GetApplicationEventTarget(), purego.NewCallback(onHotKey), 1, &spec, 0, &handlerRef)
	logf_("InstallEventHandler=%d", st)
	var failed []string
	for _, h := range hotkeys {
		var ref uintptr
		id := uint64(fourCC("KSwp")) | uint64(h.id)<<32 // EventHotKeyID{signature, id} passed by value
		r := RegisterEventHotKey(h.key, h.mods, id, GetApplicationEventTarget(), 0, &ref)
		logf_("RegisterEventHotKey %s = %d", h.mode, r)
		if r != 0 {
			failed = append(failed, h.label)
		}
	}

	// ask for Accessibility once (macOS shows its own prompt)
	opts := objc.ID(objc.GetClass("NSDictionary")).Send(sel("dictionaryWithObject:forKey:"),
		objc.ID(objc.GetClass("NSNumber")).Send(sel("numberWithBool:"), true), nsString("AXTrustedCheckOptionPrompt"))
	trusted := AXIsProcessTrustedWithOptions(uintptr(opts))
	logf_("accessibility trusted=%v", trusted)
	if !trusted {
		watchPermission()
	}

	msg := "KeySwap พร้อมใช้งานแล้ว\n\nคลุมดำข้อความ แล้วกดคีย์ลัด:\n"
	for _, h := range hotkeys {
		msg += "\n" + h.label
	}
	if len(failed) > 0 {
		msg += "\n\nคีย์ลัดเหล่านี้มีแอปอื่นใช้อยู่:\n" + strings.Join(failed, "\n")
	}
	if !trusted {
		msg += "\n\nขั้นตอนเดียวที่เหลือ: เปิด System Settings › Privacy & Security › Accessibility แล้วเปิดสวิตช์ของ KeySwap"
	}
	msg += "\n\nดูคีย์ลัด รีสตาร์ต หรือปิด KeySwap ได้จากไอคอน ๆ ที่แถบเมนูด้านบนของจอ"
	go osascript(fmt.Sprintf("display dialog %s with title \"KeySwap · ใดๆภาษา.com\" buttons {\"ตกลง\"} default button 1", q(msg)))

	logf_("running")
	app.Send(sel("run"))
}
