package main

// UI language: "th" (default) or "en" — set at build time with -ldflags "-X main.uiLang=en"
var uiLang = "th"

// T returns the English text in English builds, otherwise the Thai original.
func T(s string) string {
	if uiLang == "en" {
		if v, ok := enText[s]; ok {
			return v
		}
	}
	return s
}

var enText = map[string]string{
	" with title \"KeySwap\" buttons {\"ตกลง\"} default button 1 with icon caution": " with title \"KeySwap\" buttons {\"OK\"} default button 1 with icon caution",
	" ไม่ได้":                                                   "",
	"Ctrl + Alt + B   อักษรเบรลล์":                              "Ctrl + Alt + B   Braille",
	"Ctrl + Alt + L   แปลภาษา (ต้องต่อเน็ต)":                    "Ctrl + Alt + L   Translate Thai ⇄ English (online)",
	"Ctrl + Alt + M   รหัสมอร์ส":                                "Ctrl + Alt + M   Morse code",
	"Ctrl + Alt + R   ถอดเสียง":                                 "Ctrl + Alt + R   Romanize Thai / Thai reading",
	"Ctrl + Shift + T   สลับแป้น ไทย ⇄ อังกฤษ":                  "Ctrl + Shift + T   Fix keyboard layout: Thai ⇄ English",
	"KeySwap · คลุมดำข้อความแล้วกด":                             "KeySwap · select text, then press",
	"KeySwap · ใดๆภาษา.com — คลุมดำข้อความแล้วกด":               "KeySwap · daidaiphasa.com — select text, then press",
	"KeySwap · ใดๆภาษา.com":                                     "KeySwap · daidaiphasa.com",
	"KeySwap กำลังทำงานอยู่แล้ว\n\nต้องการปิด KeySwap ไหม?":     "KeySwap is already running.\n\nDo you want to quit KeySwap?",
	"KeySwap พร้อมใช้งานแล้ว\n\nคลุมดำข้อความ แล้วกดคีย์ลัด:\n": "KeySwap is ready.\n\nSelect text, then press a shortcut:\n",
	"KeySwap หยุดทำงาน: ":                                       "KeySwap stopped: ",
	"KeySwap เริ่มทำงานไม่ได้: ":                                "KeySwap could not start: ",
	"KeySwap ได้รับอนุญาตแล้ว พร้อมใช้งาน":                      "KeySwap has permission and is ready",
	"\n\nขั้นตอนเดียวที่เหลือ: เปิด System Settings › Privacy & Security › Accessibility แล้วเปิดสวิตช์ของ KeySwap": "\n\nOne step left: open System Settings › Privacy & Security › Accessibility and switch KeySwap on.",
	"\n\nคีย์ลัดเหล่านี้มีแอปอื่นใช้อยู่:\n":                                                                        "\n\nThese shortcuts are used by another app:\n",
	"\n\nคีย์ลัดเหล่านี้มีโปรแกรมอื่นใช้อยู่ เลยใช้ไม่ได้:":                                                         "\n\nThese shortcuts are used by another program and are unavailable:",
	"\n\nดูคีย์ลัด รีสตาร์ต หรือปิด KeySwap ได้จากไอคอน ๆ ที่แถบเมนูด้านบนของจอ":                                    "\n\nSee the shortcuts, restart or quit KeySwap from the ⇄ icon in the menu bar.",
	"\n\nดูคีย์ลัดหรือปิดโปรแกรมได้จากไอคอน KeySwap ที่มุมขวาล่างของจอ":                                             "\n\nSee the shortcuts or quit from the KeySwap icon at the bottom right of the screen.",
	"display dialog %s with title \"KeySwap · ใดๆภาษา.com\" buttons {\"ตกลง\"} default button 1":                    "display dialog %s with title \"KeySwap · daidaiphasa.com\" buttons {\"OK\"} default button 1",
	"ปิด KeySwap": "Quit KeySwap",
	"ระบบแปลใช้ครบโควตาแล้ว ลองใหม่ภายหลัง": "Translation quota reached. Please try again later.",
	"รีสตาร์ต KeySwap":                 "Restart KeySwap",
	"อนุญาตการใช้งาน (Accessibility)…": "Allow access (Accessibility)…",
	"เชื่อมต่ออินเทอร์เน็ตไม่ได้":      "No internet connection",
	"เปิด System Settings":             "Open System Settings",
	"เปิดเว็บ ใดๆภาษา.com":             "Open daidaiphasa.com",
	"แปลไม่สำเร็จ":                     "Translation failed",
	"โหลด ":                            "Could not load ",
	"ใช้คีย์ลัดของ KeySwap ไม่ได้เลย เพราะมีโปรแกรมอื่นใช้อยู่": "None of KeySwap's shortcuts are available because other programs are using them.",
	"ๆ": "⇄",
	"⌃⇧T  สลับแป้น ไทย ⇄ อังกฤษ": "⌃⇧T  Fix keyboard layout: Thai ⇄ English",
	"⌃⌥B  อักษรเบรลล์":           "⌃⌥B  Braille",
	"⌃⌥L  แปลภาษา (ต้องต่อเน็ต)": "⌃⌥L  Translate Thai ⇄ English (online)",
	"⌃⌥M  รหัสมอร์ส":             "⌃⌥M  Morse code",
	"⌃⌥R  ถอดเสียง":              "⌃⌥R  Romanize Thai / Thai reading",
	`button returned of (display dialog "KeySwap กำลังทำงานอยู่แล้ว\n\nต้องการปิด KeySwap ไหม?" with title "KeySwap" buttons {"ยกเลิก", "ปิด KeySwap"} default button 2)`:                                                                                                                                                                                        `button returned of (display dialog "KeySwap is already running.\n\nDo you want to quit KeySwap?" with title "KeySwap" buttons {"Cancel", "Quit KeySwap"} default button 2)`,
	`button returned of (display dialog "KeySwap ต้องได้รับอนุญาตก่อนใช้งาน (ครั้งเดียว)\n\nเปิด System Settings › Privacy & Security › Accessibility (บาง macOS ชื่อ Device Control and Data Access) แล้วเปิดสวิตช์ KeySwap\n\nเปิดสวิตช์แล้ว กด รีสตาร์ต KeySwap" with title "KeySwap" buttons {"เปิด System Settings", "รีสตาร์ต KeySwap"} default button 2)`: `button returned of (display dialog "KeySwap needs your permission once before it can work.\n\nOpen System Settings › Privacy & Security › Accessibility (on some macOS versions: Device Control and Data Access) and switch KeySwap on.\n\nThen click Restart KeySwap." with title "KeySwap" buttons {"Open System Settings", "Restart KeySwap"} default button 2)`,
}
