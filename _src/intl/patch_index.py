# One-time, idempotent patch: language auto-detect, Thai-only sections hidden for non-Thai UI, hreflang, English tool URLs.
import re, sys
P = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
s = open(P, encoding='utf-8').read()
def s_idx(): return s
def rep(old, new, count=1):
    global s
    if new in s: return
    assert old in s, old[:80]
    s = s.replace(old, new, count)

rep('<link rel="canonical" href="https://daidaiphasa.com/">',
    '<link rel="canonical" href="https://daidaiphasa.com/">\n<link rel="alternate" hreflang="th" href="https://daidaiphasa.com/">\n<link rel="alternate" hreflang="en" href="https://daidaiphasa.com/en/">\n<link rel="alternate" hreflang="x-default" href="https://daidaiphasa.com/en/">')
rep('<link rel="stylesheet" href="/rx.css?v=28">',
    '<link rel="stylesheet" href="/rx.css?v=28">\n<style>html[data-ui]:not([data-ui="th"]) .th-only{display:none!important}html[data-ui="th"] .intl-only{display:none!important}</style>')
for a in ('community', 'lexicon', 'contribute', 'learn'):
    rep(f'<a href="#{a}">', f'<a href="#{a}" class="th-only">')
rep('<a href="/articles">บทความ<', '<a href="/articles" class="th-only">บทความ<', 2)
rep('<section class="community" id="community"', '<section class="community th-only" id="community"')
rep('<section class="sec lexicon" id="lexicon"', '<section class="sec lexicon th-only" id="lexicon"')
rep('<section class="sec contrib" id="contribute"', '<section class="sec contrib th-only" id="contribute"')
rep('<aside class="ks" id="keyswap"', '<aside class="ks th-only" id="keyswap"')
for m in ('fix', 'slang', 'lu'):
    rep(f'<li><button data-go="{m}">', f'<li class="th-only"><button data-go="{m}">')
rep("b.className='tab'; b.setAttribute('role','tab'); b.id='tab-'+m.id;",
    "b.className='tab'+(TH_ONLY.indexOf(m.id)>=0?' th-only':''); b.setAttribute('role','tab'); b.id='tab-'+m.id;")
rep("  // tabs\n  MODES.forEach(function(m,i){", "  var TH_ONLY=['fix','slang','lu'];\n  // tabs\n  MODES.forEach(function(m,i){")
# language: forced by /en path or window.__UI, then saved choice, then the browser's language
rep("try { UIL = localStorage.getItem('lh-ui') || 'th'; } catch(e){}",
    "var EN_PATH=/^\\/en(\\/|$)/.test(location.pathname);\n"
    "  try { var _sv=localStorage.getItem('lh-ui'); var _bl=((navigator.languages&&navigator.languages[0])||navigator.language||'th').toLowerCase().slice(0,2);\n"
    "    var _bot=/bot|crawl|spider|slurp|lighthouse|inspection/i.test(navigator.userAgent||'');\n    UIL = window.__UI || (EN_PATH?'en':null) || _sv || (_bot?'th':(_bl==='th'?'th':(['zh','ja','ko'].indexOf(_bl)>=0?_bl:'en'))); } catch(e){ if(EN_PATH) UIL='en'; }")
rep("  function setUiLang(l){\n    UIL=l;",
    "  function setUiLang(l){\n    if(EN_PATH && l==='th'){ try{ localStorage.setItem('lh-ui','th'); }catch(e){} location.href='/'; return; }\n    UIL=l;")
rep("    translateTree(document.body);\n    if (!$('countryView').hidden && CV.lang) paintLangName(CV.lang);",
    "    translateTree(document.body);\n    if (!$('countryView').hidden && CV.lang) paintLangName(CV.lang);\n"
    "    Array.prototype.forEach.call(document.querySelectorAll('a.nav-ebook'), function(a){ a.href = l==='th' ? '/ebook' : '/en/ebook'; });\n"
    "    if (l!=='th' && st && TH_ONLY.indexOf(st.mode)>=0 && typeof setMode==='function') setMode('tr',true);")
rep("var startMode='fix'; try{ var sm=localStorage.getItem('lh-mode'); if(sm && MODES.some(function(m){return m.id===sm;})) startMode=sm; }catch(e){}",
    "var startMode='fix'; try{ var sm=localStorage.getItem('lh-mode'); if(sm && MODES.some(function(m){return m.id===sm;})) startMode=sm; }catch(e){}\n  if(UIL!=='th' && TH_ONLY.indexOf(startMode)>=0) startMode='tr';")
# English tool URLs: /en/<tool> uses the same routes with English titles
rep("    var path=location.pathname.replace(/\\/+$/,'')||'/', hit=null;",
    "    var path=location.pathname.replace(/\\/+$/,'')||'/', hit=null, enp=/^\\/en(\\/|$)/.test(path);\n"
    "    if(enp){ path=path.replace(/^\\/en/,'')||'/'; var ENT=window.__EN_TOOLS||{}; R=R.map(function(r){ var e=ENT[r[0]]; return e?[r[0],r[1],r[2],e[0],e[1]]:r; }); }")
rep("      meta('meta[property=\"og:description\"]','content',hit[4]); meta('link[rel=\"canonical\"]','href','https://daidaiphasa.com'+hit[0]); meta('meta[property=\"og:url\"]','content','https://daidaiphasa.com'+hit[0]);",
    "      meta('meta[property=\"og:description\"]','content',hit[4]); meta('link[rel=\"canonical\"]','href','https://daidaiphasa.com'+(enp?'/en':'')+hit[0]); meta('meta[property=\"og:url\"]','content','https://daidaiphasa.com'+(enp?'/en':'')+hit[0]);")
rep("    $('tabs').addEventListener('click',function(){ var u=byMode[st.mode]; if(u){ try{ history.replaceState(null,'',u); }catch(e){} } });",
    "    $('tabs').addEventListener('click',function(){ var u=byMode[st.mode]; if(u){ try{ history.replaceState(null,'',(enp?'/en':'')+u); }catch(e){} } });")

# ---- step 2: samples, Thai-only blocks, tools list, extra strings
rep("if(m&&m.sample) src.placeholder='พิมพ์ข้อความ เช่น '+m.sample;",
    "if(m&&m.sample) src.placeholder=(typeof UIL!=='undefined'&&UIL!=='th'&&m.en) ? 'Type text, e.g. '+m.en : 'พิมพ์ข้อความ เช่น '+m.sample;")
for mid, en in (('romanize','สวัสดีครับ or computer'), ('tr','The weather is lovely today'), ('braille','hello world'), ('morse','sos help'), ('sign','hello'), ('dict','house')):
    m = re.search(r"\{id:'%s', label:'[^']*', sample:'[^']*'" % mid, s_idx())
    rep(m.group(0)+'}', m.group(0)+", en:'"+en+"'}")
rep('<section class="cv-deckwrap" id="cvDeckWrap"', '<section class="cv-deckwrap th-only" id="cvDeckWrap"')
rep('<section class="learn" id="learn">', '<section class="learn th-only" id="learn">')
rep('<a class="ebk" href="/ebook"', '<a class="ebk th-only" href="/ebook"')
rep('<p class="typo" aria-hidden="true" data-type="l;ylfu">', '<p class="typo th-only" aria-hidden="true" data-type="l;ylfu">')
rep("    var b=document.createElement('button'); b.className='entry'; b.type='button';",
    "    var b=document.createElement('button'); b.className='entry'+(e.go&&TH_ONLY.indexOf(e.go)>=0?' th-only':''); b.type='button';")

# ---- step 3: English history deck, English tool entries, extra UI strings (merged into the existing I18N table)
import json, os
sys.path.insert(0, os.path.dirname(__file__)); import en_content as EC
deck_en = [f'<span class="era">{e}</span>\n        <h3>{t}</h3>\n        {b}' for e, t, b in EC.DECK]
ent_en = [dict(go=e['go'], hw=e['hw'], say=e['say'], pos=e['pos'], **{'def': e['def_']}, ex=e['ex']) for e in EC.ENTRIES]
strings = {k: v for k, v in EC.STRINGS.items()}
strings.update(json.load(open(os.path.join(os.path.dirname(__file__), 'countries_en.json'), encoding='utf-8')))
MARK = '/*INTL-EXTRA*/'
blk = (MARK + "\n  (function(X){ Object.keys(X).forEach(function(k){ var ix=K.indexOf(k); if(ix<0){ K.push(k); ['en','zh','ja','ko'].forEach(function(l){ T[l].push(X[k]); }); } else T.en[ix]=X[k]; }); })("
       + json.dumps(strings, ensure_ascii=False) + ");\n  ['en','zh','ja','ko'].forEach(function(l){ P[l].push([/^(\\d+) ตัวอักษร$/,'$1 characters']); });\n  " + '/*INTL-EXTRA-END*/\n')
if MARK in s:
    a = s.index(MARK); b = s.index('/*INTL-EXTRA-END*/') + len('/*INTL-EXTRA-END*/') + 1; s = s[:a] + blk + s[b:]
else:
    rep("  var out = {};\n  Object.keys(T).forEach(function(l){", blk + "  var out = {};\n  Object.keys(T).forEach(function(l){")
rep("pl=[[/^(\\d+) จาก", "pl=[[/^(\\d+) จาก") if False else None
MARK2 = '/*INTL-DECK*/'
deckjs = (MARK2 + "\n  var DECK_EN=" + json.dumps(deck_en, ensure_ascii=False) + ", DECK_TH=null;\n"
  "  function paintDeck(l){ var sl=document.querySelectorAll('#deck .slide'); if(!sl.length) return; if(!DECK_TH) DECK_TH=Array.prototype.map.call(sl,function(x){return x.innerHTML;});\n"
  "    Array.prototype.forEach.call(sl,function(x,i){ var h=(l==='th'||!DECK_EN[i])?DECK_TH[i]:DECK_EN[i]; if(x.innerHTML!==h) x.innerHTML=h; }); }\n"
  "  var ENT_EN=" + json.dumps(ent_en, ensure_ascii=False) + ";\n"
  "  (function(){ var box=document.getElementById('entries'); if(!box) return; ENT_EN.forEach(function(e){ var b=document.createElement('button'); b.className='entry intl-only'; b.type='button';\n"
  "    b.innerHTML='<span class=\"top\"><span class=\"hw\"></span><span class=\"say\"></span><span class=\"pos\"></span></span><span class=\"def\"></span><span class=\"ex\"></span>';\n"
  "    b.querySelector('.hw').textContent=e.hw; b.querySelector('.say').textContent=e.say; b.querySelector('.pos').textContent=e.pos; b.querySelector('.def').textContent=e['def']; b.querySelector('.ex').textContent=e.ex;\n"
  "    b.addEventListener('click',function(){ setMode(e.go,true); document.getElementById('tool').scrollIntoView({behavior:'smooth'}); }); box.appendChild(b); });\n"
  "    Array.prototype.forEach.call(box.querySelectorAll('.entry:not(.intl-only)'),function(b){ b.classList.add('th-only'); }); })();\n  " + "/*INTL-DECK-END*/\n")
if MARK2 in s:
    a = s.index(MARK2); b = s.index('/*INTL-DECK-END*/') + len('/*INTL-DECK-END*/') + 1; s = s[:a] + deckjs + s[b:]
else:
    rep("  function setUiLang(l){\n", deckjs + "  function setUiLang(l){\n")
rep("    translateTree(document.body);\n    if (!$('countryView').hidden && CV.lang) paintLangName(CV.lang);\n",
    "    paintDeck(l);\n    translateTree(document.body);\n    if (!$('countryView').hidden && CV.lang) paintLangName(CV.lang);\n")

rep('<a href="/ebook" class="nav-ebook"', '<a href="/ebook" class="nav-ebook th-only"')
open(P, 'w', encoding='utf-8').write(s)
print('patched')
