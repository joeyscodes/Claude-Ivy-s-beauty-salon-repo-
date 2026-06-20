// ===== Ivy's Beauty Secret — shared interactivity =====
document.addEventListener('DOMContentLoaded', () => {

  // Header solid-on-scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Hero sparkle particles
  const sparkField = document.querySelector('.hero-particles');
  if (sparkField) {
    const count = window.innerWidth < 700 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = (Math.random() * -20) + '%';
      s.style.animationDuration = (8 + Math.random() * 10) + 's';
      s.style.animationDelay = (Math.random() * 8) + 's';
      s.style.opacity = (0.25 + Math.random() * 0.5).toFixed(2);
      const size = (1.5 + Math.random() * 2.5).toFixed(1);
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      sparkField.appendChild(s);
    }
  }

  // Tilt effect on category / service cards
  const tiltCards = document.querySelectorAll('.cat-card, .testi-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Marquee auto-duplicate content for seamless loop
  document.querySelectorAll('.marquee').forEach(m => {
    m.innerHTML += m.innerHTML;
  });

  // Accordion (services page)
  document.querySelectorAll('.acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.parentElement;
      const wasOpen = panel.classList.contains('is-open');
      panel.parentElement.querySelectorAll('.acc-panel').forEach(p => p.classList.remove('is-open'));
      if (!wasOpen) panel.classList.add('is-open');
    });
  });

  // Footer year
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
});
