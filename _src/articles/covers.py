"""Cover illustrations for the articles. Inline SVG (so page fonts apply). cover(slug, uid) -> svg string."""
import json, os, re, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
HANDS = json.load(open(os.path.join(HERE, 'hands.json')))

INK = '#1A1A18'; ACC = '#FF5A1F'
SERIF = "'Noto Serif Thai',serif"; SANS = "'IBM Plex Sans Thai Looped',sans-serif"; MONO = "ui-monospace,'SF Mono',Menlo,monospace"

def grain(uid, op=.22):
    return (f'<filter id="g{uid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>'
            f'<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 {op} 0"/></filter>')

def frame(uid, bg, inner, defs='', op=.22, label=''):
    return (f'<svg class="art" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="{label}" xmlns="http://www.w3.org/2000/svg">'
            f'<defs>{grain(uid, op)}{defs}</defs><rect width="1600" height="1000" fill="{bg}"/>{inner}'
            f'<rect width="1600" height="1000" filter="url(#g{uid})" opacity=".9"/></svg>')

# ------------------------------------------------------------------ keyboard
KB_ROWS = [
    [('q','ๆ'),('w','ไ'),('e','ำ'),('r','พ'),('t','ะ'),('y','ั'),('u','ี'),('i','ร'),('o','น'),('p','ย'),('[','บ'),(']','ล')],
    [('a','ฟ'),('s','ห'),('d','ก'),('f','ด'),('g','เ'),('h','้'),('j','่'),('k','า'),('l','ส'),(';','ว'),("'",'ง')],
    [('z','ผ'),('x','ป'),('c','แ'),('v','อ'),('b','ิ'),('n','ื'),('m','ท'),(',','ม'),('.','ใ'),('/','ฝ')],
]
HOT = {'l', ';', 'y', 'f', 'u'}
def keyboard(uid):
    k = 150; gap = 14; out = []
    offs = [0, 40, 88]
    for r, row in enumerate(KB_ROWS):
        for c, (en, th) in enumerate(row):
            x = offs[r] + c * (k + gap); y = r * (k + gap)
            hot = en in HOT
            top = ACC if hot else '#FBF8F2'
            out.append(f'<g transform="translate({x},{y})">'
                       f'<rect x="0" y="10" width="{k}" height="{k}" rx="22" fill="{"#B8420F" if hot else "#CFC6B6"}"/>'
                       f'<rect x="0" y="0" width="{k}" height="{k}" rx="22" fill="{top}" stroke="{INK}" stroke-opacity=".12"/>'
                       f'<rect x="14" y="12" width="{k-28}" height="{k-34}" rx="16" fill="#fff" opacity="{.18 if hot else .55}"/>'
                       f'<text x="24" y="58" font-family="{MONO}" font-size="40" font-weight="600" fill="{INK if not hot else "#1A0A02"}" opacity="{.95 if hot else .55}">{en.upper() if en.isalpha() else en}</text>'
                       f'<text x="{k-26}" y="{k-26}" text-anchor="end" font-family="{SERIF}" font-size="56" font-weight="600" fill="{INK}" opacity="{1 if hot else .8}">{"◌"+th if th in "ัีิื้่ำ" else th}</text></g>')
    board = ''.join(out)
    note = (f'<g transform="translate(1050,640) rotate(4)"><rect x="0" y="0" width="470" height="250" rx="6" fill="#FFFDF8"/>'
            f'<rect x="0" y="0" width="470" height="250" rx="6" fill="none" stroke="{INK}" stroke-opacity=".08"/>'
            f'<text x="44" y="104" font-family="{MONO}" font-size="64" fill="{INK}" opacity=".45">l;ylfu</text>'
            f'<path d="M36 82 L300 86" stroke="{ACC}" stroke-width="7" stroke-linecap="round"/>'
            f'<text x="44" y="200" font-family="{SERIF}" font-size="76" font-weight="700" fill="{INK}">สวัสดี</text></g>')
    inner = (f'<g transform="translate(-60,330) rotate(-9)">'
             f'<rect x="-40" y="-40" width="2100" height="560" rx="40" fill="#2A2824"/>{board}</g>' + note)
    return frame(uid, '#E9E2D5', inner, label='คีย์บอร์ดที่ปุ่ม L ; Y F U ถูกเน้นสี และกระดาษโน้ตเขียนว่า l;ylfu ขีดฆ่า แล้วเขียนว่าสวัสดี')

# ------------------------------------------------------------------ fingerspelling
def fingers(uid):
    out = []
    pairs = [('k', 'ก'), ('t', 'ต'), ('s', 'ส'), ('p', 'พ')]
    for i, (h, th) in enumerate(pairs):
        svg = HANDS[h]
        svg = svg.replace('<svg ', f'<svg x="{100 + i*360}" y="110" width="340" height="440" ')
        out.append(svg)
        cx = 100 + i*360 + 170
        out.append(f'<text x="{cx}" y="745" text-anchor="middle" font-family="{SERIF}" font-size="150" font-weight="700" fill="{INK}">{th}</text>')
        out.append(f'<text x="{cx}" y="815" text-anchor="middle" font-family="{SANS}" font-size="34" letter-spacing="6" fill="{INK}" opacity=".5">{h.upper()}</text>')
    out.append(f'<circle cx="1490" cy="110" r="16" fill="{ACC}"/>')
    return frame(uid, '#E1E5DC', ''.join(out), label='ภาพวาดท่ามือสี่ท่า K T S P คู่กับตัวอักษร ก ต ส พ')

# ------------------------------------------------------------------ names
def names(uid):
    inner = (
        f'<text x="800" y="420" text-anchor="middle" font-family="{SERIF}" font-size="300" font-weight="700" fill="{INK}">ธนพล</text>'
        f'<g font-family="{MONO}" font-size="76" fill="{INK}">'
        f'<text x="250" y="680" opacity=".38">Thanapol</text><path d="M240 656 L650 652" stroke="{INK}" stroke-opacity=".5" stroke-width="5"/>'
        f'<text x="990" y="680" opacity=".38">Tanapon</text><path d="M980 656 L1370 660" stroke="{INK}" stroke-opacity=".5" stroke-width="5"/>'
        f'<text x="800" y="840" text-anchor="middle" font-weight="700">Thanaphon</text></g>'
        f'<ellipse cx="800" cy="815" rx="330" ry="86" fill="none" stroke="{ACC}" stroke-width="8" transform="rotate(-3 800 815)"/>'
        f'<text x="800" y="520" text-anchor="middle" font-family="{SANS}" font-size="38" letter-spacing="12" fill="{INK}" opacity=".45">ทะ · นะ · พน</text>')
    return frame(uid, '#E4E8EE', inner, label='ชื่อธนพล กับการสะกดภาษาอังกฤษสามแบบ แบบ Thanaphon ถูกวงไว้')

# ------------------------------------------------------------------ morse
def morse(uid):
    sig = '... --- ... / .- -. -.. / .... . .-.. .-.. ---'
    x = 0; marks = []
    for ch in sig:
        if ch == '.': marks.append(f'<circle cx="{x+14}" cy="0" r="14"/>'); x += 52
        elif ch == '-': marks.append(f'<rect x="{x}" y="-14" width="84" height="28" rx="14"/>'); x += 122
        elif ch == ' ': x += 46
        else: x += 70
    tape = (f'<g transform="translate(-80,620) rotate(-14)">'
            f'<rect x="0" y="-80" width="2200" height="160" fill="#F3EBDD"/>'
            f'<rect x="0" y="-80" width="2200" height="6" fill="#000" opacity=".06"/>'
            f'<g transform="translate(150,0)" fill="{INK}">{"".join(marks)}</g></g>')
    lamp = (f'<circle cx="1340" cy="740" r="130" fill="{ACC}" opacity=".16"/><circle cx="1340" cy="740" r="64" fill="{ACC}"/>'
            f'<circle cx="1320" cy="718" r="18" fill="#fff" opacity=".5"/>')
    txt = f'<text x="330" y="250" font-family="{SERIF}" font-size="120" font-weight="700" fill="#F3EBDD">SOS</text><text x="336" y="320" font-family="{MONO}" font-size="44" fill="#F3EBDD" opacity=".55">··· ––– ···</text>'
    return frame(uid, '#20242C', lamp + txt + tape, op=.3, label='แถบกระดาษโทรเลขพิมพ์จุดและขีดรหัสมอร์ส กับไฟสัญญาณสีส้ม')

# ------------------------------------------------------------------ phasa lu
def lu(uid):
    b1 = (f'<g transform="translate(170,190)"><path d="M0 60 Q0 0 60 0 L640 0 Q700 0 700 60 L700 300 Q700 360 640 360 L220 360 L120 450 L140 360 L60 360 Q0 360 0 300 Z" fill="#FFFDF8"/>'
          f'<text x="350" y="245" text-anchor="middle" font-family="{SERIF}" font-size="170" font-weight="700" fill="{INK}" opacity=".85">รักนะ</text></g>')
    b2 = (f'<g transform="translate(700,470)"><path d="M0 60 Q0 0 60 0 L700 0 Q760 0 760 60 L760 300 Q760 360 700 360 L620 360 L640 450 L540 360 L60 360 Q0 360 0 300 Z" fill="{INK}"/>'
          f'<text x="380" y="240" text-anchor="middle" font-family="{SERIF}" font-size="140" font-weight="700" fill="#FFFDF8">'
          f'<tspan fill="{ACC}">ซ</tspan>ัก<tspan fill="#F6C1A8">ร</tspan>ุก <tspan fill="{ACC}">ล</tspan>ะ<tspan fill="#F6C1A8">น</tspan>ุ</text></g>')
    return frame(uid, '#F0E1D8', b1 + b2, label='ลูกโป่งคำพูดสองอัน อันแรกเขียนว่ารักนะ อันที่สองเขียนว่าซักรุก ละนุ')

# ------------------------------------------------------------------ braille
BR = {'h': (1, 2, 5), 'e': (1, 5), 'l': (1, 2, 3), 'o': (1, 3, 5)}
def braille(uid):
    defs = (f'<radialGradient id="d{uid}" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F2EEE6"/><stop offset="1" stop-color="#CFC7B8"/></radialGradient>'
            f'<filter id="s{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>')
    out = []
    pos = {1: (0, 0), 2: (0, 1), 3: (0, 2), 4: (1, 0), 5: (1, 1), 6: (1, 2)}
    sp = 112; cw = 290
    word = 'hello'
    x0 = 800 - (len(word) * cw - (cw - sp)) / 2; y0 = 340
    for i, ch in enumerate(word):
        for d in range(1, 7):
            cx = x0 + i * cw + pos[d][0] * sp; cy = y0 + pos[d][1] * sp
            if d in BR[ch]:
                out.append(f'<circle cx="{cx+12}" cy="{cy+15}" r="40" fill="#5E5444" opacity=".45" filter="url(#s{uid})"/>'
                           f'<circle cx="{cx}" cy="{cy}" r="40" fill="url(#d{uid})"/>')
            else:
                out.append(f'<circle cx="{cx}" cy="{cy}" r="5" fill="#B9B0A0" opacity=".45"/>')
    lab = ''.join(f'<text x="{x0 + i*cw + sp/2}" y="{y0 + 2*sp + 150}" text-anchor="middle" font-family="{SERIF}" font-size="54" fill="{INK}" opacity=".35">{c}</text>' for i, c in enumerate(word))
    finger = (f'<g opacity=".14" transform="translate(1180,620) rotate(-28)"><rect x="0" y="0" width="190" height="700" rx="95" fill="{INK}"/></g>')
    return frame(uid, '#DDD4C3', ''.join(out) + lab + f'<circle cx="150" cy="140" r="14" fill="{ACC}"/>', defs, op=.25,
                 label='จุดนูนอักษรเบรลล์บนกระดาษ สะกดคำว่า hello')

COVERS = {'fix-wrong-keyboard-language': keyboard, 'thai-fingerspelling-chart': fingers, 'thai-name-in-english': names,
          'morse-code-chart': morse, 'phasa-lu': lu, 'braille-alphabet': braille}
def cover(slug, uid):
    return COVERS[slug](uid)

# ---- generic typographic cover for daily posts
# spec = {'big': 'คำหรือตัวอักษรใหญ่ (สั้นๆ 1–8 ตัว)', 'small': 'บรรทัดเล็กใต้คำใหญ่', 'bg': '#E4E8EE'}
BG_CHOICES = ['#E9E2D5', '#E1E5DC', '#E4E8EE', '#F0E1D8', '#E7E2EC', '#DCE6E3', '#EDE4D3', '#E2E6F0']
def _esc(t): return str(t).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def generic(spec, slug):
    bg = spec.get('bg') or BG_CHOICES[sum(map(ord, slug)) % len(BG_CHOICES)]
    big = _esc(spec.get('big', '')); small = _esc(spec.get('small', ''))
    size = 360 if len(spec.get('big', '')) <= 4 else (260 if len(spec.get('big', '')) <= 7 else 190)
    def f(uid):
        return frame(uid, bg, map_lines() +
            f'<text x="800" y="560" text-anchor="middle" font-family="{SERIF},{CJK}" font-size="{size}" font-weight="700" fill="{INK}">{big}</text>'
            f'<path d="M560 660 H1040" stroke="{ACC}" stroke-width="12" stroke-linecap="round"/>'
            f'<text x="800" y="770" text-anchor="middle" font-family="{SANS}" font-size="52" fill="{INK}" opacity=".6">{small}</text>'
            f'<circle cx="1460" cy="140" r="16" fill="{ACC}"/>', label=small or big)
    return f
def register_cover(slug, spec):
    if slug not in COVERS: COVERS[slug] = generic(spec, slug)

# ------------------------------------------------------------------ guides (where to learn)
CJK = "'Noto Serif SC','Noto Serif JP','Noto Serif KR','Songti SC','Hiragino Mincho ProN','Apple SD Gothic Neo',serif"
def pin(x, y, s=1.0, col=ACC):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M0 0 C-46 -62 -64 -92 -64 -124 A64 64 0 1 1 64 -124 C64 -92 46 -62 0 0 Z" fill="{col}"/>'
            f'<circle cx="0" cy="-124" r="24" fill="#FFFDF8"/></g>')
def map_lines(col='#000', op=.08):
    return (f'<g stroke="{col}" stroke-opacity="{op}" stroke-width="10" fill="none">'
            '<path d="M-20 720 C300 640 520 760 820 660 S1300 520 1640 600"/><path d="M260 -20 C300 300 200 560 330 1020"/>'
            '<path d="M1080 -20 C1020 260 1180 520 1100 1020"/><path d="M-20 300 L1640 380"/></g>')

def g_sign(uid):
    svg = HANDS['b'] if 'b' in HANDS else HANDS['k']
    hand = svg.replace('<svg ', '<svg x="520" y="120" width="560" height="700" ')
    return frame(uid, '#E7E2EC', map_lines() + hand + pin(1260, 520, 1.0) +
                 f'<text x="160" y="880" font-family="{SERIF}" font-size="96" font-weight="700" fill="{INK}">ที่เรียนภาษามือ</text>',
                 label='ภาพมือกับหมุดแผนที่')
def g_chinese(uid):
    cells = ''
    for i, ch in enumerate('你好'):
        x = 360 + i * 470
        cells += (f'<rect x="{x}" y="200" width="420" height="420" fill="#FFFDF8" stroke="{ACC}" stroke-width="5"/>'
                  f'<path d="M{x} 410 H{x+420} M{x+210} 200 V620 M{x} 200 L{x+420} 620 M{x+420} 200 L{x} 620" stroke="{ACC}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 12"/>'
                  f'<text x="{x+210}" y="560" text-anchor="middle" font-family="{CJK}" font-size="330" fill="{INK}">{ch}</text>')
    return frame(uid, '#EDE4D3', map_lines() + cells + f'<text x="800" y="790" text-anchor="middle" font-family="{SANS}" font-size="56" fill="{INK}" opacity=".55">nǐ hǎo</text>' + pin(1400, 920, .8),
                 label='ตัวอักษรจีน 你好 ในตารางฝึกเขียน')
def g_english(uid):
    return frame(uid, '#DCE6E3', map_lines() +
                 f'<text x="800" y="640" text-anchor="middle" font-family="Georgia,{SERIF}" font-size="560" font-weight="700" fill="{INK}">Aa</text>'
                 f'<path d="M420 700 H1180" stroke="{ACC}" stroke-width="14" stroke-linecap="round"/>'
                 f'<text x="800" y="830" text-anchor="middle" font-family="{SANS}" font-size="54" fill="{INK}" opacity=".55">A1 · A2 · B1 · B2 · C1 · C2</text>' + pin(1360, 470, .9),
                 label='ตัวอักษร Aa กับระดับภาษา CEFR')
def g_japanese(uid):
    cols = ''
    for i in range(9):
        x = 230 + i * 128
        cols += f'<rect x="{x}" y="150" width="112" height="640" fill="none" stroke="{ACC}" stroke-opacity=".45" stroke-width="3"/>'
        for j in range(1, 5): cols += f'<line x1="{x}" y1="{150+j*128}" x2="{x+112}" y2="{150+j*128}" stroke="{ACC}" stroke-opacity=".3" stroke-width="2"/>'
    word = 'こんにちは'
    txt = ''.join(f'<text x="{230+6*128+56}" y="{150+k*128+100}" text-anchor="middle" font-family="{CJK}" font-size="92" fill="{INK}">{c}</text>' for k, c in enumerate(word))
    return frame(uid, '#F1E7E4', map_lines() + f'<rect x="210" y="130" width="1192" height="680" fill="#FFFDF8"/>' + cols + txt +
                 f'<circle cx="420" cy="460" r="120" fill="{ACC}"/>' + pin(1440, 960, .7),
                 label='คำว่า こんにちは บนกระดาษตารางเขียนภาษาญี่ปุ่น')
def g_korean(uid):
    return frame(uid, '#E2E6F0', map_lines() +
                 f'<text x="800" y="600" text-anchor="middle" font-family="{CJK}" font-size="380" font-weight="700" fill="{INK}">한글</text>'
                 f'<g fill="{ACC}"><circle cx="300" cy="780" r="34"/><rect x="380" y="760" width="200" height="40" rx="20"/><rect x="620" y="700" width="40" height="160" rx="20"/></g>'
                 f'<text x="1300" y="800" text-anchor="end" font-family="{SANS}" font-size="54" fill="{INK}" opacity=".55">안녕하세요</text>' + pin(1400, 420, .8),
                 label='ตัวอักษรเกาหลี 한글')
def g_french(uid):
    stamp = (f'<g transform="translate(1180,300) rotate(-12)"><circle r="170" fill="none" stroke="{ACC}" stroke-width="10"/><circle r="140" fill="none" stroke="{ACC}" stroke-width="3"/>'
             f'<text y="-20" text-anchor="middle" font-family="{SANS}" font-size="44" fill="{ACC}" font-weight="600">DELF</text>'
             f'<text y="44" text-anchor="middle" font-family="{SANS}" font-size="56" fill="{ACC}" font-weight="700">A1</text></g>')
    return frame(uid, '#E9E3EF', map_lines() + stamp +
                 f'<text x="160" y="640" font-family="Georgia,{SERIF}" font-style="italic" font-size="250" fill="{INK}">Bonjour</text>'
                 f'<path d="M170 690 C500 650 800 720 1050 680" stroke="{ACC}" stroke-width="10" fill="none" stroke-linecap="round"/>' + pin(330, 920, .6),
                 label='คำว่า Bonjour กับตราประทับ DELF A1')
def g_german(uid):
    return frame(uid, '#E6E8DE', map_lines() +
                 f'<text x="800" y="560" text-anchor="middle" font-family="Georgia,{SERIF}" font-size="260" font-weight="700" fill="{INK}">Guten Tag</text>'
                 f'<g transform="translate(800,720)"><rect x="-430" y="-40" width="860" height="80" rx="40" fill="#FFFDF8"/>'
                 f'<text y="18" text-anchor="middle" font-family="{SANS}" font-size="46" fill="{INK}">A1 → A2 → B1 → B2</text></g>'
                 f'<g fill="{ACC}"><circle cx="1420" cy="200" r="34"/><circle cx="1520" cy="200" r="34"/></g>' + pin(240, 920, .7),
                 label='คำว่า Guten Tag กับระดับภาษา')
COVERS.update({'where-to-learn-thai-sign-language': g_sign, 'where-to-learn-chinese': g_chinese, 'where-to-learn-english': g_english,
               'where-to-learn-japanese': g_japanese, 'where-to-learn-korean': g_korean, 'where-to-learn-french': g_french,
               'where-to-learn-german': g_german})
