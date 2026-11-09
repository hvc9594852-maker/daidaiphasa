/* ใดๆภาษา.com — Shopee Affiliate items.
   วิธีเพิ่มสินค้า: ใส่ลิงก์จาก Shopee Affiliate (Custom Link / เอาลิงก์ เช่น https://s.shopee.co.th/xxxx) ที่ url
   tags บอกว่าจะโชว์ที่ไหน: 'home' = หน้าแรก (สูงสุด 6 ชิ้น), หัวข้อบทความ: 'japanese','chinese','english','korean','french','german','keyboard','braille','sign','dictionary','vocab'
   'post:<slug>' = โชว์ท้ายบทความนั้นก่อนอย่างอื่น (เช่น 'post:emoji-origin') — งานตั้งเวลาเพิ่มสินค้าแบบนี้ให้บทความใหม่ทุกวัน
   สินค้าที่ยังไม่มี url จะไม่แสดง */
window.SHOP_ITEMS = [
  {id:'kb-sticker-th', title:'สติกเกอร์คีย์บอร์ดภาษาไทย', note:'แปะแป้นที่ไม่มีตัวไทย ขายแล้วกว่า 3 หมื่นชิ้น', url:'https://s.shopee.co.th/5VWYaRFMQa', tags:['home','keyboard']},
  {id:'jp-kana', title:'หัดเขียน เรียนอ่าน ฮิระงะนะ และคะตะคะนะ', note:'หนังสือเริ่มต้นภาษาญี่ปุ่นจากตัวอักษร', url:'https://s.shopee.co.th/1BNZQY0YIp', tags:['home','japanese']},
  {id:'cn-hsk', title:'แบบเรียน HSK Standard Course 1–6', note:'ชุดเตรียมสอบภาษาจีนที่คนใช้มากที่สุด แถมเฉลย', url:'https://s.shopee.co.th/3qOKbTBihM', tags:['home','chinese']},
  {id:'kr-basic', title:'คัด เขียน อ่าน ภาษาเกาหลีเบื้องต้น', note:'แบบฝึกหัดฮันกึลสำหรับมือใหม่', url:'https://s.shopee.co.th/AKboLQZeAG', tags:['home','korean']},
  {id:'en-office', title:'English at Office ภาษาอังกฤษฉบับออฟฟิศ', note:'ศัพท์และประโยคที่ใช้ในที่ทำงาน', url:'https://s.shopee.co.th/gRIpg67mz', tags:['home','english']},
  {id:'vocab-book', title:'สมุดจดศัพท์ ORDBOOK แบบเปิดปิดคำ', note:'พับซ่อนคำแปลไว้ท่องทบทวน ขนาดพกพา', url:'https://s.shopee.co.th/1BNZQdpBvk', tags:['home','vocab','japanese','chinese','korean','english']},
  {id:'vocab-cards', title:'บัตรคำเปล่าพร้อมห่วง 100 แผ่น', note:'ทำแฟลชการ์ดคำศัพท์เอง', url:'https://s.shopee.co.th/9pfXkYS1Jb', tags:['vocab','french','german']},
  {id:'kb-sticker-kr', title:'สติกเกอร์คีย์บอร์ดภาษาเกาหลี', note:'พิมพ์ฮันกึลได้ง่ายขึ้น', url:'https://s.shopee.co.th/5VWYaS7bKQ', tags:['korean','keyboard']},
  {id:'fan-word-roots', title:'เทคนิคจดจำคำศัพท์อังกฤษ-ไทยจากรากศัพท์', note:'แบบ fan ที่ย่อมาจาก fanatic เข้าใจรากศัพท์แล้วจำคำได้ง่ายขึ้น', url:'https://s.shopee.co.th/7VHd67BlnB', tags:['post:fan-word-origin','english','vocab']},
  {id:'fan-word-dict', title:'พจนานุกรมเพื่อการแต่งประโยคไทย-อังกฤษ', note:'คำไทยอย่าง "แฟน" ภาษาอังกฤษพูดว่าอะไร เปิดดูพร้อมตัวอย่างประโยค', url:'https://s.shopee.co.th/5q9P76gXpo', tags:['post:fan-word-origin','english','dictionary']},
  {id:'name-titles-book', title:'หนังสือคู่มือตั้งชื่อ เปลี่ยนชื่อ', note:'ต่อยอดจากเรื่องคำนำหน้าชื่อ มาดูหลักการตั้งชื่อและเปลี่ยนชื่อแบบไทย', url:'https://s.shopee.co.th/2LZYvqk39T', tags:['post:origin-of-thai-name-titles']},
  {id:'name-titles-stamp', title:'ตรายางชื่อ-นามสกุล สั่งทำได้', note:'ประทับ นาย นาง นางสาว พร้อมชื่อ-สกุล บนเอกสารและแบบฟอร์ม', url:'https://s.shopee.co.th/LoUY7xLPU', tags:['post:origin-of-thai-name-titles']},
  {id:'thai-space-proverbs', title:'2,000 สำนวน สุภาษิต คำพังเพยไทย คำที่มักเขียนผิด', note:'เขียนไทยติดกันอยู่แล้ว ยิ่งต้องสะกดให้ถูก รวมคำที่คนไทยมักเขียนผิด', url:'https://s.shopee.co.th/2qVqqImsyA', tags:['post:thai-no-spaces-between-words','dictionary']},
  {id:'thai-space-rbs-dict', title:'พจนานุกรมสร้างชาติ (มติชน)', note:'เบื้องหลังพจนานุกรมฉบับราชบัณฑิตยสถาน หน่วยงานเดียวกับที่วางหลักการเว้นวรรค', url:'https://s.shopee.co.th/5q9SPriz44', tags:['post:thai-no-spaces-between-words','dictionary']},
  {id:'tone-marks-sheet', title:'แบบฝึกหัดการผันวรรณยุกต์ภาษาไทย', note:'ฝึกผัน ป่า ป้า ป๊า ป๋า ด้วยไม้ทั้งสี่ที่บทความเล่าที่มา ขายแล้วกว่า 300 ชุด', url:'https://s.shopee.co.th/8VAGsG53Fy', tags:['post:origin-of-thai-tone-marks']},
  {id:'tone-marks-p456', title:'สรุปหลักภาษาไทย ประถม 4-5-6 พร้อมข้อสอบ', note:'ทวนหลักภาษา อักษรสูง กลาง ต่ำ และการผันเสียงที่ใช้คู่กับวรรณยุกต์', url:'https://s.shopee.co.th/3g517Lovtt', tags:['post:origin-of-thai-tone-marks']},
  {id:'tone-marks-note', title:'NOTE สรุปหลักภาษาไทย ม.ต้น', note:'สรุปไตรยางศ์และวรรณยุกต์แบบเข้มข้นสำหรับเตรียมสอบ', url:'https://s.shopee.co.th/7fb9skj0lf', tags:['post:origin-of-thai-tone-marks']},
  {id:'numerals-clock', title:'นาฬิกาแขวนผนัง 12 นิ้ว หน้าปัดเลขไทย', note:'เห็นรูปเลข ๑ ถึง ๑๒ ที่บทความเล่าว่าเดินทางมาจากเลขเขมรทุกครั้งที่ดูเวลา ขายแล้วกว่า 900 เรือน', url:'https://s.shopee.co.th/AKbwRjxG4r', tags:['post:origin-of-thai-numerals']},
  {id:'numerals-book', title:'หนังสือเรียนรู้ตัวเลข เลขไทย เลขอารบิก', note:'ฝึกอ่านตัวเลขสองชุดที่เราสลับใช้ทุกวัน ขายแล้วกว่า 2,000 เล่ม', url:'https://s.shopee.co.th/30pLiJG7ve', tags:['post:origin-of-thai-numerals']},
  {id:'numerals-tracing', title:'แบบฝึกหัดคัดตัวเลข เลขไทย-อารบิก', note:'คัดลายมือเลขไทยตัวโค้งมนแบบบนการ์ดงานแต่งที่บทความยกตัวอย่าง', url:'https://s.shopee.co.th/1gJy7sohfp', tags:['post:origin-of-thai-numerals']},
  {id:'polite-animal-p3', title:'เก่งภาษาไทย ป.3 สรุปหลักพร้อมแบบฝึก', note:'บทเรียนคำสุภาพ ป.3 ที่สอนคู่ หมู-สุกร วัว-โค อยู่ในวิชานี้ ขายแล้วกว่า 200 เล่ม', url:'https://s.shopee.co.th/2Vt6iEXdYA', tags:['post:polite-animal-names']},
  {id:'polite-animal-royal', title:'สื่อการสอนเรื่องคำราชาศัพท์', note:'ต่อยอดจากคำสุภาพไปถึงราชาศัพท์ ซึ่งก็ยืมจากบาลี สันสกฤต และเขมรเช่นกัน', url:'https://s.shopee.co.th/1BNj7pn3AC', tags:['post:polite-animal-names']},
  {id:'typhoon-weather-station', title:'สถานีวัดอากาศดิจิทัล วัดลม ฝน และความชื้น', note:'วัดความเร็วลมได้เอง ลองเทียบกับเกณฑ์ 34 นอตที่พายุเริ่มได้ชื่อ ขายแล้วกว่า 600 ชิ้น', url:'https://s.shopee.co.th/906dyEfSHu', tags:['post:typhoon-names-from-thailand']},
  {id:'typhoon-asia-map', title:'โปสเตอร์แผนที่ทวีปเอเชีย หุ้มพลาสติก', note:'ไล่ดูที่ตั้งของ 14 สมาชิกที่ช่วยกันตั้งชื่อพายุ และเส้นทางพายุในทะเลจีนใต้', url:'https://s.shopee.co.th/9AQ4AWBJsy', tags:['post:typhoon-names-from-thailand']},
];
