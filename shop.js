/* ใดๆภาษา.com — แสดงสินค้าแนะนำจาก Shopee Affiliate (ข้อมูลอยู่ใน shop-items.js) */
(function(){
  // paused while the site is under AdSense review — set to false to show the Shopee box again
  var SHOP_PAUSED=true; if(SHOP_PAUSED) return;
  var items=(window.SHOP_ITEMS||[]).filter(function(x){ return x && x.url && /^https:\/\/([a-z0-9-]+\.)*shopee\.co\.th\//i.test(x.url); });
  if(!items.length) return;
  var page=(location.pathname.replace(/\.html$/,'').replace(/\/+$/,'')||'/').toLowerCase();
  var TOPIC={'/where-to-learn-japanese':'japanese','/where-to-learn-chinese':'chinese','/where-to-learn-english':'english','/where-to-learn-korean':'korean','/where-to-learn-french':'french','/where-to-learn-german':'german','/where-to-learn-thai-sign-language':'sign','/thai-fingerspelling-chart':'sign','/fix-wrong-keyboard-language':'keyboard','/braille-alphabet':'braille','/national-dictionaries':'dictionary','/official-dictionaries-online':'dictionary','/forgetting-curve-vocabulary':'vocab','/hangul-origin':'korean'};
  var isHome = page==='/' || !!document.getElementById('learn');
  if (isHome) return;   // no shop box on the home page (kept tidy for the ebook)
  var want = TOPIC[page]||'';
  var slug = page.replace(/^\//,'');
  function has(t){ return function(x){ return (x.tags||[]).indexOf(t)>=0; }; }
  var list = isHome ? items.filter(has('home')) : items.filter(has('post:'+slug)).concat(want?items.filter(has(want)):[]);
  if(!list.length && !isHome) list = items.filter(has('home'));
  var seen={}; list=list.filter(function(x){ if(seen[x.id]) return false; seen[x.id]=1; return true; });
  if(!list.length) return;
  list=list.slice(0, isHome?6:3);
  function esc(s){ return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  var css=document.createElement('style');
  css.textContent='.shopbox{max-width:1320px;margin:36px auto;padding:0 16px}.shopbox .in{border-radius:24px;padding:clamp(18px,3vw,28px);background:color-mix(in srgb,#EE4D2D 6%,transparent);border:1.5px solid color-mix(in srgb,#EE4D2D 22%,transparent)}'+
    '.shopbox h2{margin:0 0 4px;font-size:clamp(20px,2.4vw,26px)}.shopbox .disc{margin:0 0 16px;font-size:13px;opacity:.65}'+
    '.shopbox ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}'+
    '.shopbox a{display:flex;flex-direction:column;gap:4px;height:100%;text-decoration:none;color:inherit;background:var(--paper,#fff);border-radius:16px;padding:14px 16px;border:1.5px solid color-mix(in srgb,currentColor 10%,transparent);transition:transform .15s,border-color .15s}'+
    '.shopbox a:hover{transform:translateY(-2px);border-color:#EE4D2D}.shopbox b{font-weight:600}.shopbox small{opacity:.7}.shopbox .go{margin-top:auto;padding-top:6px;color:#EE4D2D;font-weight:600;font-size:14px}';
  document.head.appendChild(css);
  var box=document.createElement('aside'); box.className='shopbox'; box.setAttribute('aria-label','ของแนะนำจาก Shopee');
  box.innerHTML='<div class="in"><h2>'+(isHome?'ของแนะนำสำหรับคนเรียนภาษา':'ของที่เกี่ยวกับเรื่องนี้')+'</h2><p class="disc">ลิงก์ Shopee Affiliate · ถ้าซื้อผ่านลิงก์ เว็บได้ค่าคอมมิชชันเล็กน้อยโดยราคาเท่าเดิม</p><ul>'+
    list.map(function(x){ return '<li><a href="'+esc(x.url)+'" target="_blank" rel="sponsored nofollow noopener" data-shop="'+esc(x.id)+'"><b>'+esc(x.title)+'</b>'+(x.note?'<small>'+esc(x.note)+'</small>':'')+'<span class="go">ดูใน Shopee →</span></a></li>'; }).join('')+'</ul></div>';
  box.addEventListener('click',function(e){ var a=e.target.closest('a[data-shop]'); if(a&&window.dHit) dHit('ev:shop-'+String(a.dataset.shop).toLowerCase().replace(/[^a-z0-9\-]/g,'').slice(0,40)); });
  var learn=document.getElementById('learn'), foot=document.querySelector('footer');
  if(learn) learn.parentNode.insertBefore(box, learn.nextSibling);
  else if(foot) foot.parentNode.insertBefore(box, foot);
})();
