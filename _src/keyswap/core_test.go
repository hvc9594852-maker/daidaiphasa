package main

import "testing"

func TestEngine(t *testing.T) {
	e, err := newEngine()
	if err != nil {
		t.Fatal(err)
	}
	cases := []struct{ mode, in, want string }{
		{"swap", "l;ylfu", "สวัสดี"},
		{"swap", "Cyo", "ฉัน"},
		{"swap", "ฉัน", "Cyo"},
		{"swap", "โรงเรียน", "Fi'giupo"},
		{"braille", "hello 123", "⠓⠑⠇⠇⠕ ⠼⠁⠃⠉"},
		{"braille", "⠓⠑⠇⠇⠕", "hello"},
		{"morse", "sos", "... --- ..."},
		{"morse", "... --- ...", "sos"},
		{"romanize", "สวัสดีครับ", "sawatdikhrap"},
		{"romanize", "กรุงเทพมหานคร", "krungthepmahanakhon"},
		{"romanize", "computer", "คอมพิวเตอร์"},
	}
	for _, c := range cases {
		got, err := e.Run(c.mode, c.in)
		if err != nil || got != c.want {
			t.Errorf("%s(%q) = %q, %v; want %q", c.mode, c.in, got, err, c.want)
		}
	}
	if !mostlyThai("สวัสดี hi") || mostlyThai("hello ครับ") {
		t.Error("mostlyThai")
	}
}
