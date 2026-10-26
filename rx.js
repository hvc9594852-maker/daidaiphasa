/* ใดๆภาษา.com — retro layer behaviour
   hero typing (l;ylfu -> สวัสดี), CRT demo, scroll-pinned popping windows, eclipse rise, reveals, tool keyboard */
(function(){
  window.rxReady = true;
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = root.classList.contains('rx-anim') && !reduce;
  var wait = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  var seg = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter('th', {granularity:'grapheme'}) : null;
  function graphemes(t){ return seg ? Array.from(seg.segment(t), function(x){ return x.segment; }) : Array.from(t); }
  async function type(el, text, speed, caret){
    var g = graphemes(text); el.textContent = ''; if (caret) el.classList.add('tw-caret');
    for (var k = 0; k < g.length; k++) { el.textContent += g[k]; await wait(speed); }
    if (caret) el.classList.remove('tw-caret');
  }

  // ---------- hero headline: type the wrong text, strike it, type the right one ----------
  var typo = d.querySelector('.rx-typo'), tw = d.querySelector('.rx-tw'), h1 = d.querySelector('.rx-h');
  if (typo && tw && h1) {
    if (!anim) { typo.classList.add('struck'); h1.classList.add('done'); }
    else {
      var A = typo.textContent, B = tw.textContent;
      typo.textContent = ''; tw.textContent = '';
      (async function(){
        await wait(900);
        await type(typo, A, 95, false);
        await wait(380); typo.classList.add('struck'); await wait(560);
        await type(tw, B, 150, true);
        h1.classList.add('done');
      })();
    }
  }

  // ---------- CRT screen demo ----------
  var DEMOS = [
    ['แก้แป้น', 'l;ylfu', 'สวัสดี'],
    ['แก้แป้น', 'dbo-hk;', 'กินข้าว'],
    ['ถอดเสียง', 'computer', 'คอมพิวเตอร์'],
    ['ภาษาลู', 'รักนะ', 'ซักรุก ละนุ'],
    ['มอร์ส', 'sos', '··· ––– ···'],
    ['เบรลล์', 'hello', '⠓⠑⠇⠇⠕']
  ];
  var label = d.getElementById('rxLabel'), inEl = d.getElementById('rxIn'), outEl = d.getElementById('rxOut'), fk = d.getElementById('rxFkeys');
  function markKey(name){ if (!fk) return; fk.querySelectorAll('span').forEach(function(s){ s.classList.toggle('on', s.dataset.k === name); }); }
  markKey('แก้แป้น');
  if (label && inEl && outEl && !reduce) {
    (async function loop(){
      var i = 0; await wait(anim ? 1500 : 0);
      while (true) {
        var dm = DEMOS[i % DEMOS.length]; i++;
        label.textContent = '> ' + dm[0]; markKey(dm[0]);
        inEl.classList.remove('struck');
        var t = outEl.querySelector('.rx-t'); t.textContent = '';
        await type(inEl, dm[1], 110, false);
        await wait(450); inEl.classList.add('struck'); await wait(420);
        await type(t, dm[2], 120, false);
        await wait(2300);
      }
    })();
  }

  // ---------- typed window text: split into grapheme spans (layout stays fixed while typing) ----------
  var typed = d.querySelector('.rx-type'), chars = [];
  if (typed) {
    var rb = 0;
    (function walk(node){
      Array.from(node.childNodes).forEach(function(n){
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment(), inRain = n.parentNode.classList && n.parentNode.classList.contains('rx-rainbow');
          graphemes(n.textContent).forEach(function(g){
            var s = d.createElement('span'); s.className = 'ch' + (inRain ? ' rx-rb' + (rb++ % 4 + 1) : ''); s.textContent = g; frag.appendChild(s); chars.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(typed);
  }
  function showTyped(f){
    var n = Math.round(f * chars.length);
    chars.forEach(function(c, i){ c.classList.toggle('off', i >= n); c.classList.toggle('cur', i === n - 1 && n < chars.length); });
  }

  // ---------- scroll-pinned story ----------
  var story = d.getElementById('rxStory'), track = story && story.querySelector('.rx-track');
  var wins = story ? Array.from(story.querySelectorAll('.rx-s')) : [];
  var ghost = story && story.querySelector('.rx-ghost');
  var eclipse = d.querySelector('.rx-eclipse');
  var steps = 6, lastStep = -2;
  if (track && wins.length && anim && window.CSS && CSS.supports('position', 'sticky')) {
    root.classList.add('rx-scrolly');
    showTyped(0);
  }
  function onScroll(){
    var vh = innerHeight;
    if (root.classList.contains('rx-scrolly') && track.offsetParent !== null) {
      var r = track.getBoundingClientRect(), total = r.height - vh;
      if (r.bottom > -vh && r.top < vh * 2) {
        var p = Math.min(1, Math.max(0, -r.top / total));
        var x = p * steps, step = Math.min(steps - 1, Math.floor(x));
        if (step !== lastStep) {
          wins.forEach(function(w){
            var s = +w.dataset.step;
            w.classList.toggle('now', s === step);
            w.classList.toggle('past', s < step);
            w.style.transitionDelay = (s === step) ? (getComputedStyle(w).getPropertyValue('--d') || '0s') : '0s';
          });
          lastStep = step;
        }
        if (step === steps - 1) showTyped(Math.min(1, (x - step) * 1.7 + .04)); else showTyped(0);
        if (ghost) ghost.style.setProperty('--g', p.toFixed(3));
      }
    }
    if (eclipse && anim) {
      var er = eclipse.getBoundingClientRect();
      var e = Math.min(1, Math.max(0, (vh - er.top) / (vh * .85)));
      eclipse.style.setProperty('--e', e.toFixed(3));
    }
  }
  var ticking = false;
  function req(){ if (!ticking) { ticking = true; requestAnimationFrame(function(){ ticking = false; onScroll(); }); } }
  addEventListener('scroll', req, {passive:true}); addEventListener('resize', req);
  onScroll();

  // ---------- reveal (tools window, etc.) ----------
  var items = d.querySelectorAll('.rx-reveal');
  if (anim && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('rx-on'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function(el){ io.observe(el); });
  } else items.forEach(function(el){ el.classList.add('rx-on'); });

  // ---------- tool keyboard: 1980s layout (function row, modifiers, space bar, LED window) ----------
  (function(){
    var rows = d.getElementById('kbRows'), fig = d.getElementById('kb');
    if (!rows || rows.querySelector('.kb-well')) return;
    var rs = Array.from(rows.children).filter(function(n){ return n.classList.contains('kb-row'); });
    if (rs.length !== 4) return;
    function mk(cls, lab, w){ var k = d.createElement('div'); k.className = 'kx ' + cls; k.setAttribute('aria-hidden', 'true'); if (lab) k.innerHTML = '<span class="lab">' + lab + '</span>'; if (w) k.style.flex = '0 0 ' + w + 'px'; return k; }
    var head = d.createElement('div'); head.className = 'kb-head'; head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<span class="kb-badge">ใดๆ</span><span class="kb-cable">ใดๆภาษา · KB-2529</span><span class="kb-led"><span>แป้นไทย<i data-l="th"></i></span><span>แป้นอังกฤษ<i data-l="en"></i></span><span>ใดๆ<i class="lit"></i></span></span>';
    var top = d.createElement('div'); top.className = 'kb-top'; top.setAttribute('aria-hidden', 'true');
    top.appendChild(mk('mod fk', 'Esc'));
    var sp = d.createElement('span'); sp.className = 'sp'; top.appendChild(sp);
    for (var f = 1; f <= 12; f++) {
      if (f === 5 || f === 9) { var s2 = d.createElement('span'); s2.className = 'sp2'; top.appendChild(s2); }
      top.appendChild(mk('fk' + (f >= 5 && f <= 8 ? ' fk2' : ''), 'F' + f));
    }
    rs.forEach(function(r){ r.style.paddingLeft = '0'; });
    rs[0].appendChild(mk('mod', '← Backspace', 146));
    rs[1].insertBefore(mk('mod', 'Tab ⇥', 82), rs[1].firstChild);
    rs[2].insertBefore(mk('mod', 'Caps Lock', 100), rs[2].firstChild); rs[2].appendChild(mk('mod', 'Enter ↵', 104));
    rs[3].insertBefore(mk('mod', '⇧ Shift', 128), rs[3].firstChild); rs[3].appendChild(mk('mod', '⇧ Shift', 140));
    var sr = d.createElement('div'); sr.className = 'kb-row kb-space'; sr.setAttribute('aria-hidden', 'true');
    sr.appendChild(mk('mod', 'Ctrl', 96)); sr.appendChild(mk('mod', 'Alt', 82)); sr.appendChild(mk('space', '', 534)); sr.appendChild(mk('mod', 'Alt', 82)); sr.appendChild(mk('mod', 'Ctrl', 96));
    var well = d.createElement('div'); well.className = 'kb-well';
    well.appendChild(top); rs.forEach(function(r){ well.appendChild(r); }); well.appendChild(sr);
    rows.appendChild(head); rows.appendChild(well);
    function led(){ var en = fig && fig.classList.contains('en-kb'); head.querySelector('[data-l="en"]').classList.toggle('lit', !!en); head.querySelector('[data-l="th"]').classList.toggle('lit', !en); }
    led(); if (fig && 'MutationObserver' in window) new MutationObserver(led).observe(fig, {attributes:true, attributeFilter:['class']});
  })();
})();
