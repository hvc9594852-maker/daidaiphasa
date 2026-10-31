/* ใดๆภาษา.com — anonymous usage counter (no cookies, no personal data). Counts page views and which tools get used. */
(function(){
  if(!/^https?:$/.test(location.protocol) || /^(localhost|127\.)/.test(location.hostname)) { window.dHit=function(){}; return; }
  function send(keys){
    try{
      var body=JSON.stringify({k:keys});
      if(navigator.sendBeacon && navigator.sendBeacon('/api/hit', new Blob([body],{type:'application/json'}))) return;
      fetch('/api/hit',{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true}).catch(function(){});
    }catch(e){}
  }
  var seen={};
  window.dHit=function(k){ if(seen[k]) return; seen[k]=1; send([k]); };
  var p=(location.pathname.replace(/\.html$/,'').replace(/\/+$/,'')||'/').toLowerCase().slice(0,60);
  send(['page:'+p]);
})();
