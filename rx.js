/* ใดๆภาษา.com — retro layer behaviour: screen typing demo + window reveal */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // retro computer screen: type the wrong text, strike it, then type the fixed text
  var DEMOS = [
    ['แก้แป้น', 'l;ylfu', 'สวัสดี'],
    ['แก้แป้น', "dbo-hk;", 'กินข้าว'],
    ['ถอดเสียง', 'computer', 'คอมพิวเตอร์'],
    ['ภาษาลู', 'รักนะ', 'ซักรุก ละนุ'],
    ['มอร์ส', 'sos', '··· ––– ···'],
    ['เบรลล์', 'hello', '⠓⠑⠇⠇⠕']
  ];
  var label = document.getElementById('rxLabel'), inEl = document.getElementById('rxIn'), outEl = document.getElementById('rxOut');
  if (label && inEl && outEl) {
    if (reduce) { /* static first demo already in the markup */ }
    else {
      var i = 0;
      var wait = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
      var type = async function(el, text, speed){ el.textContent = ''; var chars = Array.from(text); for (var k = 0; k < chars.length; k++) { el.textContent += chars[k]; await wait(speed); } };
      (async function loop(){
        while (true) {
          var d = DEMOS[i % DEMOS.length]; i++;
          label.textContent = '> ' + d[0];
          inEl.classList.remove('struck'); outEl.firstChild && (outEl.firstChild.textContent = '');
          await type(inEl, d[1], 110);
          await wait(450); inEl.classList.add('struck'); await wait(420);
          var t = outEl.querySelector('.rx-t');
          await type(t, d[2], 120);
          await wait(2200);
        }
      })();
    }
  }

  // windows slide in as they scroll into view (everything stays visible without JS)
  var items = document.querySelectorAll('.rx-reveal');
  if (!reduce && 'IntersectionObserver' in window && items.length) {
    document.documentElement.classList.add('rx-anim');
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('rx-on'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function(el, n){ el.style.transitionDelay = (n % 4) * 70 + 'ms'; io.observe(el); });
  } else if (!reduce) {
    document.documentElement.classList.add('rx-anim');
    items.forEach(function(el){ el.classList.add('rx-on'); });
  }
})();
