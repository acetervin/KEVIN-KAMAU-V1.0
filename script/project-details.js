// ── PROJECT DETAILS PAGE — DATA-DRIVEN ──────────────────────────────────────

var allProjects = [];
var currentPanel = 0;
var projectNavigationReady = false;
var projectSwipe = {
  tracking: false,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function statusHTML(p) {
  var cls = p.status === 'wip' ? 'wip' : 'done';
  var lbl = p.status === 'wip' ? 'In Progress' : p.status === 'live' ? 'Live' : 'Complete';
  return '<span class="pd-status ' + cls + '"><span class="pd-status-dot"></span>' + lbl + '</span>';
}

function stackHTML(stack) {
  return stack.map(function(s) {
    return '<div class="pd-stack-item">' +
      '<i class="' + s.icon + ' pd-stack-icon" aria-hidden="true"></i>' +
      '<span class="pd-stack-name">' + s.name + '</span>' +
      '<span class="pd-stack-role">' + s.role + '</span>' +
    '</div>';
  }).join('');
}

function tagsHTML(tags) {
  return tags.map(function(t) { return '<span class="pd-tag">' + t + '</span>'; }).join('');
}

function relatedHTML(p) {
  var cards = allProjects.filter(function(r) { return r.id !== p.id; }).map(function(r) {
    var name = (lang === 'ar' && r.titleAr) ? r.titleAr : r.title;
    return '<a href="#" class="pd-related-card" onclick="switchProjectById(' + r.id + ');return false;">' +
      '<div class="pd-related-icon"><i class="' + r.icon + '" aria-hidden="true"></i></div>' +
      '<div><div class="pd-related-name">' + name + '</div>' +
      '<div class="pd-related-tech">' + r.tags.slice(0, 3).join(' · ') + '</div></div>' +
    '</a>';
  }).join('');
  return '<div class="pd-related-list">' + cards + '</div>';
}

function ctaButtons(p) {
  var btns = '';
  if (p.github) btns += '<a href="' + p.github + '" class="btn-pri" target="_blank" data-browser="true">View on GitHub ↗</a>';
  if (p.live)   btns += '<a href="' + p.live   + '" class="btn-pri" target="_blank" data-browser="true">View Live Site ↗</a>';
  btns += '<a href="#overview-' + p.id + '" class="btn-sec">Read Case Study ↓</a>';
  return btns;
}

var currentGallery = [];
var currentImgIdx = 0;

function galleryHTML(gallery, projectIcon, projectIdx) {
  return gallery.map(function(g, imgIdx) {
    var imgContent = g.img
      ? '<img src="' + g.img + '" alt="' + g.caption + '" loading="lazy" />'
      : '<div class="pd-gallery-placeholder"><i class="' + (g.icon || projectIcon) + '" aria-hidden="true"></i><div>' + g.caption + '</div></div>';

    return '<div class="pd-gallery-item' + (g.wide ? ' wide' : '') + '" onclick="openLightbox(' + projectIdx + ', ' + imgIdx + ')">' +
      imgContent +
      '<span class="pd-gallery-label">' + g.label + '</span>' +
    '</div>';
  }).join('');
}

function renderPanel(p, projectIdx) {
  var yearLabel = p.status === 'wip' ? 'Since' : 'Year';
  var isAr = (lang === 'ar');
  var title   = (isAr && p.titleAr)   ? p.titleAr   : p.title;
  var eyebrow = (isAr && p.eyebrowAr) ? p.eyebrowAr : p.eyebrow;
  var overview = (isAr && p.overviewAr) ? p.overviewAr : p.overview;
  var features = (isAr && p.featuresAr) ? p.featuresAr : p.features;
  var challenge = (isAr && p.challengeAr) ? p.challengeAr : p.challenge;
  var learned   = (isAr && p.learnedAr)   ? p.learnedAr   : p.learned;
  var desc      = (isAr && p.descAr)      ? p.descAr      : p.desc;

  return '<div class="pd-panel" id="panel-' + p.id + '">' +
    '<div class="pd-hero">' +
      '<div class="pd-bg-num">' + p.num + '</div>' +
      '<p class="pd-eyebrow fi">' + eyebrow + '</p>' +
      '<h1 class="pd-title fi">' + title + '</h1>' +
      '<div class="pd-meta fi">' +
        ['<span class="pd-meta-item"><span class="pd-meta-dot"></span><span>' + p.type + '</span></span>',
         '<span class="pd-meta-item"><span class="pd-meta-dot"></span><span>' + p.year + '</span></span>',
         '<span class="pd-meta-item"><span class="pd-meta-dot"></span><span>' + p.role + '</span></span>'
        ].join('') +
      '</div>' +
      '<div class="pd-cta-row fi">' + ctaButtons(p) + '</div>' +
      '<div class="pd-tags-row fi">' + tagsHTML(p.tags) + '</div>' +
    '</div>' +
    '<div class="divider"></div>' +
    '<div class="pd-body" id="overview-' + p.id + '">' +
      '<div>' +
        '<p class="pd-section-title fi">// overview</p>' +
        '<div class="pd-overview fi">' + overview.map(function(para) { return '<p>' + para + '</p>'; }).join('') + '</div>' +
        '<p class="pd-section-title fi">// screenshots</p>' +
        '<div class="pd-gallery fi">' + galleryHTML(p.gallery, p.icon, projectIdx) + '</div>' +
        '<p class="pd-section-title fi">// core_features</p>' +
        '<ul class="pd-features fi">' + features.map(function(f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '<div class="pd-callout fi"><div class="pd-callout-label">// challenge</div><p>' + challenge + '</p></div>' +
        '<div class="pd-callout fi"><div class="pd-callout-label">// what_i_learned</div><p>' + learned + '</p></div>' +
      '</div>' +
      '<div class="pd-sidebar fi">' +
        '<div class="pd-info-card">' +
          '<span class="pd-info-label">// project_info</span>' +
          '<div class="pd-info-row"><span class="pd-info-key">Status</span>' + statusHTML(p) + '</div>' +
          '<div class="pd-info-row"><span class="pd-info-key">Type</span><span class="pd-info-val">' + p.type + '</span></div>' +
          '<div class="pd-info-row"><span class="pd-info-key">' + yearLabel + '</span><span class="pd-info-val accent">' + p.year + '</span></div>' +
          '<div class="pd-info-row"><span class="pd-info-key">Role</span><span class="pd-info-val">' + p.role + '</span></div>' +
          '<div class="pd-info-row"><span class="pd-info-key">Repo</span><span class="pd-info-val accent">' + (p.github ? 'Public ↗' : 'Private') + '</span></div>' +
        '</div>' +
        '<div class="pd-info-card">' +
          '<span class="pd-info-label">// tech_stack</span>' +
          '<div class="pd-stack">' + stackHTML(p.stack) + '</div>' +
        '</div>' +
        '<div class="pd-related"><div class="pd-related-title">' + (isAr ? 'مشاريع أخرى' : 'Other Projects') + '</div>' + relatedHTML(p) + '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderTabs() {
  var sel = document.querySelector('.pd-selector');
  if (!sel) return;
  sel.innerHTML = allProjects.map(function(p, i) {
    var title = (lang === 'ar' && p.titleAr) ? p.titleAr : p.title;
    return '<button class="pd-tab' + (i === currentPanel ? ' active' : '') + '" onclick="switchProject(' + i + ')">' +
      p.num + ' — ' + title +
    '</button>';
  }).join('');
}

function renderAllPanels() {
  document.querySelectorAll('.pd-panel').forEach(function(p) { p.remove(); });
  var sel = document.querySelector('.pd-selector');
  if (!sel || !sel.parentNode) return;
  var tmp = document.createElement('div');
  tmp.innerHTML = allProjects.map(function(p, i) { return renderPanel(p, i); }).join('');
  var frag = document.createDocumentFragment();
  while (tmp.firstChild) frag.appendChild(tmp.firstChild);
  sel.parentNode.insertBefore(frag, sel.nextSibling);
  document.querySelectorAll('.pd-panel').forEach(function(panel, i) {
    panel.classList.toggle('active', i === currentPanel);
  });
}

// ── SWITCHING ────────────────────────────────────────────────────────────────
function projectIndexById(projectId) {
  for (var i = 0; i < allProjects.length; i++) {
    if (allProjects[i].id === projectId) return i;
  }
  return -1;
}

function syncActiveTab(idx, behavior) {
  var activeTab = document.querySelectorAll('.pd-tab')[idx];
  if (!activeTab || typeof activeTab.scrollIntoView !== 'function') return;

  activeTab.scrollIntoView({
    block: 'nearest',
    inline: 'center',
    behavior: behavior || 'smooth'
  });
}

function syncProjectUrl(idx) {
  var project = allProjects[idx];
  if (!project || !window.history || typeof window.history.replaceState !== 'function') return;

  var url = new URL(window.location.href);
  url.searchParams.set('p', project.id);
  window.history.replaceState({}, '', url.toString());
}

function switchProjectById(projectId, options) {
  var idx = projectIndexById(projectId);
  if (idx === -1) return;
  switchProject(idx, options);
}

function switchProject(idx, options) {
  options = options || {};
  if (!allProjects.length) return;

  idx = Math.max(0, Math.min(allProjects.length - 1, idx));
  document.querySelectorAll('.pd-tab').forEach(function(t, i) { t.classList.toggle('active', i === idx); });
  document.querySelectorAll('.pd-panel').forEach(function(p, i) { p.classList.toggle('active', i === idx); });
  currentPanel = idx;

  syncActiveTab(idx, options.tabBehavior);
  if (projectNavigationReady && !options.skipUrl) syncProjectUrl(idx);

  window.scrollTo({ top: 0, behavior: options.scrollBehavior || 'smooth' });
  setTimeout(observePanel, 120);
}

function resetProjectSwipe() {
  projectSwipe.tracking = false;
  projectSwipe.startX = 0;
  projectSwipe.startY = 0;
  projectSwipe.deltaX = 0;
  projectSwipe.deltaY = 0;
}

function canSwipeProjectsFrom(target) {
  if (!target) return false;
  if (!target.closest('.pd-panel.active')) return false;
  if (target.closest('a, button, input, textarea, select, label')) return false;
  if (target.closest('.pd-gallery-item, .lightbox, .pd-selector, nav, #mobile-menu')) return false;
  return true;
}

function setupProjectSwipe() {
  if (setupProjectSwipe.bound) return;
  setupProjectSwipe.bound = true;

  document.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) {
      resetProjectSwipe();
      return;
    }

    var lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('open')) {
      resetProjectSwipe();
      return;
    }

    if (!canSwipeProjectsFrom(e.target)) {
      resetProjectSwipe();
      return;
    }

    var touch = e.touches[0];
    projectSwipe.tracking = true;
    projectSwipe.startX = touch.clientX;
    projectSwipe.startY = touch.clientY;
    projectSwipe.deltaX = 0;
    projectSwipe.deltaY = 0;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!projectSwipe.tracking || e.touches.length !== 1) return;

    var touch = e.touches[0];
    projectSwipe.deltaX = touch.clientX - projectSwipe.startX;
    projectSwipe.deltaY = touch.clientY - projectSwipe.startY;

    if (Math.abs(projectSwipe.deltaY) > 34 && Math.abs(projectSwipe.deltaY) > Math.abs(projectSwipe.deltaX)) {
      resetProjectSwipe();
    }
  }, { passive: true });

  document.addEventListener('touchend', function() {
    if (!projectSwipe.tracking) return;

    var absX = Math.abs(projectSwipe.deltaX);
    var absY = Math.abs(projectSwipe.deltaY);

    if (absX > 72 && absX > absY * 1.35) {
      if (projectSwipe.deltaX < 0 && currentPanel < allProjects.length - 1) {
        switchProject(currentPanel + 1, { scrollBehavior: 'auto', tabBehavior: 'smooth' });
      } else if (projectSwipe.deltaX > 0 && currentPanel > 0) {
        switchProject(currentPanel - 1, { scrollBehavior: 'auto', tabBehavior: 'smooth' });
      }
    }

    resetProjectSwipe();
  });

  document.addEventListener('touchcancel', resetProjectSwipe);
}

// ── FADE-IN OBSERVER ─────────────────────────────────────────────────────────
var pdIO = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('vis'); pdIO.unobserve(e.target); }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

function observePanel() {
  document.querySelectorAll('.pd-panel.active .fi:not(.vis)').forEach(function(el, i) {
    el.style.transitionDelay = (i * 0.06) + 's';
    pdIO.observe(el);
  });
}

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
function openLightbox(projectIdx, imgIdx) {
  var project = allProjects[projectIdx];
  if (!project || !project.gallery) return;

  currentGallery = project.gallery;
  currentImgIdx = imgIdx;

  updateLightboxContent();

  var lb = document.getElementById('lightbox');
  if (lb) { 
    lb.classList.add('open'); 
    lb.setAttribute('aria-hidden', 'false'); 
  }
  document.body.style.overflow = 'hidden';
}

function updateLightboxContent() {
  var item = currentGallery[currentImgIdx];
  if (!item) return;

  var li = document.getElementById('lightbox-img');

  if (li) {
    li.src = item.img || '';
    li.alt = item.caption || '';
  }
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  document.body.style.overflow = '';
}

// Event Listeners for Lightbox
var lb = document.getElementById('lightbox');
if (lb) {
  lb.addEventListener('click', function(e) { 
    if (e.target === this || e.target.classList.contains('lightbox-content')) closeLightbox(); 
  });
}

document.addEventListener('keydown', function(e) {
  var lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;

  if (e.key === 'Escape') closeLightbox();
});

// ── BOOT ─────────────────────────────────────────────────────────────────────
fetch('data/projects.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    allProjects = data;
    renderTabs();
    renderAllPanels();
    setupProjectSwipe();
    setLang('en');

    // Setup draggable tabs
    var sel = document.querySelector('.pd-selector');
    if (sel) {
      var isDown = false, startX = 0, scrollLeft = 0;

      sel.addEventListener('mousedown', function(e) {
        isDown = true;
        startX = e.pageX - sel.offsetLeft;
        scrollLeft = sel.scrollLeft;
        sel.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - sel.offsetLeft;
        var walk = (x - startX) * 1;
        sel.scrollLeft = scrollLeft - walk;
      });

      document.addEventListener('mouseup', function() {
        isDown = false;
        sel.style.cursor = 'grab';
      });

      sel.addEventListener('mouseleave', function() {
        isDown = false;
        sel.style.cursor = 'grab';
      });
    }

    // Deep-link to a specific project via ?p=N
    var params = new URLSearchParams(window.location.search);
    var p = parseInt(params.get('p') || '0');
    if (params.has('p') && !isNaN(p) && projectIndexById(p) !== -1) {
      switchProjectById(p, { scrollBehavior: 'auto', tabBehavior: 'auto' });
    } else {
      // Trigger fade-ins for the default first panel after a paint frame
      setTimeout(observePanel, 80);
    }

    setTimeout(function() {
      projectNavigationReady = true;
    }, 120);
  })
  .catch(function(err) {
    console.error('Failed to load projects.json:', err);
    // Show a visible error so it's easy to diagnose
    var sel = document.querySelector('.pd-selector');
    if (sel) sel.insertAdjacentHTML('afterend',
      '<div style="padding:4rem 3rem;font-family:monospace;color:#ff5f57;">' +
      '⚠ Could not load projects.json — make sure you are running the site via the server (python server.py), not opening the HTML file directly.' +
      '</div>'
    );
  });
