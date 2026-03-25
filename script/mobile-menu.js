// ── MOBILE MENU COMPONENT ─────────────────────────────
(function () {
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (!navToggle || !mobileMenu) return;

  function animateMenuLinks(open) {
    var links = mobileMenu.querySelectorAll('.mm-links li');
    links.forEach(function(li, i) {
      li.style.transition = 'none';
      li.style.opacity = open ? '0' : '1';
      li.style.transform = open ? 'translateY(18px)' : 'translateY(0)';
      if (open) {
        setTimeout(function() {
          li.style.transition = 'opacity 0.4s ease ' + (0.1 + i * 0.055) + 's, transform 0.4s ease ' + (0.1 + i * 0.055) + 's';
          li.style.opacity = '1';
          li.style.transform = 'translateY(0)';
        }, 10);
      }
    });
  }

  // Toggle menu on button click
  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    animateMenuLinks(isOpen);
  });

  // Close menu function exposed to window
  window.closeMobileMenu = function () {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  };
})();
