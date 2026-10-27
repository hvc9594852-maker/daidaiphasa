//go:build windows

// KeySwap for Windows — select text typed on the wrong keyboard layout, press Ctrl+Shift+T,
// and it is replaced in place with the Thai (Kedmanee) <-> English (QWERTY) swap.
// Pure Win32 via syscall: RegisterHotKey, SendInput, clipboard. No cgo.
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

	pRegisterHotKey             = user32.NewProc("RegisterHotKey")
	pGetMessageW                = user32.NewProc("GetMessageW")
	pPostThreadMessageW         = user32.NewProc("PostThreadMessageW")
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
	modControl  = 0x0002
	modShift    = 0x0004
	modNoRepeat = 0x4000
	wmHotkey    = 0x0312
	wmQuit      = 0x0012
	hotkeyID    = 1

	vkShift   = 0x10
	vkControl = 0x11
	vkMenu    = 0x12
	vkLShift  = 0xA0
	vkRShift  = 0xA1
	vkC       = 0x43
	vkT       = 0x54
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

	appTitle  = "KeySwap · ใดๆภาษา.com"
	mutexName = "Local\\DaidaiphasaKeySwap"
	quitName  = "Local\\DaidaiphasaKeySwapQuit"
)

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

func u16(s string) *uint16 { p, _ := syscall.UTF16PtrFromString(s); return p }

func messageBox(text string, flags uintptr) uintptr {
	r, _, _ := pMessageBoxW.Call(0, uintptr(unsafe.Pointer(u16(text))), uintptr(unsafe.Pointer(u16(appTitle))), flags|mbTopmost)
	return r
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

func swapSelection() {
	// Let go of the hotkey keys first, so the copy is a plain Ctrl+C (not Ctrl+Shift+C).
	deadline := time.Now().Add(900 * time.Millisecond)
	for time.Now().Before(deadline) && (keyDown(vkShift) || keyDown(vkT) || keyDown(vkMenu)) {
		time.Sleep(10 * time.Millisecond)
	}
	send(k(vkLShift, true), k(vkRShift, true))

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
	out := Convert(text)
	if out == text {
		if hadText {
			writeClip(saved)
		}
		return
	}
	if !writeClip(out) {
		return
	}
	chord(vkV)
	// give the app time to read the clipboard, then put back what the user had copied before
	time.Sleep(350 * time.Millisecond)
	if hadText {
		writeClip(saved)
	}
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

	ok, _, _ := pRegisterHotKey.Call(0, hotkeyID, modControl|modShift|modNoRepeat, vkT)
	if ok == 0 {
		messageBox("ใช้คีย์ลัด Ctrl + Shift + T ไม่ได้ เพราะมีโปรแกรมอื่นใช้อยู่\nปิดโปรแกรมนั้นแล้วเปิด KeySwap ใหม่อีกครั้ง", mbOK|mbIconWarning)
		return
	}

	tid, _, _ := pGetCurrentThreadId.Call()
	ev, _, _ := pCreateEventW.Call(0, 1, 0, uintptr(unsafe.Pointer(u16(quitName))))
	if ev != 0 {
		go func() {
			pWaitForSingleObject.Call(ev, infinite)
			pPostThreadMessageW.Call(tid, wmQuit, 0, 0)
		}()
	}

	go messageBox("KeySwap พร้อมใช้งานแล้ว\n\nคลุมดำข้อความที่พิมพ์ผิดภาษา แล้วกด Ctrl + Shift + T\nโปรแกรมจะทำงานอยู่เบื้องหลัง\n\nถ้าต้องการปิด ให้เปิด KeySwap อีกครั้ง", mbOK|mbIconInfo)

	var m msg
	for {
		r, _, _ := pGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			return
		}
		if m.message == wmHotkey && m.wParam == hotkeyID {
			swapSelection()
		}
	}
}
