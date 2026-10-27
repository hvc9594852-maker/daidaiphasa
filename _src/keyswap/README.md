# KeySwap (Windows + Mac)

คลุมดำข้อความในแอปไหนก็ได้ แล้วกดคีย์ลัด ข้อความจะถูกแทนที่ทันที

| ทำอะไร | Windows | Mac |
|---|---|---|
| สลับแป้น ไทย ⇄ อังกฤษ (เกษมณี/QWERTY รวมแป้น Shift) | Ctrl+Shift+T | ⌃⇧T |
| ถอดเสียง (ไทย → RTGS / อังกฤษ → คำอ่านไทย) | Ctrl+Alt+R | ⌃⌥R |
| อักษรเบรลล์ ⇄ อังกฤษ | Ctrl+Alt+B | ⌃⌥B |
| รหัสมอร์ส ⇄ อังกฤษ | Ctrl+Alt+M | ⌃⌥M |
| แปลภาษา (ไทย → อังกฤษ, อื่นๆ → ไทย, ผ่าน /api/translate) | Ctrl+Alt+L | ⌃⌥L |

- ตัวแปลงใช้โค้ดเดียวกับหน้าเว็บ: `js/core.js` สร้างจาก index.html ด้วย `tools/gen_core.py` แล้วรันใน goja
- Windows: Win32 ล้วน (RegisterHotKey, SendInput, คลิปบอร์ด, ไอคอนถาด) ไม่ใช้ cgo
- Mac: Carbon hotkey + CGEvent + NSPasteboard ผ่าน purego ไม่ใช้ cgo, ไอคอน ๆ ที่แถบเมนู, ต้องอนุญาต Accessibility ครั้งแรก
- ไฟล์ Mac ที่แจกเซ็นแบบ ad-hoc ด้วย `codesign --force --deep --sign -` (ต้องเซ็นทั้ง bundle ไม่งั้น macOS ไม่จำสิทธิ์ Accessibility)

Build:

    python3 tools/gen_core.py ../../index.html js/core.js
    go test ./...
    GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags "-H windowsgui -s -w" -o KeySwap-Windows.exe .
    sh tools/build_mac.sh      # แล้วเซ็นบน Mac: codesign --force --deep --sign - build/KeySwap.app

go.mod ใช้ replace ชี้ไปที่ goja / x/text / yaml / purego ที่ clone ไว้ในเครื่อง (proxy.golang.org ใช้ไม่ได้ในเครื่อง build) แก้ path ตามเครื่องของคุณ
