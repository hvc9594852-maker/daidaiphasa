//go:build windows

// KeySwap for Windows — select text, press a shortcut, and it is replaced in place:
//
//	Ctrl+Shift+T  swap Thai (Kedmanee) <-> English (QWERTY) typed on the wrong layout
//	Ctrl+Alt+R    ถอดเสียง  Thai -> RTGS letters / English -> Thai reading
//	Ctrl+Alt+B    Braille   English <-> Braille (grade 1)
//	Ctrl+Alt+M    Morse     English <-> Morse code
//	Ctrl+Alt+L    แปลภาษา   Thai -> English, other languages -> Thai (needs internet)
//
// Pure Win32 via syscall (RegisterHotKey, SendInput, clipboard, tray icon). No cgo.
package main

import (
	"runtime"
	"syscall"
	"time"
	"unsafe"
)

var (
	user32   = syscall.NewLazyDLL("user32.dll")
	kernel32 = syscall.NewLazyDLL("kernel32.dll")
	shell32  = syscall.NewLazyDLL("shell32.dll")

	pRegisterHotKey             = user32.NewProc("RegisterHotKey")
	pGetMessageW                = user32.NewProc("GetMessageW")
	pTranslateMessage           = user32.NewProc("TranslateMessage")
	pDispatchMessageW           = user32.NewProc("DispatchMessageW")
	pPostThreadMessageW         = user32.NewProc("PostThreadMessageW")
	pPostQuitMessage            = user32.NewProc("PostQuitMessage")
	pDefWindowProcW             = user32.NewProc("DefWindowProcW")
	pRegisterClassExW           = user32.NewProc("RegisterClassExW")
	pCreateWindowExW            = user32.NewProc("CreateWindowExW")
	pLoadIconW                  = user32.NewProc("LoadIconW")
	pCreatePopupMenu            = user32.NewProc("CreatePopupMenu")
	pAppendMenuW                = user32.NewProc("AppendMenuW")
	pTrackPopupMenu             = user32.NewProc("TrackPopupMenu")
	pDestroyMenu                = user32.NewProc("DestroyMenu")
	pGetCursorPos               = user32.NewProc("GetCursorPos")
	pSetForegroundWindow        = user32.NewProc("SetForegroundWindow")
	pSendInput                  = user32.NewProc("SendInput")
	pGetAsyncKeyState           = user32.NewProc("GetAsyncKeyState")
	pOpenClipboard              = user32.NewProc("OpenClipboard")
	pCloseClipboard             = user32.NewProc("CloseClipboard")
	pEmptyClipboard             = user32.NewProc("EmptyClipboard")
	pGetClipboardData           = user32.NewProc("GetClipboardData")
	pSetClipboardData           = user32.NewProc("SetClipboardData")
	pIsClipboardFormatAvailable = user32.NewProc("IsClipboardFormatAvailable")
	pGetClipboardSequenceNumber = user32.NewProc("GetClipboardSequenceNumber")
	pMessageBoxW                = user32.NewProc("MessageBoxW")
	pMessageBeep                = user32.NewProc("MessageBeep")
	pShellNotifyIconW           = shell32.NewProc("Shell_NotifyIconW")
	pGetModuleHandleW           = kernel32.NewProc("GetModuleHandleW")
	pGlobalAlloc                = kernel32.NewProc("GlobalAlloc")
	pGlobalFree                 = kernel32.NewProc("GlobalFree")
	pGlobalLock                 = kernel32.NewProc("GlobalLock")
	pGlobalUnlock               = kernel32.NewProc("GlobalUnlock")
	pCreateMutexW               = kernel32.NewProc("CreateMutexW")
	pCreateEventW               = kernel32.NewProc("CreateEventW")
	pOpenEventW                 = kernel32.NewProc("OpenEventW")
	pSetEvent                   = kernel32.NewProc("SetEvent")
	pWaitForSingleObject        = kernel32.NewProc("WaitForSingleObject")
	pGetCurrentThreadId         = kernel32.NewProc("GetCurrentThreadId")
)

const (
	modAlt      = 0x0001
	modControl  = 0x0002
	modShift    = 0x0004
	modNoRepeat = 0x4000

	wmDestroy   = 0x0002
	wmCommand   = 0x0111
	wmHotkey    = 0x0312
	wmQuit      = 0x0012
	wmUser      = 0x0400
	wmTray      = wmUser + 1
	wmRButtonUp = 0x0205
	wmLButtonUp = 0x0202

	vkShift   = 0x10
	vkControl = 0x11
	vkMenu    = 0x12
	vkLShift  = 0xA0
	vkRShift  = 0xA1
	vkLMenu   = 0xA4
	vkRMenu   = 0xA5
	vkC       = 0x43
	vkV       = 0x56

	inputKeyboard  = 1
	keyeventfKeyUp = 0x0002

	cfUnicodeText = 13
	gmemMoveable  = 0x0002

	errorAlreadyExists = 183
	eventModifyState   = 0x0002
	infinite           = 0xFFFFFFFF

	mbOK           = 0x0
	mbYesNo        = 0x4
	mbIconInfo     = 0x40
	mbIconWarning  = 0x30
	mbIconQuestion = 0x20
	mbTopmost      = 0x40000
	idYes          = 6

	nimAdd     = 0
	nimModify  = 1
	nimDelete  = 2
	nifMessage = 0x1
	nifIcon    = 0x2
	nifTip     = 0x4
	nifInfo    = 0x10
	niifInfo   = 0x1
	niifWarn   = 0x2

	mfString       = 0x0
	mfGrayed       = 0x1
	mfSeparator    = 0x800
	tpmReturnCmd   = 0x0100
	tpmRightButton = 0x0002
	idiApplication = 32512

	cmdQuit = 100

	appTitle  = "KeySwap · ใดๆภาษา.com"
	mutexName = "Local\\DaidaiphasaKeySwap"
	quitName  = "Local\\DaidaiphasaKeySwapQuit"
)

type hotkey struct {
	id    uintptr
	mods  uintptr
	vk    uint16
	label string // shown in the tray menu and the start-up message
	mode  string // swap, romanize, braille, morse, translate
}

var hotkeys = []hotkey{
	{1, modControl | modShift, 'T', "Ctrl + Shift + T   สลับแป้น ไทย ⇄ อังกฤษ", "swap"},
	{2, modControl | modAlt, 'R', "Ctrl + Alt + R   ถอดเสียง", "romanize"},
	{3, modControl | modAlt, 'B', "Ctrl + Alt + B   อักษรเบรลล์", "braille"},
	{4, modControl | modAlt, 'M', "Ctrl + Alt + M   รหัสมอร์ส", "morse"},
	{5, modControl | modAlt, 'L', "Ctrl + Alt + L   แปลภาษา (ต้องต่อเน็ต)", "translate"},
}

// INPUT (keyboard) laid out for 64-bit Windows: 40 bytes.
type keyInput struct {
	typ   uint32
	_     uint32
	vk    uint16
	scan  uint16
	flags uint32
	time  uint32
	_     uint32
	extra uintptr
	_     [8]byte
}

type msg struct {
	hwnd    uintptr
	message uint32
	wParam  uintptr
	lParam  uintptr
	time    uint32
	ptX     int32
	ptY     int32
	private uint32
}

type wndClassEx struct {
	size       uint32
	style      uint32
	wndProc    uintptr
	clsExtra   int32
	wndExtra   int32
	instance   uintptr
	icon       uintptr
	cursor     uintptr
	background uintptr
	menuName   *uint16
	className  *uint16
	iconSm     uintptr
}

// NOTIFYICONDATAW (Vista+ layout), 976 bytes on 64-bit Windows.
type notifyIconData struct {
	size            uint32
	hwnd            uintptr
	id              uint32
	flags           uint32
	callbackMessage uint32
	icon            uintptr
	tip             [128]uint16
	state           uint32
	stateMask       uint32
	info            [256]uint16
	timeoutVersion  uint32
	infoTitle       [64]uint16
	infoFlags       uint32
	guid            [16]byte
	balloonIcon     uintptr
}

type point struct{ x, y int32 }

var (
	eng      *engine
	trayHwnd uintptr
	tray     notifyIconData
)

func u16(s string) *uint16 { p, _ := syscall.UTF16PtrFromString(s); return p }

func copyU16(dst []uint16, s string) {
	w, _ := syscall.UTF16FromString(s)
	if len(w) > len(dst) {
		w = w[:len(dst)]
		w[len(w)-1] = 0
	}
	copy(dst, w)
}

func messageBox(text string, flags uintptr) uintptr {
	r, _, _ := pMessageBoxW.Call(0, uintptr(unsafe.Pointer(u16(text))), uintptr(unsafe.Pointer(u16(appTitle))), flags|mbTopmost)
	return r
}

// notify shows a small balloon from the tray icon.
func notify(title, text string, warn bool) {
	if trayHwnd == 0 {
		return
	}
	tray.flags = nifInfo
	copyU16(tray.infoTitle[:], title)
	copyU16(tray.info[:], text)
	tray.infoFlags = niifInfo
	if warn {
		tray.infoFlags = niifWarn
	}
	pShellNotifyIconW.Call(nimModify, uintptr(unsafe.Pointer(&tray)))
}

func keyDown(vk uint16) bool {
	r, _, _ := pGetAsyncKeyState.Call(uintptr(vk))
	return r&0x8000 != 0
}

func send(keys ...keyInput) {
	if len(keys) == 0 {
		return
	}
	pSendInput.Call(uintptr(len(keys)), uintptr(unsafe.Pointer(&keys[0])), unsafe.Sizeof(keys[0]))
}

func k(vk uint16, up bool) keyInput {
	in := keyInput{typ: inputKeyboard, vk: vk}
	if up {
		in.flags = keyeventfKeyUp
	}
	return in
}

// chord sends Ctrl+<vk> cleanly.
func chord(vk uint16) {
	send(k(vkControl, false), k(vk, false), k(vk, true), k(vkControl, true))
}

func clipSeq() uint32 { r, _, _ := pGetClipboardSequenceNumber.Call(); return uint32(r) }

func openClip() bool {
	for i := 0; i < 20; i++ {
		if r, _, _ := pOpenClipboard.Call(0); r != 0 {
			return true
		}
		time.Sleep(15 * time.Millisecond)
	}
	return false
}

func readClip() (string, bool) {
	if r, _, _ := pIsClipboardFormatAvailable.Call(cfUnicodeText); r == 0 {
		return "", false
	}
	if !openClip() {
		return "", false
	}
	defer pCloseClipboard.Call()
	h, _, _ := pGetClipboardData.Call(cfUnicodeText)
	if h == 0 {
		return "", false
	}
	p, _, _ := pGlobalLock.Call(h)
	if p == 0 {
		return "", false
	}
	defer pGlobalUnlock.Call(h)
	var buf []uint16
	for i := uintptr(0); ; i += 2 {
		c := *(*uint16)(unsafe.Pointer(p + i))
		if c == 0 {
			break
		}
		buf = append(buf, c)
	}
	return syscall.UTF16ToString(buf), true
}

func writeClip(s string) bool {
	w, err := syscall.UTF16FromString(s)
	if err != nil {
		return false
	}
	size := uintptr(len(w) * 2)
	h, _, _ := pGlobalAlloc.Call(gmemMoveable, size)
	if h == 0 {
		return false
	}
	p, _, _ := pGlobalLock.Call(h)
	if p == 0 {
		pGlobalFree.Call(h)
		return false
	}
	for i, c := range w {
		*(*uint16)(unsafe.Pointer(p + uintptr(i*2))) = c
	}
	pGlobalUnlock.Call(h)
	if !openClip() {
		pGlobalFree.Call(h)
		return false
	}
	defer pCloseClipboard.Call()
	pEmptyClipboard.Call()
	if r, _, _ := pSetClipboardData.Call(cfUnicodeText, h); r == 0 {
		pGlobalFree.Call(h)
		return false
	}
	return true
}

func convert(mode, text string) (string, error) {
	if mode == "translate" {
		return Translate(text)
	}
	return eng.Run(mode, text)
}

// replaceSelection copies the selection, converts it, pastes the result over it,
// then puts back whatever the user had on the clipboard before.
func replaceSelection(h hotkey) {
	// Let go of the shortcut keys first, so the copy is a plain Ctrl+C.
	deadline := time.Now().Add(900 * time.Millisecond)
	for time.Now().Before(deadline) && (keyDown(vkShift) || keyDown(vkMenu) || keyDown(h.vk)) {
		time.Sleep(10 * time.Millisecond)
	}
	send(k(vkLShift, true), k(vkRShift, true), k(vkLMenu, true), k(vkRMenu, true))

	saved, hadText := readClip()
	before := clipSeq()
	chord(vkC)

	changed := false
	for i := 0; i < 50; i++ { // up to ~500 ms
		time.Sleep(10 * time.Millisecond)
		if clipSeq() != before {
			changed = true
			break
		}
	}
	if !changed {
		pMessageBeep.Call(0xFFFFFFFF) // nothing selected
		return
	}
	time.Sleep(20 * time.Millisecond)
	text, ok := readClip()
	if !ok || text == "" {
		return
	}
	out, err := convert(h.mode, text)
	if err != nil || out == "" || out == text {
		if hadText {
			writeClip(saved)
		}
		if err != nil {
			notify("KeySwap", err.Error(), true)
		}
		return
	}
	if !writeClip(out) {
		return
	}
	chord(vkV)
	time.Sleep(350 * time.Millisecond)
	if hadText {
		writeClip(saved)
	}
}

func showMenu(hwnd uintptr) {
	m, _, _ := pCreatePopupMenu.Call()
	add := func(flags uintptr, id uintptr, text string) {
		pAppendMenuW.Call(m, flags, id, uintptr(unsafe.Pointer(u16(text))))
	}
	add(mfString|mfGrayed, 0, "KeySwap · คลุมดำข้อความแล้วกด")
	add(mfSeparator, 0, "")
	for _, h := range hotkeys {
		add(mfString|mfGrayed, 0, h.label)
	}
	add(mfSeparator, 0, "")
	add(mfString, cmdQuit, "ปิด KeySwap")
	var pt point
	pGetCursorPos.Call(uintptr(unsafe.Pointer(&pt)))
	pSetForegroundWindow.Call(hwnd)
	cmd, _, _ := pTrackPopupMenu.Call(m, tpmReturnCmd|tpmRightButton, uintptr(pt.x), uintptr(pt.y), 0, hwnd, 0)
	pDestroyMenu.Call(m)
	if cmd == cmdQuit {
		pPostQuitMessage.Call(0)
	}
}

func wndProc(hwnd uintptr, message uint32, wParam, lParam uintptr) uintptr {
	switch message {
	case wmTray:
		if lParam == wmRButtonUp || lParam == wmLButtonUp {
			showMenu(hwnd)
		}
		return 0
	case wmDestroy:
		pPostQuitMessage.Call(0)
		return 0
	}
	r, _, _ := pDefWindowProcW.Call(hwnd, uintptr(message), wParam, lParam)
	return r
}

func addTray() {
	inst, _, _ := pGetModuleHandleW.Call(0)
	cls := u16("KeySwapTrayWindow")
	wc := wndClassEx{wndProc: syscall.NewCallback(wndProc), instance: inst, className: cls}
	wc.size = uint32(unsafe.Sizeof(wc))
	pRegisterClassExW.Call(uintptr(unsafe.Pointer(&wc)))
	// a hidden window that only receives tray messages
	trayHwnd, _, _ = pCreateWindowExW.Call(0, uintptr(unsafe.Pointer(cls)), uintptr(unsafe.Pointer(u16("KeySwap"))), 0, 0, 0, 0, 0, 0, 0, inst, 0)
	if trayHwnd == 0 {
		return
	}
	icon, _, _ := pLoadIconW.Call(0, idiApplication)
	tray = notifyIconData{hwnd: trayHwnd, id: 1, flags: nifMessage | nifIcon | nifTip, callbackMessage: wmTray, icon: icon}
	tray.size = uint32(unsafe.Sizeof(tray))
	copyU16(tray.tip[:], "KeySwap · ใดๆภาษา.com")
	pShellNotifyIconW.Call(nimAdd, uintptr(unsafe.Pointer(&tray)))
}

func main() {
	runtime.LockOSThread()

	// one copy at a time; opening it again offers to close the running one
	_, _, e := pCreateMutexW.Call(0, 0, uintptr(unsafe.Pointer(u16(mutexName))))
	if e == syscall.Errno(errorAlreadyExists) {
		if messageBox("KeySwap กำลังทำงานอยู่แล้ว\n\nต้องการปิด KeySwap ไหม?", mbYesNo|mbIconQuestion) == idYes {
			if ev, _, _ := pOpenEventW.Call(eventModifyState, 0, uintptr(unsafe.Pointer(u16(quitName)))); ev != 0 {
				pSetEvent.Call(ev)
			}
		}
		return
	}

	var err error
	if eng, err = newEngine(); err != nil {
		messageBox("KeySwap เริ่มทำงานไม่ได้: "+err.Error(), mbOK|mbIconWarning)
		return
	}

	var failed []string
	ok := 0
	for _, h := range hotkeys {
		if r, _, _ := pRegisterHotKey.Call(0, h.id, h.mods|modNoRepeat, uintptr(h.vk)); r == 0 {
			failed = append(failed, h.label)
		} else {
			ok++
		}
	}
	if ok == 0 {
		messageBox("ใช้คีย์ลัดของ KeySwap ไม่ได้เลย เพราะมีโปรแกรมอื่นใช้อยู่", mbOK|mbIconWarning)
		return
	}

	tid, _, _ := pGetCurrentThreadId.Call()
	if ev, _, _ := pCreateEventW.Call(0, 1, 0, uintptr(unsafe.Pointer(u16(quitName)))); ev != 0 {
		go func() {
			pWaitForSingleObject.Call(ev, infinite)
			pPostThreadMessageW.Call(tid, wmQuit, 0, 0)
		}()
	}

	addTray()
	defer pShellNotifyIconW.Call(nimDelete, uintptr(unsafe.Pointer(&tray)))

	welcome := "KeySwap พร้อมใช้งานแล้ว\n\nคลุมดำข้อความ แล้วกดคีย์ลัด:\n"
	for _, h := range hotkeys {
		welcome += "\n" + h.label
	}
	if len(failed) > 0 {
		welcome += "\n\nคีย์ลัดเหล่านี้มีโปรแกรมอื่นใช้อยู่ เลยใช้ไม่ได้:"
		for _, f := range failed {
			welcome += "\n" + f
		}
	}
	welcome += "\n\nดูคีย์ลัดหรือปิดโปรแกรมได้จากไอคอน KeySwap ที่มุมขวาล่างของจอ"
	go messageBox(welcome, mbOK|mbIconInfo)

	var m msg
	for {
		r, _, _ := pGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			return
		}
		if m.message == wmHotkey && m.hwnd == 0 {
			for _, h := range hotkeys {
				if m.wParam == h.id {
					replaceSelection(h)
				}
			}
			continue
		}
		pTranslateMessage.Call(uintptr(unsafe.Pointer(&m)))
		pDispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
	}
}
