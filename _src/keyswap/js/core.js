// KeySwap core — generated from daidaiphasa.com index.html by tools/gen_core.py; do not edit by hand.
var KS = (function(){
  var EN = "1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
  var TH = Array.from("ๅ/-ภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝ");
  // Shift layer of the Kedmanee layout
  var EN_S = 'QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?';
  var TH_S = Array.from('๐"ฎฑธํ๊ณฯญฐ,ฤฆฏโฌ็๋ษศซ.()ฉฮฺ์?ฒฬฦ');
  var fwd = {}, rev = {};
  EN.split('').forEach(function(c,i){ fwd[c]=TH[i]; if(TH[i]!=='/'&&TH[i]!=='-') rev[TH[i]]=c; });
  EN_S.split('').forEach(function(c,i){ if(TH_S[i]){ fwd[c]=TH_S[i]; if(!rev[TH_S[i]] && !/[",.()?]/.test(TH_S[i])) rev[TH_S[i]]=c; } });
  // shifted number row: ! @ # $ % ^ & * ( ) _ + |
  Array.from('!@#$%^&*()_+|').forEach(function(c,i){ var t=Array.from('+๑๒๓๔ู฿๕๖๗๘๙ฅ')[i]; fwd[c]=t; if(t!=='+' && !rev[t]) rev[t]=c; });

  var BR = {a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',',':'⠂','.':'⠲','?':'⠦','!':'⠖',"'":'⠄','-':'⠤',' ':' ','\n':'\n'};
  var NUM = {'1':'⠁','2':'⠃','3':'⠉','4':'⠙','5':'⠑','6':'⠋','7':'⠛','8':'⠓','9':'⠊','0':'⠚'};
  var BR_REV = {}; Object.keys(BR).forEach(function(k){ if(k!==' '&&k!=='\n') BR_REV[BR[k]]=k; });
  var MO = {a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--','?':'..--..'};
  var MO_REV = {}; Object.keys(MO).forEach(function(k){ MO_REV[MO[k]]=k; });

  // Royal Thai General System (ราชบัณฑิตยสถาน) — syllable search + pronunciation lexicon, tested on ~880 names/words
  // RTGS romanizer v2 for ใดๆภาษา.com — syllable search (DP) + pronunciation lexicon.
  // romanize(s) -> string ; romanizeParts(s) -> [{th, rom}] syllable groups (for showing the breakdown)
  var RT_I = {'ก':'k','ข':'kh','ฃ':'kh','ค':'kh','ฅ':'kh','ฆ':'kh','ง':'ng','จ':'ch','ฉ':'ch','ช':'ch','ซ':'s','ฌ':'ch','ญ':'y','ฎ':'d','ฏ':'t','ฐ':'th','ฑ':'th','ฒ':'th','ณ':'n','ด':'d','ต':'t','ถ':'th','ท':'th','ธ':'th','น':'n','บ':'b','ป':'p','ผ':'ph','ฝ':'f','พ':'ph','ฟ':'f','ภ':'ph','ม':'m','ย':'y','ร':'r','ล':'l','ว':'w','ศ':'s','ษ':'s','ส':'s','ห':'h','ฬ':'l','อ':'','ฮ':'h'};
  var RT_F = {'ก':'k','ข':'k','ค':'k','ฆ':'k','ง':'ng','จ':'t','ช':'t','ซ':'t','ฌ':'t','ญ':'n','ฎ':'t','ฏ':'t','ฐ':'t','ฑ':'t','ฒ':'t','ณ':'n','ด':'t','ต':'t','ถ':'t','ท':'t','ธ':'t','น':'n','บ':'p','ป':'p','พ':'p','ฟ':'p','ภ':'p','ม':'m','ย':'i','ร':'n','ล':'n','ว':'o','ศ':'t','ษ':'t','ส':'t','ฬ':'n'};
  // how natural a consonant is as an implicit-vowel final (lower = more natural)
  var FCOST = {'น':0,'ม':0,'ง':0,'ก':0.15,'บ':0.15,'ด':0.15,'ย':0.1,'ว':0.2,'ร':0.35,'ล':0.35,'ต':0.3,'ป':0.3,'ช':0.4,'จ':0.4,'ท':0.45,'ธ':0.45,'ส':0.4,'ศ':0.45,'ษ':0.45,'พ':0.4,'ภ':0.5,'ณ':0.3,'ญ':0.5,'ฐ':0.6,'ฒ':0.6,'ฑ':0.6,'ฏ':0.6,'ฎ':0.6,'ค':0.5,'ข':0.6,'ฆ':0.6,'ฟ':0.6,'ซ':0.7,'ฌ':0.8,'ฬ':0.6,'ถ':0.6};
  var INDIC_F='ศษฐฒฏธภฎ', LEAD='เแโใไ', DEP='ะัาำิีึืุู็', TONE='่้๊๋', SON='งญนมยรลว';
  var CLUSTER={'กร':1,'กล':1,'กว':1,'ขร':1,'ขล':1,'ขว':1,'คร':1,'คล':1,'คว':1,'ตร':1,'ปร':1,'ปล':1,'พร':1,'พล':1,'ผล':1,'บล':1,'ดร':1,'ฟร':1,'ฟล':1,'ทร':1};
  var FAKE_S={}; // อักษรควบไม่แท้ (ร silent / ทร = ซ)
  function isC(c){ return !!c && (c in RT_I); }
  function isDep(c){ return !!c && DEP.indexOf(c)>=0; }

  // pronunciation lexicon: Thai spelling -> RTGS syllables joined by '-'
  var LEX_SRC = (
  // places & place morphemes
  'กรุงเทพ:krung-thep|มหานคร:ma-ha-na-khon|นคร:na-khon|สกล:sa-kon|สมุทร:sa-mut|สาคร:sa-khon|สงคราม:song-khram|'+
  'อยุธยา:a-yut-tha-ya|ราชบุรี:rat-cha-bu-ri|ราชธานี:rat-cha-tha-ni|ราชสีมา:rat-cha-si-ma|ราชการ:rat-cha-kan|ราชวงศ์:rat-cha-wong|'+
  'ธรรมราช:tham-ma-rat|ธรรมชาติ:tham-ma-chat|ธรรมะ:tham-ma|ธรรม:tham|ลพบุรี:lop-bu-ri|สระบุรี:sa-ra-bu-ri|สระแก้ว:sa-kaeo|สระ:sa|'+
  'จันทบุรี:chan-tha-bu-ri|กาญจนบุรี:kan-cha-na-bu-ri|กาญจนา:kan-cha-na|สุพรรณ:su-phan|ปฐม:pa-thom|คีรี:khi-ri|ขันธ์:khan|'+
  'พิษณุโลก:phit-sa-nu-lok|พิจิตร:phi-chit|เพชรบูรณ์:phet-cha-bun|เพชรบุรี:phet-cha-bu-ri|เพชร:phet|กำแพง:kam-phaeng|'+
  'สุโขทัย:su-kho-thai|อุทัย:u-thai|อุตรดิตถ์:ut-ta-ra-dit|ยโสธร:ya-so-thon|อำนาจ:am-nat|อุบล:u-bon|อุดร:u-don|'+
  'ร้อยเอ็ด:roi-et|กาฬสินธุ์:ka-la-sin|บึงกาฬ:bueng-kan|มุกดาหาร:muk-da-han|พัทลุง:phat-tha-lung|ปัตตานี:pat-ta-ni|'+
  'นราธิวาส:na-ra-thi-wat|ฉะเชิงเทรา:cha-choeng-sao|ปทุม:pa-thum|ศรีสะเกษ:si-sa-ket|พนม:pha-nom|สวรรค์:sa-wan|พังงา:phang-nga|'+
  'ชุมพร:chum-phon|สงขลา:song-khla|สตูล:sa-tun|ชัยนาท:chai-nat|ชัยภูมิ:chai-ya-phum|ภูมิ:phum|สุวรรณภูมิ:su-wan-na-phum|'+
  'สุราษฎร์:su-rat|มหาสารคาม:ma-ha-sa-ra-kham|สารคาม:sa-ra-kham|ปราจีน:pra-chin|นนทบุรี:non-tha-bu-ri|บุรีรัมย์:bu-ri-ram|'+
  'สิงห์บุรี:sing-bu-ri|ลำภู:lam-phu|ประจวบ:pra-chuap|เชียง:chiang|กระบี่:kra-bi|'+
  // name morphemes
  'ศรี:si|ณัฐพล:nat-tha-phon|ณัฐวุฒิ:nat-tha-wut|ณัฐธิดา:nat-thi-da|ณัฐ:nat|วุฒิ:wut|วัฒนา:wat-tha-na|วัฒน์:wat|'+
  'ธนพล:tha-na-phon|ธนากร:tha-na-kon|ธนวัฒน์:tha-na-wat|ธนา:tha-na|ธน:tha-na|กิตติ:kit-ti|เกียรติศักดิ์:kiat-ti-sak|เกียรติ:kiat|'+
  'ศักดิ์:sak|พงศกร:phong-sa-kon|พงศ์:phong|พงษ์:phong|ชนก:cha-nok|กนก:ka-nok|กมล:ka-mon|ภัทรา:phat-tha-ra|ภัทร:phat|'+
  'รัตนา:rat-ta-na|รัตน:rat-ta-na|อรุณ:a-run|อุดม:u-dom|อรอุมา:on-u-ma|ประเสริฐ:pra-soet|สุรชัย:su-ra-chai|ธีรพงษ์:thi-ra-phong|ธีระ:thi-ra|ธีร:thi-ra|'+
  'อนันต์:a-nan|ไพโรจน์:phai-rot|โรจน์:rot|ณรงค์:na-rong|ทิพวรรณ:thip-pha-wan|ทิพย์:thip|หทัย:ha-thai|เยาวลักษณ์:yao-wa-lak|'+
  'ลักษณ์:lak|ลักษณา:lak-sa-na|ยุทธนา:yut-tha-na|ยุทธ์:yut|ยุทธ:yut|เอกชัย:ek-ka-chai|นิรันดร์:ni-ran|สุวิทย์:su-wit|วิทย์:wit|'+
  'พัชรี:phat-cha-ri|อารีย์:a-ri|สุนีย์:su-ni|ชาตรี:cha-tri|อัญชลี:an-cha-li|ทักษิณ:thak-sin|อภิสิทธิ์:a-phi-sit|ชัชชาติ:chat-chat|'+
  'เศรษฐา:set-tha|สมัย:sa-mai|มณี:ma-ni|สุนทร:sun-thon|เจริญ:cha-roen|ปิยะ:pi-ya|วีระ:wi-ra|ปวีณา:pa-wi-na|นภา:na-pha|'+
  'ฐิติ:thi-ti|ชนิดา:cha-ni-da|ชุติมา:chu-ti-ma|ธิดา:thi-da|จิรา:chi-ra|ศิริ:si-ri|อนุชา:a-nu-cha|สุภา:su-pha|ปรีชา:pri-cha|'+
  'วรรณา:wan-na|วรรณ:wan|สุวรรณ:su-wan|จันทร์:chan|อุมา:u-ma|ปราณี:pra-ni|สุดา:su-da|'+
  // irregular everyday words
  'ชาติ:chat|ญาติ:yat|สมบัติ:som-bat|เหตุ:het|ธาตุ:that|สมมติ:som-mut|สมัคร:sa-mak|จักร:chak|บัตร:bat|มิตร:mit|บุตร:but|ฉัตร:chat|จิตร:chit|ศัตรู:sat-tru|อัตรา:at-tra|จริง:ching|ทราย:sai|ทราบ:sap|ทรง:song|ทรัพย์:sap|สร้าง:sang|ไทย:thai|เพราะ:phro|ขนม:kha-nom|ถนน:tha-non|ฉลาด:cha-lat|'+
  'อร่อย:a-roi|ตลาด:ta-lat|สนุก:sa-nuk|สบาย:sa-bai|สมุด:sa-mut|มหาวิทยาลัย:ma-ha-wit-tha-ya-lai|วิทยาศาสตร์:wit-tha-ya-sat|'+
  'วิทยา:wit-tha-ya|ศาสตร์:sat|คณิตศาสตร์:kha-nit-sat|คณิต:kha-nit|ประวัติศาสตร์:pra-wat-ti-sat|ประวัติ:pra-wat|'+
  'โทรศัพท์:tho-ra-sap|ผลไม้:phon-la-mai|รัฐบาล:rat-tha-ban|รัฐ:rat|ประชาชน:pra-cha-chon|ชีวิต:chi-wit|'+
  'พฤหัสบดี:phrue-hat-sa-bo-di|พฤหัส:pha-rue-hat|ศุกร์:suk|เสาร์:sao|สงกรานต์:song-kran|กระทง:kra-thong|เก้าอี้:kao-i|'+
  'ทุเรียน:thu-rian|มะม่วง:ma-muang|ทะเล:tha-le|ภูเขา:phu-khao|ศาลา:sa-la|ปราสาท:pra-sat|ความ:khwam|อาทิตย์:a-thit|'+
  'พัทยา:phat-tha-ya|สาทร:sa-thon|ห้วย:huai|สัตหีบ:sat-ta-hip|ราษฎร์บูรณะ:rat-bu-ra-na|บูรณะ:bu-ra-na|ธนบุรี:thon-bu-ri|อรัญ:a-ran-ya|อรัญประเทศ:a-ran-ya-pra-thet|สอด:sot|อรทัย:o-ra-thai|นพดล:nop-pha-don|เฉลิม:cha-loem|สุรเชษฐ์:su-ra-chet|เชษฐ์:chet|จักรพันธ์:chak-kra-phan|ปัทมา:pat-tha-ma|สุพัตรา:su-phat-tra|ณัฐกานต์:nat-tha-kan|เอกพล:ek-ka-phon|ศุภกร:su-pha-kon|สุขภาพ:suk-kha-phap|วัฒนธรรม:wat-tha-na-tham|ประชาธิปไตย:pra-cha-thip-pa-tai|ศาสนา:sat-sa-na|พุทธ:phut|ภาพยนตร์:phap-pha-yon|ศิลปะ:sin-la-pa|ศิลปิน:sin-la-pin|ปริญญา:pa-rin-ya|ทฤษฎี:thrit-sa-di|บริษัท:bo-ri-sat|สัปดาห์:sap-da|อันตราย:an-ta-rai|กรุณา:ka-ru-na|จระเข้:cho-ra-khe|พฤษภาคม:phruet-sa-pha-khom|มกราคม:mok-ka-ra-khom|กุมภาพันธ์:kum-pha-phan|มีนาคม:mi-na-khom|เมษายน:me-sa-yon|มิถุนายน:mi-thu-na-yon|กรกฎาคม:ka-ra-ka-da-khom|สิงหาคม:sing-ha-khom|กันยายน:kan-ya-yon|ตุลาคม:tu-la-khom|พฤศจิกายน:phruet-sa-chi-ka-yon|ธันวาคม:than-wa-khom|อุปกรณ์:up-pa-kon|อุบัติเหตุ:u-bat-ti-het|เศรษฐกิจ:set-tha-kit|เกษตร:ka-set|ศึกษา:suek-sa|การศึกษา:kan-suek-sa|สุขศึกษา:suk-kha-suek-sa|พยาบาล:pha-ya-ban|โรงพยาบาล:rong-pha-ya-ban|พยายาม:pha-ya-yam|ทหาร:tha-han|ตำรวจ:tam-ruat|ธนาคาร:tha-na-khan|อาจารย์:a-chan|ศาสตราจารย์:sat-tra-chan|ภรรยา:phan-ra-ya|ปัญญา:pan-ya|ปัญหา:pan-ha|สมาธิ:sa-ma-thi|ประโยชน์:pra-yot|ประโยค:pra-yok|ประธาน:pra-than|ประเพณี:pra-phe-ni|วัฒนา:wat-tha-na|พัฒนา:phat-tha-na|ภาพ:phap|อนุญาต:a-nu-yat|อนุรักษ์:a-nu-rak|อักษร:ak-son|พยัญชนะ:pha-yan-cha-na|วรรณยุกต์:wan-na-yuk|สระ:sa|ราชินี:ra-chi-ni|กษัตริย์:ka-sat|พระราชา:phra-ra-cha|พระเจ้า:phra-chao|ศักดิ์สิทธิ์:sak-sit|อิทธิพล:it-thi-phon|สิทธิ:sit-thi|สิทธิ์:sit|ฤทธิ์:rit|ฤดู:rue-du|ฤดี:rue-di|อังกฤษ:ang-krit|ทฤษฎี:thrit-sa-di|ตรวจ:truat|สัตว์:sat|สัตวแพทย์:sat-ta-wa-phaet|แพทย์:phaet|พรรค:phak|พรรษา:phan-sa|บรรยาย:ban-yai|บรรทัด:ban-that|สรรพ:sap-pha|กรรม:kam|กรรมการ:kam-ma-kan|ภาษาไทย:pha-sa-thai|ภาษามือ:pha-sa-mue|ราชบัณฑิต:rat-cha-ban-dit|บัณฑิต:ban-dit|ราชบัณฑิตยสถาน:rat-cha-ban-dit-ta-ya-sa-than|สถาน:sa-than|สถานี:sa-tha-ni|สถานที่:sa-than-thi|สถาบัน:sa-tha-ban|มนุษย์:ma-nut|ชาติ:chat|ประชาชาติ:pra-cha-chat|สมเด็จ:som-det|พระบาท:phra-bat|ชลประทาน:chon-la-pra-than|ผลไม้:phon-la-mai|ผลิต:pha-lit|สะพาน:sa-phan|ศาล:san|ยุติธรรม:yut-ti-tham|ความยุติธรรม:khwam-yut-ti-tham|อนุสาวรีย์:a-nu-sa-wa-ri|ประชาธิปไตย:pra-cha-thip-pa-tai|สนามหลวง:sa-nam-luang|เยาวราช:yao-wa-rat|สุขุมวิท:su-khum-wit|พหลโยธิน:pha-hon-yo-thin|รัชดาภิเษก:rat-cha-da-phi-sek|ราชดำเนิน:rat-cha-dam-noen|เพชรบุรี:phet-cha-bu-ri|วิภาวดี:wi-pha-wa-di|รามคำแหง:ram-kham-haeng|เจริญกรุง:cha-roen-krung|สามเสน:sam-sen|ณัฐพงษ์:nat-tha-phong|ณัฐชา:nat-cha|ณัฐนันท์:nat-tha-nan|ณัฐริกา:nat-tha-ri-ka|ภัทรพล:phat-tha-ra-phon|ภัทราภรณ์:phat-tha-ra-phon|อาภรณ์:a-phon|ภรณ์:phon|นันท์:nan|นันทนา:nan-tha-na|ศุภชัย:su-pha-chai|ศุภวัฒน์:su-pha-wat|เอกรัฐ:ek-ka-rat|จักรกฤษณ์:chak-krit|กฤษณ์:krit|กฤษณะ:krit-sa-na|กฤษดา:krit-sa-da|วิษณุ:wit-sa-nu|ปัณณวัฒน์:pan-na-wat|ธัญญา:than-ya|ธัญญารัตน์:than-ya-rat|พรรณี:phan-ni|พรรณ:phan|พรรณา:phan-na|ขวัญ:khwan|เสาวลักษณ์:sao-wa-lak|อดิศักดิ์:a-di-sak|อนุวัฒน์:a-nu-wat|ธีรวัฒน์:thi-ra-wat|ภาณุ:pha-nu|กัญญา:kan-ya|จำลอง:cham-long|อุทัยวรรณ:u-thai-wan|อุไรวรรณ:u-rai-wan|ลำดวน:lam-duan|เบญจมาศ:ben-cha-mat|เบญจ:ben-cha|ดารุณี:da-ru-ni|บรรหาร:ban-han|บรรจง:ban-chong|ประพันธ์:pra-phan|สุชาติ:su-chat|อภิชาติ:a-phi-chat|ธวัชชัย:tha-wat-chai|พิทักษ์:phi-thak|ชลธิชา:chon-thi-cha|วิภาวรรณ:wi-pha-wan|สุทธิพงษ์:sut-thi-phong|สุทธิ:sut-thi|ประภาส:pra-phat|บุญเรือน:bun-ruean|อัมพร:am-phon|ไชยา:chai-ya|ศรชัย:son-chai|วิมล:wi-mon|มานพ:ma-nop|อัญชัน:an-chan|ทศพร:thot-sa-phon|ทศพล:thot-sa-phon|ปิติ:pi-ti|ปีติ:pi-ti|สิริ:si-ri|ศิริวรรณ:si-ri-wan|ชนาธิป:cha-na-thip|ธนาธร:tha-na-thon|กาญจน์:kan|สุกัญญา:su-kan-ya|รัชนี:rat-cha-ni|รัชดา:rat-cha-da|ภูมิพล:phu-mi-phon|ภูมิใจ:phum-chai|อดุลยเดช:a-dun-ya-det|วชิราลงกรณ:wa-chi-ra-long-kon|สิรินธร:si-rin-thon|จุฬาลงกรณ์:chu-la-long-kon|มหิดล:ma-hi-don|ธรรมศาสตร์:tham-ma-sat|เกษตรศาสตร์:ka-set-sat|ศิลปากร:sin-la-pa-kon|รามคำแหง:ram-kham-haeng|เชียงใหม่:chiang-mai|ขอนแก่น:khon-kaen|อรวรรณ:o-ra-wan|วาสนา:wat-sa-na|ศศิธร:sa-si-thon|ศศิ:sa-si|จิตรา:chit-tra|ราชเทวี:rat-cha-the-wi|เทวี:the-wi|ศรีสัชนาลัย:si-sat-cha-na-lai|สัชนาลัย:sat-cha-na-lai|สารภี:sa-ra-phi|ตุ๊กตา:tuk-ka-ta|นวนิยาย:na-wa-ni-yai|นิยาย:ni-yai|บทกวี:bot-ka-wi|กวี:ka-wi|พจนานุกรม:phot-cha-na-nu-krom|ไปรษณีย์:prai-sa-ni|มูลนิธิ:mun-la-ni-thi|รัฐมนตรี:rat-tha-mon-tri|นายกรัฐมนตรี:na-yok-rat-tha-mon-tri|ประธานาธิบดี:pra-tha-na-thi-bo-di|อธิบดี:a-thi-bo-di|ประชามติ:pra-cha-ma-ti|มติ:ma-ti|ทัศนีย์:that-sa-ni|ทัศน:that-sa-na|บุษบา:but-sa-ba|โฆษณา:khot-sa-na|เกษียณ:ka-sian|เสด็จ:sa-det|เสนอ:sa-noe|เสมอ:sa-moe|เฉพาะ:cha-pho|เขมร:kha-men|ณัฏฐา:nat-tha|เลิศ:loet|สัมภาษณ์:sam-phat|อุตสาหกรรม:ut-sa-ha-kam|กฎหมาย:kot-mai|ผู้พิพากษา:phu-phi-phak-sa|บำนาญ:bam-nan|สวรรคโลก:sa-wan-kha-lok|ปัจจุบัน:pat-chu-ban|อนาคต:a-na-khot|อดีต:a-dit|สาธารณะ:sa-tha-ra-na|สาธารณรัฐ:sa-tha-ra-na-rat|ประชากร:pra-cha-kon|สุขสันต์:suk-san|รสชาติ:rot-chat|พัสดุ:phat-sa-du|อัศวิน:at-sa-win|วิศวกร:wit-sa-wa-kon|ทัศนคติ:that-sa-na-kha-ti|ภาพถ่าย:phap-thai|ภาพวาด:phap-wat|นักวิทยาศาสตร์:nak-wit-tha-ya-sat|ศัพท์:sap|คำศัพท์:kham-sap|อภัย:a-phai|อภิ:a-phi|ภัทร:phat/phat-tha-ra|วร:won/wo-ra|อร:on/o-ra|พุทธ:phut/phut-tha|พีร:phi-ra|ศุภ:sup/su-pha|ภูมิ:phum/phu-mi|ชย:cha-ya|กช:kot/kot-cha|ศิว:si-wa|โทร:tho/tho-ra|วดี:wa-di|วรรณ:wan/wan-na|กฤต:krit/krit-ta|ศรัทธา:sat-tha|ศรัณย์:sa-ran|นครินทร์:na-kha-rin|สร้าง:sang|สร้อย:soi|สรวง:suang|เศร้า:sao|ทรุด:sut|ทรวง:suang|อินทรีย์:in-si|ศรีสะเกษ:si-sa-ket|รถยนต์:rot-yon|ชัยพร:chai-ya-phon|ภูมิใจ:phum-chai|ภูมิพล:phu-mi-phon|ศุภชัย:su-pha-chai|ศุภกร:su-pha-kon|สรา:sa-ra|พร:phon|ศรชัย:son-chai|พรชัย:phon-chai|โพธิ:phot|จิตร:chit/chit-tra|ตรรกะ:tak-ka|ดารณี:da-ra-ni|เอนก:a-nek|อัคร:ak-kha-ra|ทินกร:thin-na-kon|ยุทธ:yut/yut-tha|ชีว:chi-wa|ปิย:pi-ya|อมร:a-mon|อนงค์:a-nong|จักร:chak/chak-kra|อากาศ:a-kat|สวัสดี:sa-wat-di|ขอบคุณ:khop-khun|คุณ:khun|ภาษา:pha-sa|อาหาร:a-han|เด็ก:dek|หนังสือ:nang-sue|ประเทศ:pra-thet'
  );
  var LEX = {}, LEX_MAX = 0, TONED = {};
  function keyNorm(s){ return norm(s).replace(/[\u0E48-\u0E4B]/g,''); }
  var LINK = {};
  LEX_SRC.split('|').forEach(function(e){ var p=e.split(':'); if(p[0]){ var k=keyNorm(p[0]); var f=p[1].split('/'); LEX[k]=f[0]; if(f[1]) LINK[k]=f[1]; if(k.length>LEX_MAX) LEX_MAX=k.length; } });

  // drop letters silenced by the thanthakhat; ทร์/ดร์/ตร์ after a final consonant are both silent (จันทร์, สุราษฎร์)
  function norm(s){
    s = s.replace(/([ก-ฮ])(?!อ)[ก-ฮ]ร์/g, '$1\u0E3A');                           // จันทร์ → จัน•, สุราษฎร์ → สุราษ•
    s = s.replace(/[ก-ฮ][ิุ]?์/g, '\u0E3A');                                 // silenced letter (+ its vowel) → •
    return s;
  }
  function onsets(w,i,lead){
    var c=w[i], n=w[i+1], out=[];
    if(!isC(c)) return out;
    if(c==='ห' && n && SON.indexOf(n)>=0) out.push({r:RT_I[n], len:2, cost:0});           // ห นำ
    if(c==='อ' && n==='ย') out.push({r:'y', len:2, cost:0});                               // อ นำ ย
    if(n && CLUSTER[c+n] && (lead || w[i+2]!==undefined)) out.push({r:RT_I[c]+RT_I[n], len:2, cost:0.05, cl:1});
    if(n && FAKE_S[c+n] && (lead || w[i+2]!==undefined)) out.push({r:FAKE_S[c+n], len:2, cost:0.1, cl:1});
    out.push({r:RT_I[c], len:1, cost:(c==='ห'&&n&&SON.indexOf(n)>=0)?0.8:0});
    return out;
  }

  // candidate syllables starting at i: [{end, rom, cost}]
  function sylls(w,i){
    var res=[], c=w[i], inLead=LEAD.indexOf(c)>=0;
    function fin(j, base, rom, cost, opt){ // optional final consonant at j
      var f=w[j];
      if(isC(f) && !TONED[j] && !isDep(w[j+1]) && !(f==='ร' && w[j+1]==='ร')) {
        var fr = RT_F[f]; if(fr!==undefined) res.push({end:j+1, rom:rom+fr, cost:cost+(opt?FCOST[f]||0.3:((f==='ร'||f==='ล')?0.2:0))});
        if(fr!==undefined && w[j+1]==='ร' && j+2===w.length && f!=='ร') res.push({end:j+2, rom:rom+fr, cost:cost+0.2});
        if(fr!==undefined && w[j+1]===f && !isDep(w[j+2]) && w[j+2]!=='อ') res.push({end:j+2, rom:rom+fr+'-'+RT_I[f]+'a', cost:cost});
        if(fr!==undefined && 'ตทธชจฐ'.indexOf(f)>=0 && (w[j+1]==='ย'||w[j+1]==='ญ') && w[j+2]!==undefined) res.push({end:j+1, rom:rom+fr+'-'+RT_I[f]+'a', cost:cost-0.1});
        if(fr!==undefined && INDIC_F.indexOf(f)>=0 && isC(w[j+1]) && w[j+2]!==undefined && RT_I[w[j+1]].charAt(0)!==RT_I[f].charAt(0) && 'ชจฉ'.indexOf(w[j+1])<0) res.push({end:j+1, rom:rom+fr+'-'+RT_I[f]+'a', cost:cost-0.05});
        if(opt===2) return; // final required
      }
      res.push({end:j, rom:rom, cost:cost+(isC(f)&&!opt&&!inLead&&w[j+1]!=='อ'?0.4:0)});
    }
    if(LEAD.indexOf(c)>=0){
      var c1=w[i+1], c2=w[i+2];
      if(isC(c1) && isC(c2) && !CLUSTER[c1+c2] && !FAKE_S[c1+c2] && !(c1==='ห'&&SON.indexOf(c2)>=0) && !(c1==='อ'&&c2==='ย') && (isDep(w[i+3])||w[i+3]==='อ'||w[i+3]==='ย'||(c==='แ'&&isC(w[i+3])&&i+4===w.length&&RT_F[w[i+3]]!==undefined)) && w[i+3]!=='ะ'){
        sylls([c].concat(w.slice(i+2)),0).forEach(function(x){ res.push({end:i+1+x.end, rom:RT_I[c1]+'a-'+x.rom, cost:x.cost+(c==='แ'&&i+4===w.length&&isC(w[i+3])?0.2:1.9)}); });
      }
      onsets(w,i+1,1).forEach(function(o){
        var j=i+1+o.len, a=w[j], b=w[j+1], k=o.cost+0.9, init=o.r;
        if(c==='เ'){
          if(a==='็'){ fin(j+1,'',init+'e',k); if(w[j+1]==='ว') res.push({end:j+2,rom:init+'eo',cost:k}); return; }
          if(a==='า'&&b==='ะ'){ res.push({end:j+2,rom:init+'o',cost:k}); return; }
          if(a==='า'){ res.push({end:j+1,rom:init+'ao',cost:k}); return; }
          if(a==='ี'&&b==='ย'){ if(w[j+2]==='ะ') res.push({end:j+3,rom:init+'ia',cost:k}); else fin(j+2,'',init+'ia',k); return; }
          if(a==='ื'&&b==='อ'){ if(w[j+2]==='ะ') res.push({end:j+3,rom:init+'uea',cost:k}); else fin(j+2,'',init+'uea',k); return; }
          if(a==='ิ'){ fin(j+1,'',init+'oe',k); return; }
          if(a==='อ'){ if(b==='ะ') res.push({end:j+2,rom:init+'oe',cost:k}); else res.push({end:j+1,rom:init+'oe',cost:k}); return; }
          if(a==='ย'&&!isDep(b)){ res.push({end:j+1,rom:init+'oei',cost:k}); return; }
          if(a==='ะ'){ res.push({end:j+1,rom:init+'e',cost:k}); return; }
          fin(j,'',init+'e',k); return;
        }
        if(c==='แ'){ if(a==='ะ'){ res.push({end:j+1,rom:init+'ae',cost:k}); return; } if(a==='็') j++; fin(j,'',init+'ae',k); return; }
        if(c==='โ'){ if(a==='ะ'){ res.push({end:j+1,rom:init+'o',cost:k}); return; } fin(j,'',init+'o',k); return; }
        // ใ ไ
        if(a==='ย' && !isDep(b)) res.push({end:j+1,rom:init+'ai',cost:k});
        res.push({end:j,rom:init+'ai',cost:k});
      });
      return res;
    }
    if(isC(c) && w[i+1]==='ฤ'){ var cr=RT_I[c]+'r', vv=('พคมน'.indexOf(c)>=0)?'ue':'i'; fin(i+2,'',cr+vv,0.9,0); if(w[i+2]==='ษ'&&isC(w[i+3])) res.push({end:i+3,rom:cr+vv+'t-sa',cost:0.9}); }
    if(c==='ฤ'){ res.push({end:i+1,rom:'rue',cost:1}); fin(i+1,'','ri',1.2,1); return res; }
    onsets(w,i).forEach(function(o){
      var j=i+o.len, a=w[j], b=w[j+1], k=o.cost, init=o.r;
      if(o.cl && !(isDep(a) || a==='อ' || a==='ว' || a==='ร' || (isC(a)))) return;
      if(a==='ั'){
        if(b==='ว'){ if(w[j+2]==='ะ') res.push({end:j+3,rom:init+'ua',cost:k+0.9}); else fin(j+2,'',init+'ua',k+0.9); return; }
        if(b==='ย' && !isDep(w[j+2])){ res.push({end:j+2,rom:init+'ai',cost:k+0.9}); }
        fin(j+1,'',init+'a',k+0.95,2); return;
      }
      if(a==='า'){ if(b==='ะ'){ res.push({end:j+2,rom:init+'a',cost:k+0.9}); return; } fin(j+1,'',init+'a',k+0.9); return; }
      if(a==='ำ'){ res.push({end:j+1,rom:init+'am',cost:k+0.9}); return; }
      if(a==='ะ'){ res.push({end:j+1,rom:init+'a',cost:k+0.9}); return; }
      if(a==='ิ'||a==='ี'){ if(w[j+1]==='ย'){ res.push({end:j+1,rom:init+'i',cost:k+0.9}); return; } fin(j+1,'',init+'i',k+0.9); return; }
      if(a==='ึ'){ fin(j+1,'',init+'ue',k+0.9); return; }
      if(a==='ื'){ if(b==='อ'){ fin(j+2,'',init+'ue',k+0.9); return; } fin(j+1,'',init+'ue',k+0.9); return; }
      if(a==='ุ'||a==='ู'){ if(a==='ุ' && w[j+1]==='ร' && isC(w[j+2]) && !TONED[j+1]) res.push({end:j+2,rom:init+'u-ra',cost:k+0.85}); fin(j+1,'',init+'u',k+0.9); return; }
      if(a==='็'){ fin(j+1,'',init+'o',k+1); return; }
      if(a==='ร' && b==='ร'){                                   // รร = อัน / อั-
        var f=w[j+2];
        if(isC(f) && !isDep(w[j+3]) && RT_F[f]!==undefined) res.push({end:j+3,rom:init+'a'+RT_F[f],cost:k+0.9});
        res.push({end:j+2,rom:init+'an',cost:k+1});
        return;
      }
      if(a==='อ' && !isDep(b)){                                 // -อ / -อ + final
        if(isC(b) && !TONED[j+1] && !isDep(w[j+2]) && RT_F[b]!==undefined && b!=='อ') res.push({end:j+2,rom:init+'o'+RT_F[b],cost:k+0.95});
        res.push({end:j+1,rom:init+'o',cost:k+1});
      }
      if(a==='ว' && !isDep(b) && b!=='า'){                       // -ว- = อัว
        if(isC(b) && !isDep(w[j+2]) && RT_F[b]!==undefined) res.push({end:j+2,rom:init+'ua'+RT_F[b],cost:k+1.0});
      }
      // Pali-style ร (อรทัย, วรพล, สรวิศ, บริการ, ธรณี)
      if(i===0 && !o.cl && a==='ร' && !TONED[j] && w[j+1]!==undefined && w[j+1]!=='อ' && w[j+1]!=='ร'){
        if(isC(w[j+1])) res.push({end:j+1,rom:init+'o-ra',cost:k+1.2});
        if(isDep(w[j+1]) && w[j+1]!=='ั') res.push({end:j,rom:init+'o',cost:k+1.4});
      }
      // implicit vowels
      if(isC(a) && !TONED[j] && !isDep(b) && b!=='อ' && RT_F[a]!==undefined && a!=='ว' && a!=='ย' && !(a==='ร'&&b==='ร')) res.push({end:j+1,rom:init+'o'+RT_F[a],cost:k+1+(FCOST[a]||0.3)});
      var last = (j>=w.length || w[j]==='\u0E3A');
      res.push({end:j,rom:init+'a',cost:k+(last?2.6:1.6)});
    });
    return res;
  }

  function romWord(w0){
    var w=[], T={}; w0.forEach(function(ch){ if(TONE.indexOf(ch)>=0){ if(w.length) T[w.length-1]=1; } else w.push(ch); }); TONED=T;
    var n=w.length, best=new Array(n+1).fill(null); best[0]={cost:0,parts:[]};
    for(var i=0;i<n;i++){
      if(!best[i]) continue;
      var cand=[];
      for(var L=Math.min(LEX_MAX,n-i); L>=1; L--){ var key=w.slice(i,i+L).join(''); if(LEX[key]) cand.push({end:i+L,rom:(LINK[key]&&i+L<n&&isC(w[i+L])&&w[i+L]!=='อ')?LINK[key]:LEX[key],cost:0.3-0.01*L}); }
      if(w[i]==='\u0E3A') cand.push({end:i+1,rom:'',cost:0});
      else if(!/[ก-๙]/.test(w[i])) cand.push({end:i+1,rom:w[i],cost:0});
      else cand=cand.concat(sylls(w,i));
      if(!cand.length) cand.push({end:i+1,rom:'',cost:5});
      cand.forEach(function(c){
        if(c.end<=i) return;
        var t=best[i].cost+c.cost;
        if(!best[c.end] || t<best[c.end].cost-1e-9) best[c.end]={cost:t, parts:best[i].parts.concat([{th:w.slice(i,c.end).join(''), rom:c.rom}])};
      });
    }
    return best[n] ? best[n].parts : [{th:w.join(''),rom:w.join('')}];
  }

  function romanizeParts(s){
    var words=[];
    norm(s).split(/(\s+)/).forEach(function(tok){
      if(!tok) return;
      if(/^\s+$/.test(tok)){ words.push({sp:tok}); return; }
      var parts=[]; tok.replace(/ๆ/g,'').split(/[-‐–·.]+/).forEach(function(seg){ if(seg) parts=parts.concat(/[ก-ฮ]/.test(seg)?romWord(Array.from(seg)):[{th:seg,rom:seg}]); });
      if(/ๆ/.test(tok)) parts=parts.concat(parts.slice(-1));
      words.push({parts:parts});
    });
    return words;
  }
  function romanizeSyl(s){
    return romanizeParts(s).map(function(x){ return x.sp!==undefined ? ' ' : x.parts.map(function(p){return p.rom;}).join('-'); }).join('').replace(/ +/g,' ').trim();
  }
  function romanize(s){
    return romanizeParts(s).map(function(x){ return x.sp!==undefined ? ' ' : x.parts.map(function(p){return p.rom.replace(/-/g,'');}).join(''); }).join('').replace(/ +/g,' ').trim();
  }

  // ภาษาลู: each syllable → [ล + rest of syllable] + [original initial + อุ/อู + tone + final]
  var TH_CONS='กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
  var MARKS='ัิีึืุู็', TONES='่้๊๋';
  function isTC(c){ return !!c && TH_CONS.indexOf(c)>=0; }
  function inS(c,s){ return !!c && s.indexOf(c)>=0; }
  function parseSyl(ch,i){
    var start=i, pre='';
    if(inS(ch[i],'เแโใไ')){ pre=ch[i]; i++; }
    if(!isTC(ch[i])) return null;
    var init=ch[i]; i++;
    var after=function(k){ return ch[k]; };
    if(init==='ห' && inS(ch[i],'งญนมยรลว') && (ch[i+1]!==undefined || pre)){ init+=ch[i]; i++; }
    else if(init==='อ' && ch[i]==='ย' && inS(ch[i+1],TONES+'่า')){ init+=ch[i]; i++; }
    else if(inS(init,'กขคตปผพบด') && inS(ch[i],'รล') && (inS(ch[i+1],MARKS+TONES+'าะำ') || (isTC(ch[i+1]) && !inS(ch[i+1],'อ')) ) ){ init+=ch[i]; i++; }
    else if(inS(init,'กขค') && ch[i]==='ว' && inS(ch[i+1],MARKS+TONES+'าะ')){ init+=ch[i]; i++; }
    var above='', tone='';
    while(inS(ch[i],MARKS+TONES)){ if(inS(ch[i],TONES)) tone=ch[i]; else above+=ch[i]; i++; }
    var short=true, noFin=false, fin='', silent=0, bare=false;
    if(pre==='เ'){
      if(above==='ี' && ch[i]==='ย'){ short=false; i++; }
      else if(above==='ื' && ch[i]==='อ'){ short=false; i++; }
      else if(above==='ิ'){ short=false; }
      else if(above==='็'){ short=true; }
      else if(ch[i]==='า' && ch[i+1]==='ะ'){ short=true; i+=2; noFin=true; }
      else if(ch[i]==='า'){ short=true; i++; noFin=true; }
      else if(ch[i]==='อ' && !inS(ch[i+1],MARKS)){ short=false; i++; noFin=true; }
      else if(ch[i]==='ะ'){ short=true; i++; noFin=true; }
      else short=false;
    } else if(pre==='แ'){
      if(above==='็') short=true; else if(ch[i]==='ะ'){ short=true; i++; noFin=true; } else short=false;
    } else if(pre==='โ'){
      if(ch[i]==='ะ'){ short=true; i++; noFin=true; } else short=false;
    } else if(pre==='ไ'||pre==='ใ'){
      short=false; noFin=true;
      if(ch[i]==='ย' && !inS(ch[i+1],MARKS+TONES+'าะ')){ i++; silent=1; }
    } else if(above){
      var a=above.charAt(0);
      if(a==='ั'){ if(ch[i]==='ว'){ short=false; i++; } else short=true; }
      else if(a==='ื'){ short=false; if(ch[i]==='อ') i++; }
      else short = (a==='ิ'||a==='ึ'||a==='ุ'||a==='็');
    } else if(ch[i]==='า'){ short=false; i++; }
    else if(ch[i]==='ำ'){ short=true; i++; noFin=true; fin='ม'; }
    else if(ch[i]==='ะ'){ short=true; i++; noFin=true; }
    else if(ch[i]==='อ' && !inS(ch[i+1],MARKS+TONES+'าะ')){ short=false; i++; }
    else if(ch[i]==='ว' && isTC(ch[i+1]) && !inS(ch[i+2],MARKS+TONES+'าะ')){ short=false; i++; }
    else if(ch[i]==='ร' && ch[i+1]==='ร'){ short=true; i+=2; if(!isTC(ch[i])||inS(ch[i+1],MARKS+TONES+'าะ')){ fin='น'; noFin=true; } }
    var vEnd=i;
    if(!noFin && isTC(ch[i])){
      var n=ch[i+1];
      if(n==='์'){ i+=2; }
      else if(isTC(n) && ch[i+2]==='์'){ fin=ch[i]; i+=3; }
      else if(!inS(n,MARKS+TONES+'าะำ') && ch[i]!=='ห'){ fin=ch[i]; i++; if(ch[i]==='์') i++; }
    }
    if(!pre && !above && vEnd===start+init.length+tone.length && !fin) bare=true;
    var uv = inS(above.charAt(0),'ุู');
    return { end:i, bare:bare, text:ch.slice(start,i-silent).join(''), pre:pre, init:init, short:short, uv:uv, fin:fin, tone:tone, above:above };
  }
  // ภาษาลู → ไทย: each pair [pre + ล/ซ/หล + rest][init + ุ/ู/ิ/ี + final] → pre + init + rest ; null if the text isn't Lu
  function fromLu(s){
    var words=s.trim().split(/\s+/), out=[], pairs=0;
    for(var w=0; w<words.length; w++){
      var ch=Array.from(words[w]), i=0, res='';
      while(i<ch.length){
        if(!(isTC(ch[i])||inS(ch[i],'เแโใไ'))){ res+=ch[i]; i++; continue; }
        var a=parseSyl(ch,i); if(!a || ['ล','ซ','หล'].indexOf(a.init)<0) return null;
        var b=parseSyl(ch,a.end); if(!b || !inS(b.above.charAt(0),'ุูิี') || b.pre) return null;
        if(inS(b.above.charAt(0),'ิี') !== (a.init==='หล') || b.fin!==a.fin || b.tone!==a.tone) return null;
        res+=a.pre+b.init+a.text.slice(a.pre.length+a.init.length); i=b.end; pairs++;
      }
      out.push(res);
    }
    return pairs ? out.join('') : null;
  }
  function toLu(s){
    var ch=Array.from(s), out=[], i=0, buf='';
    while(i<ch.length){
      var p = (isTC(ch[i])||inS(ch[i],'เแโใไ')) ? parseSyl(ch,i) : null;
      if(!p){ buf+=ch[i]; i++; continue; }
      if(buf){ out.push(buf.trim()?buf.trim():''); buf=''; }
      var hasRL = /[รล]/.test(p.init);
      var sub = hasRL ? 'ซ' : (p.uv ? 'หล' : 'ล');
      var rest = p.text.slice(p.pre.length + p.init.length);
      var s1 = p.pre + sub + rest + (p.bare?'ะ':'');
      var v2 = p.uv ? (p.short?'ิ':'ี') : (p.short?'ุ':'ู');
      var s2 = p.init + v2 + p.tone + p.fin;
      out.push(s1+s2);
      i=p.end;
    }
    if(buf.trim()) out.push(buf.trim());
    return out.filter(function(x){return x!=='';}).join(' ');
  }

  var EN_TH_DICT = {
    'computer':'คอมพิวเตอร์','internet':'อินเทอร์เน็ต','email':'อีเมล','online':'ออนไลน์','offline':'ออฟไลน์','game':'เกม','football':'ฟุตบอล',
    'hello':'เฮลโล','phone':'โฟน','iphone':'ไอโฟน','facebook':'เฟซบุ๊ก','google':'กูเกิล','youtube':'ยูทูบ','line':'ไลน์','website':'เว็บไซต์','web':'เว็บ',
    'software':'ซอฟต์แวร์','hardware':'ฮาร์ดแวร์','server':'เซิร์ฟเวอร์','technology':'เทคโนโลยี','digital':'ดิจิทัล','application':'แอปพลิเคชัน','app':'แอป',
    'video':'วิดีโอ','music':'มิวสิก','party':'ปาร์ตี้','shopping':'ช็อปปิ้ง','taxi':'แท็กซี่','bus':'บัส','coffee':'คอฟฟี่','cake':'เค้ก','pizza':'พิซซ่า',
    'hamburger':'แฮมเบอร์เกอร์','sandwich':'แซนด์วิช','chocolate':'ช็อกโกแลต','menu':'เมนู','hotel':'โฮเต็ล','bank':'แบงก์','office':'ออฟฟิศ',
    'meeting':'มีตติ้ง','project':'โปรเจกต์','team':'ทีม','manager':'เมเนเจอร์','marketing':'มาร์เก็ตติ้ง','business':'บิสซิเนส','cookie':'คุกกี้',
    'robot':'โรบอต','model':'โมเดล','design':'ดีไซน์','style':'สไตล์','fashion':'แฟชั่น','love':'เลิฟ','thank':'แธงก์','you':'ยู','okay':'โอเค','ok':'โอเค',
    'sorry':'ซอร์รี','happy':'แฮปปี้','birthday':'เบิร์ทเดย์','friend':'เฟรนด์','family':'แฟมิลี','school':'สคูล','university':'ยูนิเวอร์ซิตี',
    'english':'อิงลิช','thailand':'ไทยแลนด์','bangkok':'แบงค็อก','london':'ลอนดอน','america':'อเมริกา','japan':'เจแปน','korea':'โคเรีย','china':'ไชนา',
    'the':'เดอะ','and':'แอนด์','good':'กู๊ด','morning':'มอร์นิง','night':'ไนต์','water':'วอเตอร์','table':'เทเบิล','apple':'แอปเปิล','banana':'บานานา',
    'orange':'ออเรนจ์','car':'คาร์','book':'บุ๊ก','teacher':'ทีชเชอร์','student':'สติวเดนต์','doctor':'ด็อกเตอร์','nurse':'เนิร์ส','police':'โพลิซ',
    'shop':'ช็อป','mall':'มอลล์','service':'เซอร์วิส','center':'เซ็นเตอร์','club':'คลับ','camp':'แคมป์','tour':'ทัวร์','ticket':'ทิกเก็ต',
    'claude':'คลอด','smart':'สมาร์ต','free':'ฟรี','wifi':'ไวไฟ','password':'พาสเวิร์ด','download':'ดาวน์โหลด','upload':'อัปโหลด','file':'ไฟล์','click':'คลิก','like':'ไลก์','share':'แชร์','post':'โพสต์','chat':'แชต','live':'ไลฟ์'
  };
  var E_INIT={b:'บ',c:'ค',d:'ด',f:'ฟ',g:'ก',h:'ฮ',j:'จ',k:'ค',l:'ล',m:'ม',n:'น',p:'พ',q:'ค',r:'ร',s:'ซ',t:'ท',v:'ว',w:'ว',x:'ซ',y:'ย',z:'ซ',
    ch:'ช',tch:'ช',sh:'ช',th:'ธ',ph:'ฟ',wh:'ว',qu:'คว',kn:'น',wr:'ร',gh:'ก',ck:'ก',ng:'ง',cs:'ซ',gs:'จ'};
  var E_FIN={b:'บ',c:'ก',ck:'ก',k:'ก',g:'ก',d:'ด',t:'ต',p:'ป',m:'ม',n:'น',ng:'ง',l:'ล',s:'ส',z:'ซ',x:'กซ',f:'ฟ',v:'ฟ',ch:'ช',tch:'ช',sh:'ช',th:'ธ',ph:'ฟ',j:'จ',r:'ร',w:'ว',y:'ย',h:'',q:'ก',gh:'',kn:'น',wr:'ร',wh:'',qu:'ก',cs:'ส',gs:'จ'};
  var E_V={a:['Cา','แCF'],e:['Cี','เC็F'],i:['Cิ','CิF'],o:['โC','C็อF'],u:['Cู','CัF'],y:['Cี','CิF'],
    ee:['Cี','CีF'],ea:['Cี','CีF'],ie:['Cี','CีF'],oo:['Cู','CูF'],ai:['เC','เCF'],ay:['เC','เCF'],ei:['เC','เCF'],ey:['เC','เCF'],
    oa:['โC','โCF'],ow:['Cาว','CาวF'],ou:['Cาว','CาวF'],oi:['Cอย','CอยF'],oy:['Cอย','CอยF'],au:['Cอ','CอF'],aw:['Cอ','CอF'],ue:['Cิว','CิวF'],ew:['Cิว','CิวF'],
    er:['เCอร์','เCิร์F'],ir:['เCอร์','เCิร์F'],ur:['เCอร์','เCิร์F'],ar:['Cาร์','Cาร์F'],or:['Cอร์','Cอร์F'],
    eer:['Cียร์','Cียร์'],ear:['Cียร์','Cียร์'],ere:['Cียร์','Cียร์'],air:['แCร์','แCร์'],are:['แCร์','แCร์'],our:['Cาวร์','Cาวร์'],ure:['Cัวร์','Cัวร์'],
    'a_e':['เC','เCF'],'i_e':['ไC','ไCF'],'o_e':['โC','โCF'],'u_e':['Cิว','CิวF'],'e_e':['Cี','CีF']};
  var V_KEYS=['eer','ear','ere','air','are','our','ure','er','ir','ur','ar','or','ee','ea','ie','oo','ai','ay','ei','ey','oa','ow','ou','oi','oy','au','aw','ue','ew','a','e','i','o','u'];
  var C_KEYS=['tch','ch','sh','th','ph','wh','ck','ng','qu','kn','wr','gh'];
  function isVowelCh(c){ return !!c && 'aeiou'.indexOf(c)>=0; }
  function enWord(w){
    if(EN_TH_DICT[w]) return EN_TH_DICT[w];
    var magic=false, soft=/[cg]e$/.test(w) ? w.slice(-2,-1) : '';
    if(w.length>2 && /[aeiou][^aeiouy]e$/.test(w)){ magic=true; w=w.slice(0,-1); }
    else if(w.length>3 && /[^aeiouy]e$/.test(w)){ w=w.slice(0,-1); }
    var toks=[], i=0;
    while(i<w.length){
      var rest=w.slice(i), hit=null;
      if(w[i]==='y' && i>0 && !isVowelCh(w[i+1])){ toks.push({t:'V',k:'y'}); i++; continue; }
      for(var a=0;a<V_KEYS.length;a++){
        var k=V_KEYS[a];
        if(rest.indexOf(k)===0){
          if(/r/.test(k) && k.length>=2 && k[k.length-1]==='r' && isVowelCh(w[i+k.length])) continue;
          hit=k; break;
        }
      }
      if(hit){ toks.push({t:'V',k:hit}); i+=hit.length; continue; }
      for(var b=0;b<C_KEYS.length;b++){ if(rest.indexOf(C_KEYS[b])===0){ hit=C_KEYS[b]; break; } }
      if(!hit) hit=w[i];
      var adv=hit.length;
      if(hit==='c' && /[eiy]/.test(w[i+1]||'')) hit='cs';
      if(hit==='g' && i>0 && /^(e[^r]|e$|i|y)/.test(w.slice(i+1))) hit='gs';
      toks.push({t:'C',k:hit}); i+=adv;
    }
    if(soft && toks.length && toks[toks.length-1].k===soft) toks[toks.length-1].k = soft==='c'?'cs':'gs';
    var vi=[]; toks.forEach(function(t,k){ if(t.t==='V') vi.push(k); });
    if(!vi.length) return toks.map(function(t){return E_INIT[t.k]||t.k;}).join('');
    if(magic){ var last=toks[vi[vi.length-1]]; if(last.k.length===1 && E_V[last.k+'_e']) last.k=last.k+'_e'; }
    var syl=vi.map(function(){ return {ini:[],fin:[]}; });
    for(var s=0;s<vi.length;s++){
      var from = s===0 ? 0 : vi[s-1]+1, run=toks.slice(from, vi[s]).map(function(t){return t.k;});
      if(s===0) syl[0].ini=run;
      else if(run.length<=1) syl[s].ini=run;
      else { syl[s-1].fin.push(run[0]); syl[s].ini=run.slice(1); }
    }
    syl[syl.length-1].fin = syl[syl.length-1].fin.concat(toks.slice(vi[vi.length-1]+1).map(function(t){return t.k;}));
    return syl.map(function(sy,s){
      var v=toks[vi[s]].k, tpl=E_V[v]||['C','CF'];
      var ini=sy.ini.map(function(c,k){ if(c==='s' && sy.ini.length>1 && k===0) return 'ส';
        if(k>0 && sy.ini[k-1]==='s' && ({t:'ต',p:'ป',k:'ก',c:'ก'})[c]) return ({t:'ต',p:'ป',k:'ก',c:'ก'})[c];
        return E_INIT[c]||c; }).join('') || 'อ';
      var fins=sy.fin.map(function(c){return E_FIN[c]===undefined?c:E_FIN[c];}).filter(Boolean);
      var fin=fins.join('');
      if(sy.fin.join('')==='nk') fin='งก์';
      else if(fins.length>1) fin+='์';
      var t=fin ? tpl[1] : tpl[0];
      if(fin && t.charAt(0)==='ไ' && fin.slice(-1)!=='์') fin+='์';
      return t.replace('C',ini).replace('F',fin);
    }).join('');
  }
  function en2th(s){
    return s.replace(/[A-Za-z]+(?:'[A-Za-z]+)?/g, function(m){ return enWord(m.toLowerCase().replace(/'/g,'')); });
  }

  function swap(t){
    var isThai=/[฀-๿]/.test(t);
    // same rule as KeySwap: mostly Thai letters -> English keys
    var th=0,en=0; Array.from(t).forEach(function(c){ if(/[฀-๿]/.test(c)) th++; else if(/[A-Za-z]/.test(c)) en++; });
    if(th>en) return Array.from(t).map(function(c){return rev[c]||c;}).join('');
    return Array.from(t).map(function(c){return fwd[c]||c;}).join('');
  }
  function braille(t){
    if(/[⠀-⣿]/.test(t)) return Array.from(t).map(function(c){return BR_REV[c]||c;}).join('');
    var num=false;
    return Array.from(t.toLowerCase()).map(function(c){
      if(NUM[c]){ var p=num?'':'⠼'; num=true; return p+NUM[c]; }
      num=false; return BR[c]!==undefined?BR[c]:c;
    }).join('');
  }
  function morse(t){
    if(/^[\s.\-\/]+$/.test(t)&&t.trim().length>0)
      return t.trim().split(/\s*\/\s*|\s{2,}/).map(function(w){return w.split(/\s+/).map(function(c){return MO_REV[c]||'?';}).join('');}).join(' ');
    return t.toLowerCase().split(/\s+/).filter(Boolean).map(function(w){return Array.from(w).map(function(c){return MO[c]||'';}).filter(Boolean).join(' ');}).join(' / ');
  }
  function roman(t){ return /[฀-๿]/.test(t) ? romanize(t) : en2th(t); }
  return { swap:swap, braille:braille, morse:morse, romanize:roman };
})();
