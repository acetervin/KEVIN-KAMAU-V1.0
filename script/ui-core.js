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
