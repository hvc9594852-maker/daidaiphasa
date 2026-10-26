/* ใดๆภาษา.com — a few faint words, letters and little globes drifting behind every page */
(function(){
  var d = document;
  if (!d.body || d.getElementById('bgWords')) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = '#bgWords{position:absolute;left:0;top:0;width:100%;overflow:hidden;pointer-events:none;z-index:40;mix-blend-mode:multiply;contain:strict}'+
    '#bgWords span{position:absolute;white-space:nowrap;font-family:"Chakra Petch",system-ui,sans-serif;font-weight:600;color:#111;line-height:1;will-change:transform;animation:bgw-drift var(--t) ease-in-out var(--dl) infinite alternate}'+
    '#bgWords svg{display:block;width:1em;height:1em}'+
    ':root[data-theme="dark"] #bgWords{mix-blend-mode:screen}:root[data-theme="dark"] #bgWords span{color:#fff}'+
    '@keyframes bgw-drift{from{transform:translateX(0) rotate(var(--r0))}to{transform:translateX(var(--dx)) rotate(var(--r1))}}'+
    '@media (prefers-reduced-motion:reduce){#bgWords span{animation:none}}'+
    '@media print{#bgWords{display:none}}';
  var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);

  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 4.5 6.5 4.5 10S15 19 12 22M12 2C9 5 7.5 8.5 7.5 12S9 19 12 22"/></svg>';
  var WORDS = ['สวัสดี','Hello','こんにちは','안녕하세요','你好','Bonjour','Hola','Привет','Ciao','Olá','नमस्ते','مرحبا','Xin chào','Hallo','Saluton',
    'ก','ข','ฅ','ๆ','A','Ω','ж','あ','한','ע','ß','ñ','⠓⠊','··· ––– ···','l;ylfu','ภาษา','language','言葉','말','语言','ขอบคุณ','Thank you','ありがとう','감사합니다','谢谢','Merci','Gracias','Danke','Спасибо','ฎ','ฐ','ฬ','Ж','λ','é','ü','ç','ğ','あいう','ㄱㄴㄷ','ABC','กขค','…','“ ”','?','!', GLOBE, GLOBE, GLOBE, GLOBE, GLOBE, GLOBE];

  // stable per page, so words don't jump around between visits
  var seed = 0, path = location.pathname; for (var i = 0; i < path.length; i++) seed = (seed * 31 + path.charCodeAt(i)) >>> 0;
  function rnd(){ seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

  var layer = d.createElement('div'); layer.id = 'bgWords'; layer.setAttribute('aria-hidden', 'true');
  d.body.appendChild(layer);
  var lastH = -1, lastW = -1;
  function build(){
    layer.style.display = 'none'; var H = d.documentElement.scrollHeight, W = innerWidth; layer.style.display = '';
    if (Math.abs(H - lastH) < 40 && W === lastW) return;
    lastH = H; lastW = W; layer.style.height = H + 'px'; layer.innerHTML = '';
    var mobile = W <= 640, gap = mobile ? 380 : 270;
    var hero = d.querySelector('.hero'), start = hero ? hero.getBoundingClientRect().bottom + scrollY : 140;
    var n = Math.max(7, Math.min(mobile ? 34 : 70, Math.round((H - start) / gap)));
    var s0 = seed;
    for (var k = 0; k < n; k++) {
      var w = WORDS[Math.floor(rnd() * WORDS.length)], el = d.createElement('span');
      if (w === GLOBE) el.innerHTML = w; else el.textContent = w;
      var size = (w === GLOBE || w.length <= 2) ? 30 + rnd() * 60 : 22 + rnd() * 46;
      if (mobile) size *= .7;
      var y = start + (k + rnd() * .8) * ((H - start - 80) / n);
      el.style.cssText = 'top:' + Math.round(y) + 'px;left:' + Math.round(rnd() * 92 - 6) + '%;font-size:' + Math.round(size) + 'px;opacity:' + (.05 + rnd() * .04).toFixed(3) +
        ';--dx:' + Math.round((rnd() < .5 ? -1 : 1) * (12 + rnd() * 26)) + 'vw;--r0:' + (rnd() * 10 - 5).toFixed(1) + 'deg;--r1:' + (rnd() * 10 - 5).toFixed(1) + 'deg;--t:' + Math.round(38 + rnd() * 50) + 's;--dl:-' + Math.round(rnd() * 40) + 's';
      layer.appendChild(el);
    }
    seed = s0;
  }
  build();
  addEventListener('load', build); addEventListener('resize', build);
  if ('ResizeObserver' in window) new ResizeObserver(build).observe(d.body);
})();
