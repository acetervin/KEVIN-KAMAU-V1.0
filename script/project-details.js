// ── PROJECT DETAILS PAGE SCRIPT ─────────────────────────────────────────────

// Switch between project tabs, run fade-in animations, and handle the lightbox.
var tabs   = document.querySelectorAll('.pd-tab');
var panels = document.querySelectorAll('.pd-panel');
var currentPanel = 0;

function switchProject(idx) {
  tabs.forEach(function(t, i){ t.classList.toggle('active', i === idx); });
  panels.forEach(function(p, i){ p.classList.toggle('active', i === idx); });
  currentPanel = idx;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(observePanel, 100);
}

// Fade-in observer (re-used for this page)
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observePanel() {
  document.querySelectorAll('.pd-panel.active .fi:not(.vis)').forEach(function(el, i){
    el.style.transitionDelay = (i * 0.07) + 's';
    io.observe(el);
  });
}
observePanel();

// Lightbox
function openLightbox(title) {
  var lb = document.getElementById('lightbox');
  document.getElementById('lightbox-title').textContent = title;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  var lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
document.getElementById('lightbox').addEventListener('click', function(e){ if (e.target === this) closeLightbox(); });
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });

// Set default language on page load (falls back to English)
setLang('en');

// Deep-link to a specific project tab via ?p=0, ?p=1, etc.
(function(){
  var params = new URLSearchParams(window.location.search);
  var p = parseInt(params.get('p') || '0');
  if (p > 0 && p < panels.length) switchProject(p);
})();
