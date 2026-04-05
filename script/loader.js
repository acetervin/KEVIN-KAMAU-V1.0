// ── TERMINAL LOADER ───────────────────────────────────
(function(){
  var bar      = document.getElementById('tpbar');
  var cur2     = document.getElementById('tlcur');
  var loader   = document.getElementById('loader');
  var dismissed = false;
  var timers    = [];

  // Only show loader on first visit per browser session
  if(sessionStorage.getItem('kk_visited')){
    // Already visited this session — keep loader hidden, go straight to Three.js
    loadThree();
    return;
  }
  // First visit — reveal the loader and mark session
  sessionStorage.setItem('kk_visited', '1');
  if(loader) loader.style.display = 'flex';
  if(loader) loader.style.display = 'flex';

  function t(fn, ms){ timers.push(setTimeout(fn, ms)); }

  function dismiss(){
    if(dismissed) return;
    dismissed = true;
    timers.forEach(clearTimeout);
    if(cur2) cur2.style.display = 'none';
    if(loader) loader.classList.add('done');
    loadThree();
  }

  function line(id, content){
    var el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = content;
    // move blinking cursor to sit after this line
    var next = el.nextElementSibling;
    if(next && next !== cur2 && cur2 && cur2.parentNode)
      cur2.parentNode.insertBefore(cur2, next);
  }

  function pb(p){ if(bar) bar.style.width = p + '%'; }

  // ── Safely read browser APIs (wrapped so nothing can throw) ──
  var speedMbps = null;
  var pingMs    = null;
  var effType   = null;
  var ttfb      = null;
  var domReady  = null;
  var loadTimeMs= null;
  var dnsMs     = null;
  var tcpMs     = null;

  try {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if(conn){
      if(conn.downlink)      speedMbps = parseFloat(conn.downlink);
      if(conn.rtt)           pingMs    = Math.round(conn.rtt);
      if(conn.effectiveType) effType   = conn.effectiveType;
    }
  } catch(e){}

  try {
    var entries = performance.getEntriesByType('navigation');
    if(entries && entries.length > 0){
      var nav = entries[0];
      var t0  = nav.startTime || 0;
      if(nav.responseStart  > 0) ttfb       = Math.round(nav.responseStart  - t0);
      if(nav.domContentLoadedEventEnd > 0) domReady = Math.round(nav.domContentLoadedEventEnd - t0);
      if(nav.loadEventEnd   > 0) loadTimeMs = Math.round(nav.loadEventEnd   - t0);
      if(nav.domainLookupEnd > 0 && nav.domainLookupStart >= 0) dnsMs = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
      if(nav.connectEnd > 0 && nav.connectStart >= 0) tcpMs = Math.round(nav.connectEnd - nav.connectStart);
    }
  } catch(e){}

  // Fallback ping estimate
  if(!pingMs && ttfb) pingMs = ttfb;

  // Page weight
  var PAGE_KB    = 760;
  var PAGE_BYTES = PAGE_KB * 1024;

  // Estimated load time
  var estLoadStr = '--';
  if(speedMbps && speedMbps > 0){
    var sec = PAGE_BYTES / (speedMbps * 125000);
    estLoadStr = sec < 1 ? Math.round(sec * 1000) + 'ms' : sec.toFixed(2) + 's';
  } else if(loadTimeMs){
    estLoadStr = loadTimeMs + 'ms';
  }

  // Quality
  var qLabel = 'UNKNOWN', qColor = '#6e685e';
  if(speedMbps){
    if     (speedMbps >= 50){ qLabel='EXCELLENT'; qColor='#28c840'; }
    else if(speedMbps >= 20){ qLabel='FAST';      qColor='#28c840'; }
    else if(speedMbps >= 10){ qLabel='GOOD';      qColor='#64b5f6'; }
    else if(speedMbps >=  5){ qLabel='MODERATE';  qColor='#febc2e'; }
    else                    { qLabel='SLOW';       qColor='#ff5f57'; }
  }

  // ── BOOT SEQUENCE ────────────────────────────────────────────
  line('tl0', '<span class="tl-prompt">~ $</span> <span class="tl-cmd">./kevin_kamau.sh --boot --diagnostics</span>');
  pb(5);

  t(function(){ line('tl1', '<span class="tl-dim">Initialising dev environment...</span>'); pb(12); }, 700);

  t(function(){ line('tl2', '<span class="tl-info">&#9654; Loading profile</span><span class="tl-dim"> [kevin_kamau@nairobi &middot; KE]</span>'); pb(22); }, 1500);

  t(function(){ line('tl3', '<span class="tl-ok">&#10003; Credentials verified</span><span class="tl-dim"> &mdash; @acetervin &middot; 12 repos</span>'); pb(33); }, 2300);

  t(function(){ line('tl4', '<span class="tl-info">&#9654; Mounting stack</span><span class="tl-dim"> [html &middot; js &middot; tailwind &middot; node &middot; python]</span>'); pb(44); }, 3100);

  // ── NETWORK DIAGNOSTICS ──────────────────────────────────────
  t(function(){
    line('tl5', '<span class="tl-accent">&#9712; Running network diagnostics</span><span class="tl-dim"> (browser APIs)...</span>');
    pb(52);

    // Show gauge widget
    var gauge = document.getElementById('net-gauge');
    if(gauge) gauge.style.display = 'block';

    // Populate gauge
    var ngMbps    = document.getElementById('ng-mbps');
    var ngBar     = document.getElementById('ng-bar');
    var ngQuality = document.getElementById('ng-quality');
    var ngPing    = document.getElementById('ng-ping');
    var ngLoad    = document.getElementById('ng-load');
    var ngType    = document.getElementById('ng-type');

    if(ngMbps)    { ngMbps.textContent = speedMbps ? speedMbps + ' Mbps' : '-- Mbps'; ngMbps.style.color = qColor; }
    if(ngQuality) { ngQuality.textContent = qLabel; ngQuality.style.color = qColor; }
    if(ngLoad)    { ngLoad.textContent = estLoadStr; }
    if(ngType)    { ngType.textContent = effType ? effType.toUpperCase() : 'BROWSER_CORE'; }
    if(ngPing)    {
      if(pingMs){ ngPing.textContent = pingMs + 'ms'; ngPing.style.color = pingMs < 80 ? '#28c840' : pingMs < 200 ? '#febc2e' : '#ff5f57'; }
      else { ngPing.textContent = '--'; }
    }
    if(ngBar){
      var pct = speedMbps ? Math.min(100, Math.max(2, (speedMbps / 100) * 100)) : 3;
      setTimeout(function(){ 
        ngBar.style.width = pct + '%'; 
        ngBar.style.background = qColor;
      }, 100);
    }
  }, 3900);

  t(function(){
    // Speed line
    if(speedMbps){
      line('tl5',
        '<span class="tl-ok">&#10003; Download speed</span>' +
        '<span class="tl-dim"> (Network Info API) &rarr; </span>' +
        '<span style="color:' + qColor + ';font-weight:700;">' + speedMbps + ' Mbps</span>' +
        '<span class="tl-dim"> &bull; ' + Math.round(speedMbps * 1000) + ' Kbps &bull; ' + qLabel + '</span>'
      );
    } else {
      line('tl5', '<span class="tl-dim">&#9888; Speed API unavailable &mdash; using timing data only</span>');
    }
    pb(60);
  }, 4600);

  t(function(){
    // Timing breakdown
    var parts = [];
    if(dnsMs     !== null) parts.push('DNS:&nbsp;'     + dnsMs     + 'ms');
    if(tcpMs     !== null) parts.push('TCP:&nbsp;'     + tcpMs     + 'ms');
    if(ttfb      !== null) parts.push('TTFB:&nbsp;'    + ttfb      + 'ms');
    if(domReady  !== null) parts.push('DOM:&nbsp;'     + domReady  + 'ms');
    if(loadTimeMs!== null) parts.push('Load:&nbsp;'    + loadTimeMs + 'ms');

    if(parts.length > 0){
      line('tl6',
        '<span class="tl-ok">&#10003; Timing breakdown</span>' +
        '<span class="tl-dim"> &mdash; ' + parts.join(' &middot; ') + '</span>'
      );
    } else {
      line('tl6', '<span class="tl-dim">&#9888; Timing data not available in this environment</span>');
    }
    pb(70);
  }, 5400);

  t(function(){
    line('tl7',
      '<span class="tl-ok">&#10003; Page weight</span>' +
      '<span class="tl-dim"> HTML:53KB &middot; Fonts:130KB &middot; Three.js:577KB &rarr; </span>' +
      '<span class="tl-accent">~' + PAGE_KB + 'KB total</span>'
    );
    pb(82);
  }, 6200);

  t(function(){
    var pingStr = pingMs ? ' &middot; ping <span style="color:#64b5f6;">' + pingMs + 'ms</span>' : '';
    line('tl8',
      '<span class="tl-ok">&#10003; Est. load @ </span>' +
      (speedMbps
        ? '<span class="tl-accent">' + speedMbps + ' Mbps</span>'
        : '<span class="tl-dim">measured timing</span>') +
      '<span class="tl-dim"> &rarr; </span>' +
      '<span class="tl-accent" style="font-size:.95rem;">' + estLoadStr + '</span>' +
      pingStr
    );
    pb(92);
  }, 7000);

  t(function(){
    line('tl9', '<span class="tl-accent">&#11209; All systems go &mdash; launching portfolio...</span>');
    pb(100);
    t(dismiss, 1000);
  }, 7900);

  // Safety cap 20s + click anywhere to skip
  t(dismiss, 20000);
  if(loader) loader.addEventListener('click', function(){ dismiss(); });
})();
