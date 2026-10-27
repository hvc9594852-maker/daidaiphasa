package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"time"
	"unicode"
)

const translateURL = "https://daidaiphasa.com/api/translate"

var httpClient = &http.Client{Timeout: 10 * time.Second}

// mostlyThai reports whether Thai letters outnumber Latin letters.
func mostlyThai(s string) bool {
	th, en := 0, 0
	for _, r := range s {
		if r >= 0x0E00 && r <= 0x0E7F {
			th++
		} else if r < 128 && unicode.IsLetter(r) {
			en++
		}
	}
	return th > en
}

// Translate sends Thai text to English and anything else to Thai, through the
// site's free translator (Azure, free tier). Text is capped at 1,000 characters there.
func Translate(text string) (string, error) {
	to := "th"
	if mostlyThai(text) {
		to = "en"
	}
	body, _ := json.Marshal(map[string]string{"text": text, "from": "", "to": to})
	req, err := http.NewRequest("POST", translateURL, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client", "KeySwap")
	resp, err := httpClient.Do(req)
	if err != nil {
		return "", errors.New("เชื่อมต่ออินเทอร์เน็ตไม่ได้")
	}
	defer resp.Body.Close()
	var out struct {
		Text  string `json:"text"`
		Error string `json:"error"`
	}
	_ = json.NewDecoder(resp.Body).Decode(&out)
	switch {
	case resp.StatusCode == 429:
		return "", errors.New("ระบบแปลใช้ครบโควตาแล้ว ลองใหม่ภายหลัง")
	case resp.StatusCode != 200 || out.Text == "":
		return "", errors.New("แปลไม่สำเร็จ")
	}
	return out.Text, nil
}
