  function swap(t){
    var isThai=/[฀-๿]/.test(t);
    // same rule as KeySwap: mostly Thai letters -> English keys
    var th=0,en=0; Array.from(t).forEach(function(c){ if(/[฀-๿]/.test(c)) th++; else if(/[A-Za-z]/.test(c)) en++; });
    if(th>en) return Array.from(t).map(function(c){return rev[c]||c;}).join('');
    return Array.from(t).map(function(c){return fwd[c]||c;}).join('');
  }
  function braille(t){
    if(/[⠀-⣿]/.test(t)){
      var enOk=Array.from(t).every(function(c){ return !/[⠁-⣿]/.test(c)||BR_REV[c]||c==='⠼'; });
      if(!enOk || /⠠⠼/.test(t)) return TBR.back(t);
      var n2=false;
      return Array.from(t).map(function(c){ if(c==='⠼'){ n2=true; return ''; } if(n2){ for(var k in NUM){ if(NUM[k]===c) return k; } } n2=false; return BR_REV[c]||c; }).join('');
    }
    if(/[฀-๿]/.test(t)) return TBR.fwd(t);
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
