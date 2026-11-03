/* ใดๆภาษา.com — KeySwap download panel (shown on the ลืมสลับแป้น tool) */
(function(){
  // ---- settings: change these when files/links are ready ----
  var WINDOWS_EXE_URL = '/downloads/KeySwap-Windows.exe';   // ~14 MB, Windows 10/11 (64-bit)
  var MAC_URL = '/downloads/KeySwap-Mac.zip';               // KeySwap.app, universal, ~10 MB
  // ------------------------------------------------------------

  var d = document, box = d.getElementById('keyswap'); if (!box) return;
  function detectOS(){
    var ua = navigator.userAgent || '', p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    var touch = navigator.maxTouchPoints > 1;
    if (/android|iphone|ipad|ipod/i.test(ua) || (/mac/i.test(p) && touch)) return 'mobile';
    if (/win/i.test(p) || /windows/i.test(ua)) return 'win';
    if (/mac/i.test(p) || /mac os x/i.test(ua)) return 'mac';
    return 'other';
  }
  var os = detectOS();
  var win = box.querySelector('[data-os="win"]'), mac = box.querySelector('[data-os="mac"]');
  var wb = d.getElementById('ksWinBtn'), mb = d.getElementById('ksMacBtn');
  wb.href = WINDOWS_EXE_URL;
  mb.href = MAC_URL;
  if (os === 'mac') { mac.classList.add('mine'); mac.parentNode.insertBefore(mac, win); }
  else if (os === 'win') win.classList.add('mine');
  if (os === 'mobile') box.classList.add('ks-mobile');
  var note = d.getElementById('ksOs');
  note.textContent = os === 'win' ? 'ตรวจพบว่าคุณใช้ Windows' : os === 'mac' ? 'ตรวจพบว่าคุณใช้ Mac' : os === 'mobile' ? 'KeySwap ใช้บนคอมพิวเตอร์ เปิดหน้านี้บนคอมเพื่อดาวน์โหลด' : '';

  // a little bounce when a card is pressed
  box.querySelectorAll('.ks-card').forEach(function(c){
    c.addEventListener('pointerdown', function(){ c.classList.remove('ks-boing'); void c.offsetWidth; c.classList.add('ks-boing'); });
    c.addEventListener('animationend', function(e){ if (e.animationName === 'ks-boing') c.classList.remove('ks-boing'); });
  });

  // download counter (updated once a day at midnight Bangkok time)
  fetch('/api/stats').then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
    if (!j || !j.downloads || j.downloads < 10) return;   // hide tiny numbers
    var p = d.createElement('p'); p.className = 'ks-count';
    p.innerHTML = '<b>' + j.downloads.toLocaleString('th-TH') + '</b> ครั้ง ที่ดาวน์โหลด KeySwap ไปแล้ว <span>· อัปเดตทุกเที่ยงคืน</span>';
    var head = box.querySelector('.ks-head'); if (head) head.appendChild(p);
  }).catch(function(){});

  // shown on every tool KeySwap can do: swap, romanize, braille, morse, translate
  var tabs = ['tab-fix','tab-romanize','tab-braille','tab-morse','tab-tr'].map(function(id){ return d.getElementById(id); }).filter(Boolean);
  function sync(){ box.hidden = !tabs.some(function(t){ return t.getAttribute('aria-selected') === 'true'; }); }
  sync(); tabs.forEach(function(t){ new MutationObserver(sync).observe(t, {attributes:true, attributeFilter:['aria-selected']}); });
})();
