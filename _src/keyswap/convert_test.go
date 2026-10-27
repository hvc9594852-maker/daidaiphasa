package main

import "testing"

func TestConvert(t *testing.T) {
	cases := map[string]string{
		"l;ylfu":      "สวัสดี",
		"Cyo":         "ฉัน",
		"dbo-hk;":     "กินข้าว",
		"ฉัน":         "Cyo",
		"สวัสดีครับ":  "l;ylfu8iy[",
		"้ำสสน":       "hello",
		"Hello world": "็ำสสน ไนพสก", // capital H is Shift+H = ็
		"ศรีษะ":       "LiuKt",
		"โรงเรียน":    "Fi'giupo",
		"ฮ่าๆ":        "Vjkq",
		"":            "",
		"1234":        "ๅ/-ภ",
		"\nl;ylfu\t":  "\nสวัสดี\t",
	}
	for in, want := range cases {
		if got := Convert(in); got != want {
			t.Errorf("Convert(%q) = %q, want %q", in, got, want)
		}
	}
	// round trip for every key
	for _, r := range enKeys {
		s := string(r) + "a" // keep it detected as English
		back := Convert(Convert(s))
		if containsRune(shared, enToTh[r]) {
			continue
		}
		if back != s {
			t.Errorf("round trip %q -> %q -> %q", s, Convert(s), back)
		}
	}
}
