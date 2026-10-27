/* ใดๆภาษา.com — KeySwap download panel (shown on the ลืมสลับแป้น tool) */
(function(){
  // ---- settings: change these when files/links are ready ----
  var WINDOWS_EXE_URL = '/downloads/KeySwap-Windows.exe';   // 1.2 MB, Windows 10/11 (64-bit)
  var MAC_URL = '/downloads/KeySwap-Mac.zip';               // Quick Action (Automator workflow), 8 KB
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

  // show only on the "ลืมสลับแป้น" tool
  var tab = d.getElementById('tab-fix');
  function sync(){ box.hidden = !(tab && tab.getAttribute('aria-selected') === 'true'); }
  if (tab) { sync(); new MutationObserver(sync).observe(tab, {attributes:true, attributeFilter:['aria-selected']}); }
})();
