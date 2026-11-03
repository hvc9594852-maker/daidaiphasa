/* ใดๆภาษา.com — ebook checkout (PromptPay + slip, approved by the owner in /admin) */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var KEY = 'ebook-order', order = null, slipData = '', pollT = 0;

  function save(o){ try{ localStorage.setItem(KEY, JSON.stringify({id:o.id, k:o.k})); }catch(e){} }
  function load(){
    var q = new URLSearchParams(location.search);
    if (q.get('o') && q.get('k')) return {id:q.get('o'), k:q.get('k')};
    try{ return JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){ return null; }
  }
  function link(o){ return location.origin + '/ebook?o=' + encodeURIComponent(o.id) + '&k=' + encodeURIComponent(o.k) + '#buy'; }
  function baht(s){ return '฿' + (s/100).toFixed(2); }
  function track(k){ if (window.dHit) dHit('ev:ebook-' + k); }

  function step(n){
    ['s1','s2','s3','s4','s5'].forEach(function(id, i){ $(id).hidden = (i+1) !== n; });
    document.querySelectorAll('.steps span').forEach(function(s){
      var x = +s.dataset.s, cur = n === 5 ? 3 : n;
      s.className = x === cur ? 'on' : (x < cur ? 'done' : '');
    });
    $('keep').hidden = n === 1 || !order;
    if (order){ $('oid').textContent = order.id; $('olink').textContent = link(order); }
  }

  function show(o){
    order = Object.assign(order || {}, o);
    clearTimeout(pollT);
    if (o.status === 'pending'){
      $('amt').textContent = baht(o.amount); $('amt2').textContent = baht(o.amount);
      if (o.payeeName){ $('payname').textContent = o.payeeName; $('payname2').textContent = o.payeeName; }
      $('paybank').textContent = o.bank ? 'ธนาคาร' + o.bank.replace(/^ธนาคาร/, '') : '';
      $('amtOn').textContent = '';
      if (o.qr && window.qrcode){
        var q = qrcode(0, 'M'); q.addData(o.qr); q.make();
        $('qr').innerHTML = q.createSvgTag({cellSize:6, margin:1, scalable:true});
        $('amtOn').textContent = baht(o.amount);
        $('typeamt').innerHTML = 'ยอด <b>' + baht(o.amount) + '</b> ใส่มาใน QR ให้แล้ว ตรวจให้ตรงก่อนกดโอน';
        try{ var c = document.createElement('canvas'), n = q.getModuleCount(), cs = 10, m = 4; c.width = c.height = (n + m*2) * cs;
          var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,c.width,c.height); g.fillStyle = '#000';
          for (var r=0;r<n;r++) for (var cc=0;cc<n;cc++) if (q.isDark(r,cc)) g.fillRect((cc+m)*cs,(r+m)*cs,cs,cs);
          $('saveqr').href = c.toDataURL('image/png'); $('saveqr').hidden = false; }catch(e){}
      } else if (o.qrImage){
        $('qr').innerHTML = '<img src="' + o.qrImage + '" alt="QR PromptPay ของร้าน">';
        $('saveqr').href = o.qrImage; $('saveqr').hidden = false;
      }
      step(2);
    } else if (o.status === 'review'){
      step(3); pollT = setTimeout(refresh, 20000);
    } else if (o.status === 'approved'){
      var base = '/api/ebook/download?id=' + encodeURIComponent(order.id) + '&k=' + encodeURIComponent(order.k) + '&f=';
      $('dpdf').href = base + 'pdf'; $('depub').href = base + 'epub';
      $('dlleft').textContent = 'ดาวน์โหลดไปแล้ว ' + (o.downloads||0) + ' จาก ' + (o.maxDownloads||30) + ' ครั้ง';
      step(4);
    } else if (o.status === 'rejected'){
      $('rej').textContent = o.note ? 'เหตุผล: ' + o.note : '';
      step(5);
    }
  }

  function refresh(){
    if (!order) return;
    fetch('/api/ebook/order?id=' + encodeURIComponent(order.id) + '&k=' + encodeURIComponent(order.k), {cache:'no-store'})
      .then(function(r){ return r.json().then(function(j){ return {ok:r.ok, j:j}; }); })
      .then(function(x){ if (x.ok) show(x.j); else { order = null; try{ localStorage.removeItem(KEY); }catch(e){} step(1); } })
      .catch(function(){ pollT = setTimeout(refresh, 30000); });
  }

  $('s1').addEventListener('submit', function(e){
    e.preventDefault();
    var em = $('em').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ $('e1').textContent = 'กรอกอีเมลให้ถูกต้อง'; return; }
    $('e1').textContent = ''; $('b1').disabled = true;
    fetch('/api/ebook/order', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:em, name:$('nm').value.trim(), hp:$('hp').value})})
      .then(function(r){ return r.json().then(function(j){ return {ok:r.ok, j:j}; }); })
      .then(function(x){
        $('b1').disabled = false;
        if (!x.ok){ $('e1').textContent = x.j.error || 'สร้างคำสั่งซื้อไม่ได้ ลองใหม่อีกครั้ง'; return; }
        order = {id:x.j.id, k:x.j.k}; save(order); track('order');
        history.replaceState(null, '', link(order).replace(location.origin, ''));
        show(x.j);
      })
      .catch(function(){ $('b1').disabled = false; $('e1').textContent = 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง'; });
  });

  // slip: shrink to a small JPEG before upload
  $('slip').addEventListener('change', function(){
    var f = this.files && this.files[0]; if (!f) return;
    $('e2').textContent = '';
    var img = new Image(), url = URL.createObjectURL(f);
    img.onload = function(){
      var s = Math.min(1, 1300 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      var q = .82; slipData = c.toDataURL('image/jpeg', q);
      while (slipData.length > 850000 && q > .3){ q -= .15; slipData = c.toDataURL('image/jpeg', q); }
      $('dropt').innerHTML = '<img src="' + slipData + '" alt="สลิปที่เลือก">แตะเพื่อเปลี่ยนรูป';
      $('b2').disabled = false; URL.revokeObjectURL(url);
    };
    img.onerror = function(){ $('e2').textContent = 'เปิดรูปนี้ไม่ได้ ลองใช้รูป JPG หรือ PNG'; };
    img.src = url;
  });
  $('b2').addEventListener('click', function(){
    if (!slipData || !order) return;
    $('b2').disabled = true; $('e2').textContent = '';
    fetch('/api/ebook/slip', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:order.id, k:order.k, slip:slipData})})
      .then(function(r){ return r.json().then(function(j){ return {ok:r.ok, j:j}; }); })
      .then(function(x){ if (!x.ok){ $('b2').disabled = false; $('e2').textContent = x.j.error || 'ส่งสลิปไม่สำเร็จ'; return; } track('slip'); show({status:x.j.status}); })
      .catch(function(){ $('b2').disabled = false; $('e2').textContent = 'เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง'; });
  });
  $('copyAmt').addEventListener('click', function(){ if (!order || !order.amount) return; var t = (order.amount/100).toFixed(2); try{ navigator.clipboard.writeText(t); this.textContent = 'คัดลอกแล้ว'; var me = this; setTimeout(function(){ me.textContent = 'คัดลอกยอด'; }, 1500); }catch(e){} });
  $('again').addEventListener('click', function(){ order = null; try{ localStorage.removeItem(KEY); }catch(e){} history.replaceState(null,'','/ebook#buy'); step(1); });
  document.addEventListener('click', function(e){ var a = e.target.closest('#dpdf,#depub'); if (a) setTimeout(refresh, 2500); });

  order = load();
  if (order) refresh(); else step(1);
})();
