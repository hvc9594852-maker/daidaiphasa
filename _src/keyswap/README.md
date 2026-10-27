# KeySwap (Windows)

คลุมดำข้อความที่พิมพ์ผิดภาษา แล้วกด Ctrl + Shift + T ข้อความจะสลับ ไทย (เกษมณี) ⇄ อังกฤษ (QWERTY) ทันที
รวมแป้นที่ต้องกด Shift ครบ (ฉ ฮ ศ ษ ซ โ ฤ ฆ ฏ ฯลฯ)

- เปิดโปรแกรม: ทำงานเบื้องหลัง
- เปิดซ้ำอีกครั้ง: ถามว่าจะปิดโปรแกรมไหม
- คืนค่าคลิปบอร์ดเดิมหลังสลับข้อความ

Build (จาก Linux/Mac ก็ได้ ไม่ต้องใช้ cgo):

    GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags "-H windowsgui -s -w" -o KeySwap-Windows.exe .

ทดสอบตารางแปลง: `go test ./...`
