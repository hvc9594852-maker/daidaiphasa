# -*- coding: utf-8 -*-
DECK = [
('Introduction','Every language is a human story','<p>About 7,164 languages are still spoken today. Each one began with sounds, gestures and the need to tell the person next to us something. This story goes back to before writing existed and ends with the social-media language we type every day.</p>'),
('About 300,000 years ago','Humans came before language','<p>Homo sapiens appeared in Africa around 300,000 years ago, but no one knows exactly when we started to speak. Speech leaves no fossils, and there is no direct evidence of when language began.</p><p class="small">The earliest language may have been a "protolanguage": words without complex grammar.</p>'),
('Indirect evidence','Traces of the first speakers','<p>Homo sapiens made art, music, jewellery and rituals, a rich "world of symbols" that language rests on. The FOXP2 gene makes a protein that switches other genes on and off and is needed for normal speech and language development.</p><p class="small">FOXP2 is not a single "language gene". It may regulate hundreds of other genes, so it is only one piece of the puzzle.</p>'),
('Hypotheses','How did language begin?','<ul><li><b>Gesture first</b> Humans may have communicated with their hands before their voices.</li><li><b>Imitation</b> Early words may have copied the sounds of animals and nature.</li><li><b>Song and rhythm</b> Melodic singing may have turned into speech.</li><li><b>Social life</b> Language may have grown from the need to live together in groups.</li></ul><p class="small">All of these are still hypotheses. None has been fully proven.</p>'),
('Thousands of years ago','Languages branch like trees','<p>When groups of people moved and separated, their speech slowly drifted apart until it became different languages. Linguists group them into "families" such as Indo-European (English, Hindi, Persian), Kra-Dai (Thai, Lao, Shan), Sino-Tibetan, Austronesian and Niger-Congo.</p><p class="small">Thai belongs to the Kra-Dai family but borrowed many words from Pali, Sanskrit and Khmer.</p>'),
('About 3,200 BCE','Writing began as bookkeeping','<p>Sumerians in Mesopotamia pressed reeds into clay to make wedge-shaped cuneiform for keeping accounts, such as tablets recording barley rations from about 3,100–2,900 BCE. The script was later adapted to write many other languages.</p><p class="small">In China, the oldest known writing is on Shang dynasty oracle bones.</p>'),
('About 1,800–1,700 BCE','The first alphabet','<p>The early North Semitic (Proto-Sinaitic) script used letters for sounds. Phoenician traders carried it across the Mediterranean, the Greeks adopted it and added vowels around the 8th century BCE, and the Romans took it through the Etruscans. It became the Latin alphabet used worldwide.</p><p class="small">Another branch passed through Aramaic and split into the Hebrew, Arabic and Brahmi scripts.</p>'),
('1283 CE (B.E. 1826)','From Brahmi to Thai script','<p>India\'s Brahmi script gave rise to Pallava, which passed on to the Mon and Old Khmer scripts of Southeast Asia. The Ram Khamhaeng inscription says the king devised the Thai script in 1283. Thai writing has tone marks because Thai is a tonal language.</p><p class="small">Some scholars question the age of this inscription · 29 July is Thai National Language Day.</p>'),
('1443 CE','A script designed for everyone','<p>King Sejong of Korea created Hangul in 1443 and announced it in 1446 in the book Hunminjeongeum, because Chinese characters were too hard for ordinary people. Consonant shapes copy the speech organs: ㅁ is the lips.</p><p class="small">Earlier, around the 9th–10th century, the Cyrillic script was developed in the First Bulgarian Empire for Slavic languages.</p>'),
('About 1450 CE','The printing press standardised language','<p>Gutenberg developed movable metal type in Europe (Korea had already printed the Jikji with metal type in 1377). Once books could be printed in large numbers, spelling began to settle and dictionaries appeared. In Thailand, Dr Dan Beach Bradley printed a royal ban on opium in 1839, the first Thai government document printed on a press.</p>'),
('19th century','Language for hands, eyes and wires','<ul><li><b>Braille</b> Louis Braille published his raised-dot system in 1829.</li><li><b>Morse code</b> On 24 May 1844 Morse sent "What hath God wrought?" from Washington to Baltimore.</li><li><b>Sign languages</b> are natural languages with their own grammar, not spoken language turned into gestures.</li><li><b>Esperanto</b> was created in 1887 so people of different nations could talk to each other.</li></ul>'),
('1991 to today','Language in the digital age','<p>The first version of Unicode came out in October 1991, letting almost every writing system share one computer. Thai ก is U+0E01. Since then emoji, abbreviations and internet slang spread faster than ever, and a new expression can travel across a whole country in a few weeks.</p>'),
('Today','7,164 languages, and many are disappearing','<p>Ethnologue counts about 7,164 living languages. Around 40% are endangered, most with fewer than 1,000 speakers, while just 23 languages cover more than half of the world\'s population. Papua New Guinea has the most languages of any country, about 840.</p><p><a href="#globe" class="deck-cta">Explore languages on the globe →</a></p>'),
]
ENTRIES = [
 dict(go='romanize', hw='romanize', say='/ˈroʊ.mə.naɪz/', pos='v.', def_='Write Thai in Latin letters (RTGS), or see how an English word is spelled in Thai.', ex='สวัสดี → sawatdi'),
 dict(go='braille', hw='Braille', say='/breɪl/', pos='n.', def_='Turn English or Thai text into Braille cells, and Braille back into letters.', ex='hello → ⠓⠑⠇⠇⠕'),
 dict(go='sign', hw='fingerspell', say='/ˈfɪŋ.ɡɚ.spel/', pos='v.', def_='Type a word to see each hand shape in American Sign Language, or type Thai to see Thai fingerspelling.', ex='hi → H I'),
 dict(go='dict', hw='dictionary', say='/ˈdɪk.ʃə.ner.i/', pos='n.', def_='Type a word once and open the free official dictionary for 8 languages, from Merriam-Webster to the Royal Institute Thai dictionary.', ex='house → 8 dictionaries'),
 dict(go='morse', hw='Morse', say='/mɔːrs/', pos='n.', def_='Convert text to Morse code and back, and listen to it at real timing.', ex='sos → ... --- ...'),
 dict(go='tr', hw='translate', say='/trænsˈleɪt/', pos='v.', def_='Translate between Thai and 20 languages with automatic language detection and text-to-speech.', ex='thank you → ขอบคุณ'),
]
STRINGS = {
 'ใดๆภาษา':'daidaiphasa','ใดๆภาษา.com':'daidaiphasa.com','ลองใช้เครื่องมือ':'Try the tools','สวัสดี':'Hello',
 'computer → คอมพิวเตอร์':'สวัสดี → sawatdi','แปลภาษา':'Translate','ไทย ⇄ 20 ภาษา':'Thai ⇄ 20 languages','ค้นพจนานุกรม':'Dictionary lookup',
 '8 ภาษา · ฟรี':'8 languages · free','พจนานุกรม':'Dictionary','ภาษาอังกฤษ':'English','คำอ่านภาษาไทย':'Thai reading',
 'คำทั่วไปถอดตามกฎ อาจคลาดเคลื่อน':'Common words are transcribed by rule and may be inexact',
 'เกี่ยวกับเรา':'About','นโยบายความเป็นส่วนตัว':'Privacy','ติดต่อ':'Contact','© 2026 ใดๆภาษา.com':'© 2026 daidaiphasa.com',
 'ภาษาของพจนานุกรม':'Dictionary language','อ่านอักษรเบรลล์เป็นภาษา':'Read Braille as','แปลจากภาษา':'Translate from','แปลเป็นภาษา':'Translate to',
 'เรื่องเล่าของภาษา':'Language stories','ปิด':'Close',
 'เช่น ลูกโลกภาษา หน้าภาษาญี่ปุ่น สไลด์ที่ 3':'e.g. Globe, Japanese page, slide 3','เล่าสิ่งที่เกิดขึ้น หรือสิ่งที่อยากให้แก้':'Describe what happened or what you would like changed',
 'อีเมลหรือ LINE ID สำหรับติดต่อกลับ':'Email or LINE ID so we can reply','ตรวจหาภาษาเอง':'Detect language','อังกฤษ':'English','เบรลล์ เกรด 1':'Grade 1 Braille',
 'พิมพ์ภาษาไทยได้เลย':'Thai input works too','ใส่ . และ - เพื่อแปลกลับ':'Type . and - to decode','คำที่จะค้น':'Word to look up','พจนานุกรมภาษาอังกฤษ':'English dictionary',
 'คำฝรั่งเศส สเปน อินโดนีเซีย เลือกภาษาที่เมนู':'For French, Spanish or Indonesian words, pick the language in the menu',
 'Merriam-Webster · อังกฤษ-อังกฤษ แบบอเมริกัน':'Merriam-Webster · American English','เปิดเว็บ ↗':'Open site ↗',
 'ทุกลิงก์เป็นเว็บของผู้ทำพจนานุกรมเอง ค้นได้ฟรี ใดๆภาษาไม่ได้คัดลอกข้อมูลคำมาเก็บ':"Every link goes to the publisher's own free dictionary. daidaiphasa does not copy their data.",
 'จากเสียงแรก ถึงภาษาวันนี้':'From the first sound to the languages of today','แหล่งข้อมูล':'Sources','สไลด์':'slide','ประวัติภาษา':'History of language',
 'สไลด์ก่อนหน้า':'Previous slide','สไลด์ถัดไป':'Next slide','เครื่องมือ':'Tools','กดที่คำเพื่อเปิดเครื่องมือ':'Tap a word to open the tool',
 'ไปสำรวจภาษาบนลูกโลก →':'Explore languages on the globe →',
}
# deck dot titles = Thai slide headings
TH_TITLES = ['ทุกภาษาคือเรื่องเล่าของคน','มนุษย์เกิดก่อนภาษา','ร่องรอยของคนที่เริ่มพูด','ภาษาเกิดขึ้นได้อย่างไร','ภาษาแตกกิ่งเหมือนต้นไม้','การเขียนเริ่มจากการทำบัญชี','ตัวอักษรตัวแรกของโลก','จากพราหมี สู่ลายสือไทย','อักษรที่ถูกออกแบบให้ทุกคนอ่านได้','แท่นพิมพ์ทำให้ภาษามีมาตรฐาน','ภาษาสำหรับมือ ตา และสายไฟ','ภาษาในยุคดิจิทัล','7,164 ภาษา และอีกหลายภาษากำลังจะหายไป']
for th, d in zip(TH_TITLES, DECK): STRINGS[th] = d[1]

TH_ERAS=['บทนำ','ราว 300,000 ปีก่อน','หลักฐานทางอ้อม','สมมติฐาน','หลายพันปีก่อน','ราว 3,200 ปีก่อนคริสตกาล','ราว 1,800–1,700 ปีก่อนคริสตกาล','พ.ศ. 1826 (ค.ศ. 1283)','ค.ศ. 1443','ราว ค.ศ. 1450','ศตวรรษที่ 19','ค.ศ. 1991 ถึงปัจจุบัน','วันนี้']
for th, d in zip(TH_ERAS, DECK): STRINGS[th] = d[0]
STRINGS.update({'มอร์ส':'Morse','ทุกลิงก์เป็นเว็บของผู้ทำพจนานุกรมเอง ค้นได้ฟรี ใดๆภาษาไม่ได้คัดลอกข้อมูลคำมาเก็บไว้':"Every link goes to the publisher's own free dictionary. daidaiphasa does not copy their data.",
 'thank you → ขอบคุณ':'thank you → ขอบคุณ'})

STRINGS['แก้ข้อความที่ลืมสลับแป้น ถอดเสียง ถอดศัพท์เฉพาะกลุ่ม หมุนลูกโลกดูภาษาทั่วโลก และย้อนดูประวัติภาษาตั้งแต่เสียงแรกของมนุษย์'] = 'Free tools for every kind of language: translate Thai, romanize Thai names, write in Braille, send Morse code, fingerspell in ASL, spin the globe to explore world languages, and trace language back to the first human sounds.'
