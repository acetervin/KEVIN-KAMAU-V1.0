// ── UI CORE ───────────────────────────────────────────
var lang='en', theme='primary';

function setLang(l){
  lang=l;
  var t=T[l];
  document.querySelectorAll('[data-k]').forEach(function(el){var v=t[el.dataset.k];if(v!==undefined)el.textContent=v;});
  if(l==='ar'){document.body.classList.add('lang-ar');document.documentElement.setAttribute('lang','ar');document.documentElement.setAttribute('dir','rtl');}
  else{document.body.classList.remove('lang-ar');document.documentElement.setAttribute('lang','en');document.documentElement.setAttribute('dir','ltr');}
  document.getElementById('btn-en').classList.toggle('active',l==='en');
  document.getElementById('btn-ar').classList.toggle('active',l==='ar');
}

function toggleTheme(){
  theme=theme==='primary'?'secondary':'primary';
  document.body.classList.remove('t-primary','t-secondary');
  document.body.classList.add('t-'+theme);
}

// Scroll progress bar
window.addEventListener('scroll',function(){
  var pct=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
  document.getElementById('progress').style.width=pct+'%';
},{passive:true});

// Intersection observer for fade-in animations
var io2=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fi').forEach(function(el,i){el.style.transitionDelay=(i%5*0.08)+'s';io2.observe(el);});

// Custom cursor tracking
var cur=document.getElementById('cursor');
window.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';},{passive:true});
document.querySelectorAll('a,button,.s-card,.p-card,.theme-pill').forEach(function(el){
  el.addEventListener('mouseenter',function(){cur.style.transform='translate(-50%,-50%) scale(2.8)';cur.style.opacity='.55';});
  el.addEventListener('mouseleave',function(){cur.style.transform='translate(-50%,-50%) scale(1)';cur.style.opacity='1';});
});

/* ── POP BROWSER ─────────────────────────────────────── */
(function () {
  'use strict';

  var browser     = document.getElementById('pop-browser');
  var iframe      = document.getElementById('pb-iframe');
  var urlText     = document.getElementById('pb-url-text');
  var loadbar     = document.getElementById('pb-loadbar');
  var blocked     = document.getElementById('pb-blocked');
  var blockedOpen = document.getElementById('pb-blocked-open');
  var openExt     = document.getElementById('pb-open-ext');
  var titlebar    = document.getElementById('pb-titlebar');

  if (!browser) return;

  var currentURL = '';
  var navHistory = [];
  var histIdx    = -1;
  var isMax      = false;
  var isMin      = false;
  var prevRect   = null;
  var dragState  = null;

  window.openPopBrowser = function (url) {
    currentURL = url;

    var W  = window.innerWidth,  H  = window.innerHeight;
    var bw = Math.min(900, W * 0.82);
    var bh = Math.min(620, H * 0.80);

    browser.style.width  = bw + 'px';
    browser.style.height = bh + 'px';
    browser.style.left   = ((W - bw) / 2) + 'px';
    browser.style.top    = ((H - bh) / 2) + 'px';
    browser.style.zIndex = 8000;

    browser.classList.remove('minimised', 'maximised');
    browser.classList.add('open');
    isMax = false;
    isMin = false;

    navigate(url, true);
  };

  function normalizeUrl(u) {
    u = (u || '').trim();
    if (!u) return 'about:blank';
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(u)) u = 'https://' + u;
    return u;
  }

  function setURL(url) {
    var m = url.match(/^(https?:\/\/)([^/]+)(.*)/);
    if (m) {
      urlText.innerHTML =
        '<span class="pb-scheme">' + m[1] + '</span>' +
        '<span class="pb-domain">' + m[2] + '</span>' +
        '<span>' + (m[3] || '') + '</span>';
    } else {
      urlText.textContent = url;
    }
    openExt.href = url;
    blockedOpen.href = url;
  }

  function updateNavBtns() {
    document.getElementById('pb-back').style.opacity = histIdx > 0 ? '1' : '0.3';
    document.getElementById('pb-fwd').style.opacity  = histIdx < navHistory.length - 1 ? '1' : '0.3';
  }

  function finishLoad() {
    loadbar.style.transition = 'width .3s ease';
    loadbar.style.width = '100%';
    setTimeout(function () {
      loadbar.style.transition = 'none';
      loadbar.style.width = '0%';
    }, 400);
  }

  function showBlocked(url) {
    iframe.style.display = 'none';
    blocked.classList.add('show');
    blockedOpen.href = url;
    finishLoad();
  }

  function navigate(url, addToHistory) {
    currentURL = url;
    setURL(url);
    blocked.classList.remove('show');
    iframe.style.display = 'block';

    loadbar.style.transition = 'none';
    loadbar.style.width = '0%';
    requestAnimationFrame(function () {
      loadbar.style.transition = 'width 1.8s ease';
      loadbar.style.width = '85%';
    });

    iframe.src = url;

    if (addToHistory) {
      navHistory = navHistory.slice(0, histIdx + 1);
      navHistory.push(url);
      histIdx = navHistory.length - 1;
    }
    updateNavBtns();

    var timer = setTimeout(function () {
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || doc.URL === 'about:blank' || doc.readyState === 'uninitialized') {
          showBlocked(url);
        } else {
          finishLoad();
        }
      } catch (e) {
        showBlocked(url);
      }
    }, 3500);

    iframe.onload = function () {
      clearTimeout(timer);
      try {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || doc.URL === 'about:blank') { showBlocked(url); }
        else { finishLoad(); }
      } catch (e) {
        showBlocked(url);
      }
    };

    iframe.onerror = function () { clearTimeout(timer); showBlocked(url); };
  }

  document.getElementById('pb-close').onclick = function () {
    browser.classList.remove('open');
    iframe.src = 'about:blank';
  };

  document.getElementById('pb-minimise').onclick = function () {
    isMin = !isMin;
    browser.classList.toggle('minimised', isMin);
  };

  document.getElementById('pb-maximise').onclick = function () {
    if (isMax) {
      browser.classList.remove('maximised');
      if (prevRect) {
        browser.style.left   = prevRect.l + 'px';
        browser.style.top    = prevRect.t + 'px';
        browser.style.width  = prevRect.w + 'px';
        browser.style.height = prevRect.h + 'px';
      }
      isMax = false;
    } else {
      prevRect = {
        l: parseInt(browser.style.left)   || 0,
        t: parseInt(browser.style.top)    || 0,
        w: browser.offsetWidth,
        h: browser.offsetHeight,
      };
      browser.classList.add('maximised');
      isMax = true;
    }
  };

  document.getElementById('pb-back').onclick = function () {
    if (histIdx > 0) { histIdx--; navigate(navHistory[histIdx], false); }
  };
  document.getElementById('pb-fwd').onclick = function () {
    if (histIdx < navHistory.length - 1) { histIdx++; navigate(navHistory[histIdx], false); }
  };
  document.getElementById('pb-refresh').onclick = function () {
    blocked.classList.remove('show');
    iframe.style.display = 'block';
    navigate(currentURL, false);
  };

  titlebar.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('pb-btn') || isMax) return;
    e.preventDefault();
    var r = browser.getBoundingClientRect();
    dragState = { type: 'drag', sx: e.clientX, sy: e.clientY, ol: r.left, ot: r.top };
  });

  document.querySelectorAll('.pb-resize').forEach(function (h) {
    h.addEventListener('mousedown', function (e) {
      if (isMax) return;
      e.preventDefault(); e.stopPropagation();
      var r = browser.getBoundingClientRect();
      dragState = {
        type: 'resize', dir: h.dataset.dir,
        sx: e.clientX, sy: e.clientY,
        ol: r.left, ot: r.top, ow: r.width, oh: r.height,
      };
    });
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragState) return;
    var dx = e.clientX - dragState.sx;
    var dy = e.clientY - dragState.sy;

    if (dragState.type === 'drag') {
      browser.style.left = Math.max(0, dragState.ol + dx) + 'px';
      browser.style.top  = Math.max(0, dragState.ot + dy) + 'px';
      return;
    }

    var d = dragState.dir;
    var nL = dragState.ol, nT = dragState.ot;
    var nW = dragState.ow, nH = dragState.oh;
    var MW = 340, MH = 260;

    if (d === 'right'  || d === 'br' || d === 'tr') { nW = Math.max(MW, dragState.ow + dx); }
    if (d === 'left'   || d === 'bl' || d === 'tl') {
      var w2 = Math.max(MW, dragState.ow - dx);
      nL = dragState.ol + (dragState.ow - w2); nW = w2;
    }
    if (d === 'bottom' || d === 'br' || d === 'bl') { nH = Math.max(MH, dragState.oh + dy); }
    if (d === 'top'    || d === 'tr' || d === 'tl') {
      var h2 = Math.max(MH, dragState.oh - dy);
      nT = dragState.ot + (dragState.oh - h2); nH = h2;
    }

    browser.style.left   = nL + 'px';
    browser.style.top    = nT + 'px';
    browser.style.width  = nW + 'px';
    browser.style.height = nH + 'px';
  });

  document.addEventListener('mouseup', function () { dragState = null; });

  titlebar.addEventListener('touchstart', function (e) {
    if (isMax) return;
    var r = browser.getBoundingClientRect(), t = e.touches[0];
    dragState = { type: 'drag', sx: t.clientX, sy: t.clientY, ol: r.left, ot: r.top };
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!dragState || dragState.type !== 'drag') return;
    var t = e.touches[0];
    browser.style.left = Math.max(0, dragState.ol + t.clientX - dragState.sx) + 'px';
    browser.style.top  = Math.max(0, dragState.ot + t.clientY - dragState.sy) + 'px';
  }, { passive: true });

  document.addEventListener('touchend', function () { dragState = null; });

  browser.addEventListener('mousedown', function () {
    browser.style.zIndex = 8100;
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-browser="true"], a[target="_blank"]');
    if (!a) return;
    if (a.target === '_blank' && (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0)) return;
    if (!a.href) return;

    e.preventDefault();
    openPopBrowser(a.href);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && browser.classList.contains('open')) {
      browser.classList.remove('open');
      iframe.src = 'about:blank';
    }
  });

})();
