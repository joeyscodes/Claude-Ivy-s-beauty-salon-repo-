/* =================================================================
   IVY'S BEAUTY SECRET — SHARED SCRIPT
   Mobile nav · sticky header · sparkle/petal fields · GSAP reveals ·
   animated counters · floating action buttons
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
    }));
  }

  /* ---------- Sparkle field generator ----------
     Add data-sparkles="14" to any element with class "sparkle-field"
     to seed it with twinkling sparkle dots. */
  document.querySelectorAll('.sparkle-field[data-sparkles]').forEach(field => {
    const count = parseInt(field.getAttribute('data-sparkles'), 10) || 12;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      const size = 4 + Math.random() * 7;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      s.style.animationDuration = `${(3 + Math.random() * 3).toFixed(2)}s`;
      field.appendChild(s);
    }
  });

  /* ---------- Floating petal generator ----------
     Add data-petals="8" to any element with class "sparkle-field". */
  document.querySelectorAll('.sparkle-field[data-petals]').forEach(field => {
    const count = parseInt(field.getAttribute('data-petals'), 10) || 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${-10 - Math.random() * 20}%`;
      p.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);
      p.style.animationDelay = `${(Math.random() * 12).toFixed(2)}s`;
      p.style.animationDuration = `${(10 + Math.random() * 8).toFixed(2)}s`;
      field.appendChild(p);
    }
  });

  /* ---------- GSAP scroll reveals + hero entrance ---------- */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-copy .eyebrow', { opacity: 0, y: 20, duration: .7 })
      .from('.hero-copy h1', { opacity: 0, y: 30, duration: .9 }, '-=.4')
      .from('.hero-copy p', { opacity: 0, y: 20, duration: .8 }, '-=.5')
      .from('.hero-ctas .btn', { opacity: 0, y: 20, duration: .7, stagger: .12 }, '-=.4')
      .from('.hero-badges .hero-badge', { opacity: 0, y: 16, duration: .6, stagger: .1 }, '-=.3')
      .from('.hero-frame', { opacity: 0, scale: .92, duration: 1.1 }, '-=1')
      .from('.hero-glass-card', { opacity: 0, y: 30, duration: .8 }, '-=.4');
  } else {
    /* Fallback: plain Intersection Observer reveal if GSAP fails to load */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat .num[data-target]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- Subtle 3D tilt on hero image (desktop only) ---------- */
  const frame = document.querySelector('.hero-frame');
  if (frame && window.matchMedia('(min-width: 980px)').matches) {
    const wrap = frame.closest('.hero-visual');
    wrap && wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `perspective(1200px) rotateY(${px * -10}deg) rotateX(${py * 8}deg)`;
    });
    wrap && wrap.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1200px) rotateY(-4deg) rotateX(2deg)';
    });
  }

  /* ---------- Simple testimonial / gallery carousel helper ----------
     Works on any container with class "carousel" containing
     ".carousel-track" + buttons [data-carousel-prev] / [data-carousel-next] */
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track) return;
    const scrollAmount = () => track.clientWidth * 0.85;
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  });

  /* ---------- Lightbox for gallery grid ----------
     Any element with class "g-item" wrapping an <img> opens a full-screen
     preview on click. Builds the overlay once and reuses it. */
  const galleryItems = document.querySelectorAll('.g-item img');
  if (galleryItems.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<span class="lightbox-close"><i class="fa-solid fa-xmark"></i></span><img alt="">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    const openLightbox = (src, alt) => {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('active');
    };
    const closeLightbox = () => overlay.classList.remove('active');

    galleryItems.forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------- Before / after drag slider (used on Gallery page) ---------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const overlay = slider.querySelector('.ba-overlay');
    if (!handle || !overlay) return;
    let dragging = false;

    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      overlay.style.width = `${pct}%`;
      handle.style.left = `${pct}%`;
    };

    handle.addEventListener('pointerdown', () => { dragging = true; });
    window.addEventListener('pointerup', () => { dragging = false; });
    window.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    slider.addEventListener('click', (e) => setPos(e.clientX));
  });

  /* ---------- WhatsApp quick-message helper (Contact / booking page) ----------
     Any form with [data-whatsapp-form] builds a wa.me link from its fields
     and opens WhatsApp directly — no backend needed. */
  const WHATSAPP_NUMBER = '971509921215'; // no plus sign, no spaces
  document.querySelectorAll('[data-whatsapp-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const service = data.get('service') || '';
      const date = data.get('date') || '';
      const message = data.get('message') || '';
      const text =
        `Hi Ivy's Beauty Secret! I'd like to book an appointment.%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Service: ${encodeURIComponent(service)}%0A` +
        `Preferred date: ${encodeURIComponent(date)}%0A` +
        `Note: ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    });
  });

});
