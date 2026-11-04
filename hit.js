/* ใดๆภาษา.com — anonymous usage counter (no cookies, no personal data).
   Counts page views, tools used, where visitors came from (referring site) and whether they have been here before
   (a first-visit date kept only in this browser's localStorage). */
(function(){
  if(!/^https?:$/.test(location.protocol) || /^(localhost|127\.)/.test(location.hostname)) { window.dHit=function(){}; return; }
  function send(body){
    try{
      var s=JSON.stringify(body);
      if(navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([s],{type:'application/json'}))) return;
      fetch('/api/hit',{method:'POST',headers:{'Content-Type':'application/json'},body:s,keepalive:true}).catch(function(){});
    }catch(e){}
  }
  var seen={};
  window.dHit=function(k){ if(seen[k]) return; seen[k]=1; send({k:[k]}); };
  var p=(location.pathname.replace(/\.html$/,'').replace(/\/+$/,'')||'/').toLowerCase().slice(0,60);
  var ref='', utm='', ret=0, today=new Date().toISOString().slice(0,10);
  try{ var r=document.referrer?new URL(document.referrer):null; if(r && r.hostname!==location.hostname) ref=r.hostname.toLowerCase(); }catch(e){}
  try{ utm=(new URLSearchParams(location.search).get('utm_source')||'').toLowerCase().slice(0,30); }catch(e){}
  try{ var f=localStorage.getItem('dd-first'); if(!f){ localStorage.setItem('dd-first', today); } else if(f<today){ ret=1; } }catch(e){}
  send({k:['page:'+p], ref:ref, utm:utm, ret:ret});
})();
