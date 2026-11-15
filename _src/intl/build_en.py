# Builds /en/index.html (English home + English tool URLs) from index.html. Run after any change to index.html.
import re, os, json
ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
TITLE = 'daidaiphasa — Free language tools: translate, romanize Thai, Braille, Morse code, ASL fingerspelling'
DESC = ('Free online language tools in one place: translate between Thai and 20 languages, romanize Thai names (RTGS), '
        'convert text to Braille and Morse code with sound, learn ASL fingerspelling, and explore the world\'s languages on a 3D globe.')
EN_TOOLS = {
 '/romanize': ['Thai romanization (RTGS): write Thai names and words in English letters | daidaiphasa',
               'Convert Thai script to Latin letters using the Royal Thai General System, or see how English words are spelled in Thai. Free, no sign-up.'],
 '/translate': ['Thai translator: Thai ⇄ English, Chinese, Japanese, Korean and 20 languages | daidaiphasa',
                'Free Thai translation with automatic language detection and text-to-speech, works on every browser and phone.'],
 '/braille': ['Braille translator: text to Braille and Braille to text (English & Thai) | daidaiphasa',
              'Type or paste text to see it in Braille cells, or convert Braille back to letters. Supports English (UEB) and Thai Braille. Free.'],
 '/morse': ['Morse code translator with sound: text to Morse and Morse to text | daidaiphasa',
            'Convert text to Morse code and back, and listen to it at real timing. International (ITU) and Thai Morse. Free.'],
 '/dictionary': ['Official dictionaries lookup: English, Thai, French, Spanish, Korean, Japanese, Chinese | daidaiphasa',
                 'Type a word once and open the free reference dictionary for each language, such as the Royal Institute Thai dictionary, RAE and Académie française.'],
 '/sign-language': ['ASL and Thai fingerspelling chart: spell names with hand shapes | daidaiphasa',
                    'Type any word and see each fingerspelling hand shape in American Sign Language or Thai Sign Language. Free.'],
 '/globe': ['World languages globe: click a country to explore its languages | daidaiphasa',
            'Spin a 3D globe of 197 countries and open illustrated stories for 109 languages: greetings, scripts and history.'],
 '/history': ['History of language: from the first human sounds to today | daidaiphasa',
              'An illustrated 13-chapter story of how human language and writing developed.'],
}
h = s
h = h.replace('<html lang="th">', '<html lang="en">', 1)
h = re.sub(r'<title>.*?</title>', f'<title>{TITLE}</title>', h, 1, flags=re.S)
h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{DESC}">', h, 1)
h = h.replace('<link rel="canonical" href="https://daidaiphasa.com/">', '<link rel="canonical" href="https://daidaiphasa.com/en/">', 1)
h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{TITLE}">', h, 1)
h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{DESC}">', h, 1)
h = h.replace('<meta property="og:url" content="https://daidaiphasa.com/">', '<meta property="og:url" content="https://daidaiphasa.com/en/">', 1)
h = h.replace('<meta property="og:locale" content="th_TH">', '<meta property="og:locale" content="en_US">\n<meta property="og:locale:alternate" content="th_TH">', 1)
h = h.replace('<meta property="og:site_name" content="ใดๆภาษา.com">', '<meta property="og:site_name" content="daidaiphasa">', 1)
ld = {"@context": "https://schema.org", "@graph": [
  {"@type": "WebSite", "name": "daidaiphasa", "alternateName": ["ใดๆภาษา.com", "daidaiphasa.com"], "url": "https://daidaiphasa.com/en/", "inLanguage": "en"},
  {"@type": "WebApplication", "name": "daidaiphasa language tools", "url": "https://daidaiphasa.com/en/", "applicationCategory": "EducationalApplication",
   "operatingSystem": "Any", "inLanguage": "en", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
   "featureList": ["Thai translator", "Thai romanization (RTGS)", "Braille translator", "Morse code translator with sound", "ASL fingerspelling", "World languages globe"]}]}
h = re.sub(r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>', h, 1, flags=re.S)
h = h.replace('</head>', '<script>window.__UI="en";window.__EN_TOOLS=' + json.dumps(EN_TOOLS, ensure_ascii=False) + ';</script>\n</head>', 1)
os.makedirs(os.path.join(ROOT, 'en'), exist_ok=True)
open(os.path.join(ROOT, 'en', 'index.html'), 'w', encoding='utf-8').write(h)
print('en/index.html', len(h))
