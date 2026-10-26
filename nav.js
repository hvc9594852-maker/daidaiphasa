/* ใดๆภาษา.com — the nav pill gathers into the logo on scroll down and opens on scroll up */
(function(){
  var h = document.querySelector('header'); if (!h || !h.querySelector('.navlinks')) return;
  var last = scrollY, mini = false, ticking = false, quietUntil = 0;
  // keep the header's space fixed so the page never jumps when the pill shrinks
  function reserve(){ if (mini) return; h.style.minHeight = ''; h.style.minHeight = h.offsetHeight + 'px'; }
  function set(v){
    if (v === mini) return;
    mini = v; h.classList.toggle('nav-mini', v);
    quietUntil = Date.now() + 650;
  }
  function check(){
    ticking = false;
    var y = scrollY;
    if (Date.now() < quietUntil) { last = y; return; }
    var dy = y - last;
    if (y < 120) { set(false); last = y; return; }
    if (dy > 8) { set(true); last = y; }
    else if (dy < -8) { set(false); last = y; }
  }
  reserve(); addEventListener('load', reserve); addEventListener('resize', function(){ if (!mini) reserve(); });
  addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(check); } }, {passive:true});
  // tapping the small pill (outside the logo) opens the menu again
  h.addEventListener('click', function(e){ if (mini && !e.target.closest('.brand')) set(false); });
  h.addEventListener('focusin', function(){ set(false); });
})();
