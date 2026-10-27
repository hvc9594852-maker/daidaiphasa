package main

// Kedmanee (Thai) <-> US QWERTY, including the Shift layer.
const enKeys = "1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"
const thKeys = "ๅ/-ภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝ+๑๒๓๔ู฿๕๖๗๘๙๐\"ฎฑธํ๊ณฯญฐ,ฅฤฆฏโฌ็๋ษศซ.()ฉฮฺ์?ฒฬฦ"

// punctuation that exists on both layouts; never used to map Thai back to English
const shared = "/-+\".,()?"

var enToTh, thToEn map[rune]rune

func init() {
	en, th := []rune(enKeys), []rune(thKeys)
	if len(en) != len(th) {
		panic("key tables differ in length")
	}
	enToTh = make(map[rune]rune, len(en))
	thToEn = make(map[rune]rune, len(th))
	for i := range en {
		enToTh[en[i]] = th[i]
		if !containsRune(shared, th[i]) {
			if _, ok := thToEn[th[i]]; !ok {
				thToEn[th[i]] = en[i]
			}
		}
	}
}

func containsRune(s string, r rune) bool {
	for _, c := range s {
		if c == r {
			return true
		}
	}
	return false
}

// isThai reports whether r is in the Thai block.
func isThai(r rune) bool { return r >= 0x0E00 && r <= 0x0E7F }

func isLatinLetter(r rune) bool { return (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') }

// Convert swaps text typed on the wrong layout. Direction is decided by which
// script dominates: mostly Thai letters -> back to English keys, otherwise -> Thai.
func Convert(s string) string {
	th, en := 0, 0
	for _, r := range s {
		if isThai(r) {
			th++
		} else if isLatinLetter(r) {
			en++
		}
	}
	m := enToTh
	if th > en {
		m = thToEn
	}
	out := []rune(s)
	for i, r := range out {
		if v, ok := m[r]; ok {
			out[i] = v
		}
	}
	return string(out)
}
