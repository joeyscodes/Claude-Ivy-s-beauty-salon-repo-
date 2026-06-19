/* ============================================================
   IVY'S BEAUTY SECRET — SHARED SCRIPT
   Loaded on every page (after logo-data.js).
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Inject the logo everywhere ----------
     Keeps the 1 logo file in one place (logo-data.js) instead
     of pasting a giant base64 string into every page. */
  if (typeof LOGO_DATA_URI !== 'undefined') {
    document.querySelectorAll('.brand-logo').forEach(function (img) {
      img.src = LOGO_DATA_URI;
    });
    var favicon = document.getElementById('favicon');
    if (favicon) favicon.href = LOGO_DATA_URI;
  }

  /* ---------- 2. Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- 3. Mobile menu ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- 4. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 5. Floating petals (decorative, randomised) ---------- */
  document.querySelectorAll('.petal-field').forEach(function (field) {
    var count = parseInt(field.dataset.count || '10', 10);
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      var kinds = ['', 'alt', 'gold'];
      p.className = 'petal ' + kinds[Math.floor(Math.random() * kinds.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (10 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      var scale = 0.6 + Math.random() * 1.1;
      p.style.transform = 'scale(' + scale + ')';
      field.appendChild(p);
    }
  });

  /* ---------- 6. Sparkle canvas ---------- */
  var canvas = document.getElementById('sparkle-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var sparkles = [];
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    var colors = ['255,79,154', '126,200,255', '217,168,87', '245,240,255'];
    function makeSparkle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        speed: Math.random() * 0.25 + 0.05,
        alpha: Math.random(),
        delta: (Math.random() * 0.02) + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }
    var count = window.innerWidth < 700 ? 26 : 50;
    for (var i = 0; i < count; i++) sparkles.push(makeSparkle());

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach(function (s) {
        s.alpha += s.delta;
        if (s.alpha > 1 || s.alpha < 0) { s.delta *= -1; }
        s.y -= s.speed;
        if (s.y < -10) { s.y = canvas.height + 10; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.color + ',' + Math.max(0, Math.min(1, s.alpha)) + ')';
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    if (!prefersReducedMotion) requestAnimationFrame(tick);
  }

  /* ---------- 7. Active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

});

/* ---------- WhatsApp helper ----------
   Centralised so the number only has to live in one place.
   Used by the floating button and any "Book on WhatsApp" CTAs. */
var SALON_WHATSAPP_NUMBER = '971509921215'; // no + or spaces
function waLink(message) {
  return 'https://wa.me/' + SALON_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}
