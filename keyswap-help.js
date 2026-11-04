/* ใดๆภาษา.com — KeySwap install guide popup (opens when a download button is clicked) */
(function(){
  var d = document, wb = d.getElementById('ksWinBtn'), mb = d.getElementById('ksMacBtn');
  if (!wb || !mb) return;
  var CMD = 'xattr -dr com.apple.quarantine /Applications/KeySwap.app';

  var WHY = {
    mac: 'macOS ตรวจทุกโปรแกรมที่โหลดจากเว็บ ถ้าผู้พัฒนายังไม่ได้ส่งให้ Apple ตรวจ (ต้องสมัครสมาชิกนักพัฒนาแบบเสียเงินปีละ 99 ดอลลาร์) macOS จะกันไว้ก่อนทุกโปรแกรม ไม่ได้แปลว่าตรวจเจอไวรัส KeySwap ทำงานในเครื่องคุณเท่านั้น ไม่ส่งข้อความที่คุณพิมพ์ไปไหน (ยกเว้นคีย์ลัดแปลภาษาที่ต้องใช้เน็ต) และเปิดซอร์สโค้ดให้ดูได้ทั้งหมด',
    win: 'Windows SmartScreen เตือนทุกโปรแกรมที่ยังไม่มีใบรับรองลายเซ็นดิจิทัลแบบเสียเงิน หรือยังมีคนดาวน์โหลดไม่มากพอ ไม่ได้แปลว่าตรวจเจอไวรัส KeySwap ทำงานในเครื่องคุณเท่านั้น ไม่ส่งข้อความที่คุณพิมพ์ไปไหน (ยกเว้นคีย์ลัดแปลภาษาที่ต้องใช้เน็ต) และเปิดซอร์สโค้ดให้ดูได้ทั้งหมด'
  };

  var STEPS = {
    mac: [
      { t: 'แตกไฟล์ แล้วลาก KeySwap ไปไว้ใน Applications',
        d: 'ดับเบิลคลิกไฟล์ <b>KeySwap-Mac.zip</b> ในโฟลเดอร์ Downloads จะได้ไอคอน KeySwap แล้วลากไปใส่โฟลเดอร์ <b>Applications</b>',
        m: '<div class="mk mk-finder"><div class="mk-bar"><i></i><i></i><i></i><span>Downloads</span></div><div class="mk-files"><span class="mk-file"><b class="ic zip"></b>KeySwap-Mac.zip</span><span class="mk-arrow">→</span><span class="mk-file hl"><b class="ic app"></b>KeySwap</span><span class="mk-arrow">→</span><span class="mk-file"><b class="ic dir"></b>Applications</span></div></div>' },
      { t: 'เปิดครั้งแรก จะขึ้น "KeySwap Not Opened" ให้กด Done',
        d: '<b>อย่ากด Move to Trash</b> กดแค่ <b>Done</b> เพื่อปิดหน้าต่าง (ขั้นนี้ทำให้ปุ่มอนุญาตไปโผล่ในการตั้งค่า)',
        m: '<div class="mk mk-alert"><b class="ic app big"></b><p class="h">“KeySwap” Not Opened</p><p>Apple could not verify “KeySwap” is free of malware…</p><span class="mk-b">Move to Trash</span><span class="mk-b hl">Done</span></div>' },
      { t: 'ไปที่ System Settings › Privacy & Security แล้วกด Open Anyway',
        d: 'คลิกโลโก้ Apple มุมซ้ายบน › <b>System Settings</b> › <b>Privacy &amp; Security</b> เลื่อนลงล่างสุดถึงหัวข้อ Security จะเห็น “KeySwap” was blocked… กด <b>Open Anyway</b> แล้วใส่รหัสผ่านเครื่อง (ปุ่มนี้อยู่แค่ประมาณ 1 ชั่วโมงหลังลองเปิด ถ้าไม่เห็นให้ลองเปิด KeySwap ใหม่อีกครั้ง)',
        m: '<div class="mk mk-set"><div class="mk-side"><span>Wi-Fi</span><span>General</span><span class="on">Privacy &amp; Security</span><span>Desktop &amp; Dock</span></div><div class="mk-main"><p class="h">Security</p><p>Allow applications from<br><u>App Store &amp; Known Developers</u></p><div class="mk-row"><span>“KeySwap” was blocked to protect your Mac.</span><span class="mk-b hl">Open Anyway</span></div></div></div>' },
      { t: 'เปิด KeySwap อีกครั้ง แล้วกด Open Anyway',
        d: 'จะมีหน้าต่างถามอีกครั้ง กด <b>Open Anyway</b> หลังจากนี้เปิดได้ปกติ ไม่ต้องทำซ้ำอีก',
        m: '<div class="mk mk-alert"><b class="ic app big"></b><p class="h">Open “KeySwap”?</p><p>Apple is not able to verify that it is free from malware…</p><span class="mk-b hl">Open Anyway</span><span class="mk-b">Done</span></div>' },
      { t: 'อนุญาตให้ KeySwap ใช้คีย์ลัด (ครั้งเดียว)',
        d: 'System Settings › Privacy &amp; Security › <b>Accessibility</b> (macOS ใหม่ชื่อ Device Control and Data Access) › เปิดสวิตช์ <b>KeySwap</b> จากนั้นจะเห็นไอคอน KeySwap ที่แถบเมนูด้านบน คลุมดำข้อความแล้วกดคีย์ลัดได้เลย',
        m: '<div class="mk mk-set"><div class="mk-side"><span>General</span><span class="on">Privacy &amp; Security</span></div><div class="mk-main"><p class="h">Accessibility</p><div class="mk-row"><span><b class="ic app sm"></b> KeySwap</span><span class="mk-sw on"></span></div><div class="mk-row dim"><span>Other app</span><span class="mk-sw"></span></div></div></div>' }
    ],
    win: [
      { t: 'ถ้าเบราว์เซอร์ไม่ยอมเก็บไฟล์ ให้กด Keep',
        d: 'Edge/Chrome อาจขึ้นว่า <b>isn\'t commonly downloaded</b> ให้ชี้ที่ไฟล์ › กด <b>⋯</b> › <b>Keep</b> › <b>Show more</b> › <b>Keep anyway</b>',
        m: '<div class="mk mk-dl"><p class="h">Downloads</p><div class="mk-row"><span><b class="ic exe sm"></b> KeySwap-Windows.exe isn\'t commonly downloaded. Make sure you trust it before you open it.</span><span class="mk-b">⋯</span></div><div class="mk-menu"><span class="hl">Keep</span><span>Delete</span><span>Report this file as safe</span></div></div>' },
      { t: 'เปิดไฟล์ ถ้าขึ้นจอสีฟ้า "Windows protected your PC" ให้กด More info',
        d: 'ดับเบิลคลิก <b>KeySwap-Windows.exe</b> ถ้าเห็นหน้าต่างสีฟ้า ให้กดคำว่า <b>More info</b> (ตัวหนังสือขีดเส้นใต้) อย่ากด Don\'t run',
        m: '<div class="mk mk-ss"><p class="h">Windows protected your PC</p><p>Microsoft Defender SmartScreen prevented an unrecognized app from starting…</p><p><u class="hl">More info</u></p><span class="mk-b w">Don\'t run</span></div>' },
      { t: 'กด Run anyway',
        d: 'จะมีชื่อโปรแกรมกับ Publisher: Unknown publisher ขึ้นมา และปุ่ม <b>Run anyway</b> โผล่เพิ่ม กดปุ่มนั้น',
        m: '<div class="mk mk-ss"><p class="h">Windows protected your PC</p><p>App: KeySwap-Windows.exe<br>Publisher: Unknown publisher</p><span class="mk-b w hl">Run anyway</span><span class="mk-b w">Don\'t run</span></div>' },
      { t: 'เสร็จแล้ว ดูไอคอนที่มุมขวาล่าง',
        d: 'KeySwap จะไปอยู่ที่มุมขวาล่างของจอ (ถ้าไม่เห็น กดลูกศร <b>^</b> ข้างนาฬิกา) คลุมดำข้อความในโปรแกรมไหนก็ได้แล้วกดคีย์ลัด ครั้งต่อไปเปิดได้เลยไม่ขึ้นเตือนอีก',
        m: '<div class="mk mk-tray"><span class="mk-up">^</span><b class="ic app sm hl"></b><span>ENG</span><span>22:30</span></div>' }
    ]
  };

  var el = d.createElement('div');
  el.className = 'ksm'; el.hidden = true;
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'ksmT');
  el.innerHTML =
    '<div class="ksm-card" tabindex="-1">' +
      '<button class="ksm-x" type="button" aria-label="ปิด">×</button>' +
      '<p class="ksm-ok" id="ksmOk"></p>' +
      '<h3 id="ksmT">วิธีเปิด KeySwap ครั้งแรก</h3>' +
      '<div class="ksm-tabs" role="tablist"><button type="button" role="tab" data-os="mac">Mac</button><button type="button" role="tab" data-os="win">Windows</button></div>' +
      '<div class="ksm-why"><b>ทำไมถึงขึ้นคำเตือน?</b><p id="ksmWhy"></p></div>' +
      '<ol class="ksm-steps" id="ksmSteps"></ol>' +
      '<div class="ksm-alt" id="ksmAlt"><b>วิธีลัดสำหรับคนคล่องคอม</b><p>เปิดแอป <b>Terminal</b> (กด ⌘ Space พิมพ์ Terminal) วางคำสั่งนี้แล้วกด Enter ใช้แทนขั้นที่ 2–4 ได้</p><div class="ksm-cmd"><code>' + CMD + '</code><button type="button" id="ksmCopy">คัดลอก</button></div></div>' +
      '<div class="ksm-help"><b>ทำครบแล้วยังเปิดไม่ได้?</b><p>บอกเราว่าติดตรงไหน เราจะช่วยดูให้</p>' +
        '<form id="ksmForm"><textarea id="ksmMsg" rows="3" maxlength="1500" placeholder="เช่น กด Open Anyway แล้วไม่มีอะไรเกิดขึ้น · ใช้ macOS 15 / Windows 11"></textarea>' +
        '<input id="ksmContact" maxlength="120" placeholder="อีเมลหรือ LINE ID สำหรับติดต่อกลับ"><input type="text" id="ksmHp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">' +
        '<div class="ksm-row"><button type="submit" class="ksm-send">ส่งถึงทีมงาน</button><a href="mailto:contact@daidaiphasa.com?subject=KeySwap%20%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89">หรืออีเมล contact@daidaiphasa.com</a></div><p class="ksm-msg" id="ksmSent" aria-live="polite"></p></form></div>' +
      '<button type="button" class="ksm-done">เข้าใจแล้ว</button>' +
    '</div>';
  d.body.appendChild(el);
  var $ = function(id){ return d.getElementById(id); }, cur = 'mac', lastFocus = null;

  function paint(os){
    cur = os;
    el.querySelectorAll('.ksm-tabs button').forEach(function(b){ b.setAttribute('aria-selected', b.dataset.os === os); });
    $('ksmWhy').textContent = WHY[os];
    $('ksmSteps').innerHTML = STEPS[os].map(function(s, i){
      return '<li><div class="ksm-txt"><span class="ksm-n">' + (i + 1) + '</span><div><b>' + s.t + '</b><p>' + s.d + '</p></div></div>' + s.m + '</li>';
    }).join('');
    $('ksmAlt').hidden = os !== 'mac';
  }
  function open(os, started){
    lastFocus = d.activeElement;
    $('ksmOk').textContent = started ? 'กำลังดาวน์โหลด KeySwap สำหรับ ' + (os === 'mac' ? 'Mac' : 'Windows') + ' ระหว่างนี้อ่านวิธีเปิดด้านล่างก่อน' : '';
    $('ksmOk').hidden = !started;
    paint(os); el.hidden = false; d.documentElement.classList.add('ksm-lock');
    el.querySelector('.ksm-card').scrollTop = 0; el.querySelector('.ksm-card').focus();
    if (window.dHit) dHit('ev:keyswap-guide-' + os);
  }
  function close(){ el.hidden = true; d.documentElement.classList.remove('ksm-lock'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  wb.addEventListener('click', function(){ setTimeout(function(){ open('win', true); }, 50); });
  mb.addEventListener('click', function(){ setTimeout(function(){ open('mac', true); }, 50); });
  el.addEventListener('click', function(e){
    if (e.target === el || e.target.closest('.ksm-x,.ksm-done')) { close(); return; }
    var t = e.target.closest('.ksm-tabs button'); if (t) paint(t.dataset.os);
  });
  d.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !el.hidden) close(); });
  $('ksmCopy').addEventListener('click', function(){
    var b = this; try { navigator.clipboard.writeText(CMD); } catch (e) {}
    b.textContent = 'คัดลอกแล้ว'; setTimeout(function(){ b.textContent = 'คัดลอก'; }, 1600);
  });
  $('ksmForm').addEventListener('submit', function(e){
    e.preventDefault();
    var msg = $('ksmMsg').value.trim(), out = $('ksmSent');
    if (msg.length < 3) { out.textContent = 'พิมพ์เล่าปัญหาสั้นๆ ก่อนส่งนะครับ'; return; }
    var btn = el.querySelector('.ksm-send'); btn.disabled = true; out.textContent = 'กำลังส่ง…';
    fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'reports', hp: $('ksmHp').value, item: { word: 'KeySwap เปิดไม่ได้ (' + (cur === 'mac' ? 'Mac' : 'Windows') + ')', group: 'site', type: 'keyswap-' + cur,
        detail: msg + ' · UA: ' + navigator.userAgent.slice(0, 160), contact: $('ksmContact').value.trim() } }) })
      .then(function(r){ if (!r.ok) throw 0; out.textContent = 'ส่งแล้ว ขอบคุณครับ เราจะติดต่อกลับโดยเร็ว'; $('ksmMsg').value = ''; })
      .catch(function(){ out.innerHTML = 'ส่งไม่สำเร็จ ลองอีเมลมาที่ <a href="mailto:contact@daidaiphasa.com">contact@daidaiphasa.com</a>'; })
      .then(function(){ btn.disabled = false; });
  });
  // the inline help boxes also open the full guide
  d.querySelectorAll('.ks-help').forEach(function(h){
    var a = d.createElement('button'); a.type = 'button'; a.className = 'ks-guide'; a.textContent = 'ดูวิธีแบบมีภาพประกอบ →';
    var os = h.closest('[data-os]') ? h.closest('[data-os]').dataset.os : 'mac';
    a.addEventListener('click', function(){ open(os, false); }); h.appendChild(a);
  });
})();
