/* ═══════════════════════════════════════════════════════════
   IVY'S BEAUTY SECRET — PRODUCTION SCRIPT
   Single source of truth: see project specification.
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── BOOKING CONFIGURATION ─────────────────────────────────
     Change ONLY this object to switch booking method.
     Visual design remains identical in every mode.
  ──────────────────────────────────────────────────────────── */
  const BOOKING = {
    mode: 'whatsapp',                 // 'whatsapp' | 'form' | 'both'
    whatsapp: '971509921215',
    formspreeId: 'YOUR_FORM_ID',      // replace when Formspree account is ready
    message: "Hello Ivy's Beauty Secret. I would like to arrange an appointment. Please let me know your availability."
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── INIT ON DOM READY ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initBookingMode();
    initNav();
    initMobileNav();
    initScrollAnimations();
    if (!prefersReducedMotion) {
      initParticles();
    }
    initBeforeAfterSlider();
    initMiniSliders();
    initTestimonialCarousel();
    initMobileBookingBar();
    initFAQAccordion();
  });

  /* ═══════════════════════════════════════════════════════════
     BOOKING MODE — applies config to DOM
     Note: the Contact page (.dual-booking) is the dedicated
     "both options" destination and always shows both panels,
     independent of BOOKING.mode (which governs the homepage's
     single booking module only).
  ═══════════════════════════════════════════════════════════ */
  function initBookingMode() {
    const whatsappPanel = document.getElementById('bookingWhatsapp');
    const formPanel = document.getElementById('bookingForm');
    if (!whatsappPanel || !formPanel) return;

    const isDualBookingPage = !!document.querySelector('.dual-booking');

    // Build encoded WhatsApp link from config (keeps links in sync with BOOKING.message)
    const encodedMessage = encodeURIComponent(BOOKING.message);
    const waLink = `https://wa.me/${BOOKING.whatsapp}?text=${encodedMessage}`;

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
      link.setAttribute('href', waLink);
    });

    // Set Formspree form action from config
    if (BOOKING.formspreeId && BOOKING.formspreeId !== 'YOUR_FORM_ID') {
      formPanel.setAttribute('action', `https://formspree.io/f/${BOOKING.formspreeId}`);
    }

    if (isDualBookingPage) {
      // Contact page: always show both, never hidden by BOOKING.mode
      whatsappPanel.style.display = '';
      formPanel.style.display = '';
    } else if (BOOKING.mode === 'whatsapp') {
      whatsappPanel.style.display = '';
      formPanel.style.display = 'none';
    } else if (BOOKING.mode === 'form') {
      whatsappPanel.style.display = 'none';
      formPanel.style.display = '';
    } else if (BOOKING.mode === 'both') {
      whatsappPanel.style.display = '';
      formPanel.style.display = '';
      const module = document.getElementById('bookingModule');
      if (module) {
        module.style.display = 'flex';
        module.style.gap = '24px';
        module.style.maxWidth = '680px';
        module.style.width = '680px';
      }
    }

    // Handle Formspree submission feedback (only relevant when form mode active)
    formPanel.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = formPanel.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending your request...';
      submitBtn.disabled = true;

      fetch(formPanel.action, {
        method: 'POST',
        body: new FormData(formPanel),
        headers: { Accept: 'application/json' }
      })
        .then((response) => {
          if (response.ok) {
            showFormFeedback(formPanel, 'Thank you. We will be in touch with you shortly.', false);
            formPanel.reset();
          } else {
            showFormFeedback(formPanel, 'Please complete this field before we continue.', true);
          }
        })
        .catch(() => {
          showFormFeedback(formPanel, 'Please complete this field before we continue.', true);
        })
        .finally(() => {
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        });
    });
  }

  function showFormFeedback(form, message, isError) {
    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'form-feedback';
      feedback.style.fontFamily = 'var(--font-body)';
      feedback.style.fontSize = '13px';
      feedback.style.marginTop = '12px';
      feedback.style.textAlign = 'center';
      form.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.color = isError ? '#ffd6d6' : '#ffffff';
  }

  /* ═══════════════════════════════════════════════════════════
     NAVIGATION — scroll shadow state
  ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 12) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ═══════════════════════════════════════════════════════════
     MOBILE NAV OVERLAY
  ═══════════════════════════════════════════════════════════ */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const closeBtn = document.getElementById('navClose');
    const overlay = document.getElementById('mobileNav');
    if (!toggle || !overlay) return;

    function openNav() {
      overlay.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      overlay.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    overlay.querySelectorAll('.mobile-nav__link').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     SCROLL-TRIGGERED SECTION ANIMATIONS (A8)
     One fade-up per section element — fires once only.
  ═══════════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     PARTICLE SYSTEMS
     Hero (18) · Hair (16) · Bridal (16 gold stars) · Booking (32)
  ═══════════════════════════════════════════════════════════ */
  function initParticles() {
    buildParticles('heroParticles', {
      count: 18,
      colors: [
        { color: '255,79,154', weight: 12 },
        { color: '126,200,255', weight: 6 }
      ],
      sizes: [6, 14, 24],
      sizeWeights: [11, 5, 2],
      minOpacity: 0.15,
      maxOpacity: 0.5,
      minDuration: 14,
      maxDuration: 24,
      shape: 'circle'
    });

    buildParticles('hairParticles', {
      count: 16,
      colors: [{ color: '255,79,154', weight: 16 }],
      sizes: [6, 20],
      sizeWeights: [10, 6],
      minOpacity: 0.30,
      maxOpacity: 0.60,
      minDuration: 14,
      maxDuration: 22,
      shape: 'circle'
    });

    buildParticles('bridalParticles', {
      count: 16,
      colors: [{ color: '212,160,79', weight: 16 }],
      sizes: [16, 32],
      sizeWeights: [10, 6],
      minOpacity: 0.20,
      maxOpacity: 0.45,
      minDuration: 22,
      maxDuration: 38,
      shape: 'star',
      blur: 1.5
    });

    buildParticles('bookingParticles', {
      count: 32,
      colors: [
        { color: '255,255,255', weight: 22 },
        { color: '212,160,79', weight: 10 }
      ],
      sizes: [4, 12, 28],
      sizeWeights: [18, 10, 4],
      minOpacity: 0.20,
      maxOpacity: 0.50,
      minDuration: 12,
      maxDuration: 20,
      shape: 'circle'
    });
  }

  function buildParticles(containerId, opts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Reduce particle count on small viewports for performance
    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? Math.round(opts.count * 0.55) : opts.count;

    const colorPool = [];
    opts.colors.forEach((c) => {
      for (let i = 0; i < c.weight; i++) colorPool.push(c.color);
    });

    const sizePool = [];
    opts.sizes.forEach((s, idx) => {
      const weight = opts.sizeWeights ? opts.sizeWeights[idx] : 1;
      for (let i = 0; i < weight; i++) sizePool.push(s);
    });

    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'particle';

      const size = sizePool[Math.floor(Math.random() * sizePool.length)];
      const color = colorPool[Math.floor(Math.random() * colorPool.length)];
      const opacity = (Math.random() * (opts.maxOpacity - opts.minOpacity) + opts.minOpacity).toFixed(2);
      const duration = (Math.random() * (opts.maxDuration - opts.minDuration) + opts.minDuration).toFixed(1);
      const delay = (Math.random() * -duration).toFixed(1);
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const drift = 18 + Math.random() * 14; // vw/vh drift distance

      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = startX + '%';
      el.style.top = startY + '%';
      el.style.background = opts.shape === 'star' ? 'transparent' : `rgba(${color},${opacity})`;
      el.style.opacity = opacity;
      el.style.animation = `particleDrift ${duration}s linear ${delay}s infinite`;
      el.style.setProperty('--drift-x', `${drift}vw`);
      el.style.setProperty('--drift-y', `-${drift}vh`);

      if (opts.blur) el.style.filter = `blur(${opts.blur}px)`;

      if (opts.shape === 'star') {
        el.style.background = `rgba(${color},${opacity})`;
        el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      } else {
        el.style.borderRadius = '50%';
      }

      frag.appendChild(el);
    }

    container.appendChild(frag);
  }

  /* Particle drift keyframes injected once via JS (kept out of static CSS
     since the drift distance is randomized per-particle via custom props) */
  (function injectParticleKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleDrift {
        0%   { transform: translate(0, 0); }
        100% { transform: translate(var(--drift-x, 20vw), var(--drift-y, -20vh)); }
      }
    `;
    document.head.appendChild(style);
  })();

  /* ═══════════════════════════════════════════════════════════
     BEFORE / AFTER SLIDER (Hair Transformations)
  ═══════════════════════════════════════════════════════════ */
  function initBeforeAfterSlider() {
    const slider = document.getElementById('mainSlider');
    const after = document.getElementById('sliderAfter');
    const divider = document.getElementById('sliderDivider');
    const handle = document.getElementById('sliderHandle');
    const thumbs = document.querySelectorAll('.slider__thumb');
    if (!slider || !after || !divider) return;

    // Transformation pairs — before/after image URLs per thumbnail
    const pairs = [
      {
        before: 'https://images.unsplash.com/photo-1590577976322-3d2d6a2130f4?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
        afterAlt: 'After hair treatment — stunning balayage transformation'
      },
      {
        before: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=900&q=80',
        afterAlt: 'After keratin treatment — smooth, sleek hair'
      },
      {
        before: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&q=80',
        afterAlt: 'After colour treatment — multi-dimensional hair colour'
      }
    ];

    let isDragging = false;

    function setPosition(percent) {
      const clamped = Math.max(6, Math.min(94, percent));
      after.style.clipPath = `inset(0 0 0 ${clamped}%)`;
      divider.style.left = clamped + '%';
    }

    function getPercentFromEvent(clientX) {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    function startDrag(clientX, startClientX) {
      isDragging = true;
      slider.classList.add('is-dragging');
    }
    function endDrag() {
      isDragging = false;
      slider.classList.remove('is-dragging');
    }

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDrag();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(getPercentFromEvent(e.clientX));
    });
    window.addEventListener('mouseup', endDrag);

    // Touch events — vertical scroll takes priority (touch-action: pan-y in CSS),
    // horizontal drag only registers past a small threshold.
    let touchStartX = null;
    let touchStartY = null;
    let touchDragConfirmed = false;

    handle.addEventListener(
      'touchstart',
      (e) => {
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchDragConfirmed = true; // handle itself is a clear drag intent
        startDrag();
      },
      { passive: true }
    );

    slider.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        const t = e.touches[0];
        if (!touchDragConfirmed) {
          const dx = Math.abs(t.clientX - touchStartX);
          const dy = Math.abs(t.clientY - touchStartY);
          if (dx > 20 && dx > dy) {
            touchDragConfirmed = true;
          } else if (dy > dx) {
            endDrag();
            return;
          }
        }
        if (touchDragConfirmed) {
          e.preventDefault();
          setPosition(getPercentFromEvent(t.clientX));
        }
      },
      { passive: false }
    );

    slider.addEventListener('touchend', endDrag);

    // Click anywhere on slider to jump position
    slider.addEventListener('click', (e) => {
      if (e.target.closest('.slider__handle')) return;
      setPosition(getPercentFromEvent(e.clientX));
    });

    // Thumbnail selection — swaps active transformation pair
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => {
          t.classList.remove('slider__thumb--active');
          t.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('slider__thumb--active');
        thumb.setAttribute('aria-pressed', 'true');

        const pair = pairs[index];
        if (!pair) return;

        const beforeImg = slider.querySelector('.slider__img--before');
        const afterImg = slider.querySelector('.slider__img--after');

        // Crossfade
        [beforeImg, afterImg].forEach((img) => (img.style.transition = 'opacity 0.4s ease'));
        beforeImg.style.opacity = '0';
        afterImg.style.opacity = '0';

        setTimeout(() => {
          beforeImg.src = pair.before;
          afterImg.src = pair.after;
          afterImg.alt = pair.afterAlt;
          beforeImg.style.opacity = '1';
          afterImg.style.opacity = '1';
        }, 200);

        // Reset slider to center on new pair
        setPosition(50);
      });
    });

    // Initialize at 50%
    setPosition(50);
  }

  /* ═══════════════════════════════════════════════════════════
     MINI BEFORE / AFTER SLIDERS (Gallery page — 3 compact sliders)
     Lighter-weight version of the homepage slider — drag only,
     no thumbnail swapping needed since each card is a fixed pair.
  ═══════════════════════════════════════════════════════════ */
  function initMiniSliders() {
    const sliders = document.querySelectorAll('[data-mini-slider]');
    if (!sliders.length) return;

    sliders.forEach((slider) => {
      const after = slider.querySelector('[data-mini-after]');
      const divider = slider.querySelector('[data-mini-divider]');
      if (!after || !divider) return;

      let isDragging = false;
      let touchDragConfirmed = false;
      let touchStartX = null;
      let touchStartY = null;

      function setPosition(percent) {
        const clamped = Math.max(8, Math.min(92, percent));
        after.style.clipPath = `inset(0 0 0 ${clamped}%)`;
        divider.style.left = clamped + '%';
      }

      function getPercentFromEvent(clientX) {
        const rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      const handle = divider.querySelector('.mini-slider__handle');

      if (handle) {
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDragging = true;
        });
      }
      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setPosition(getPercentFromEvent(e.clientX));
      });
      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      slider.addEventListener('click', (e) => {
        if (e.target.closest('.mini-slider__handle')) return;
        setPosition(getPercentFromEvent(e.clientX));
      });

      if (handle) {
        handle.addEventListener(
          'touchstart',
          (e) => {
            const t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            touchDragConfirmed = true;
            isDragging = true;
          },
          { passive: true }
        );
      }

      slider.addEventListener(
        'touchmove',
        (e) => {
          if (!isDragging) return;
          const t = e.touches[0];
          if (!touchDragConfirmed) {
            const dx = Math.abs(t.clientX - touchStartX);
            const dy = Math.abs(t.clientY - touchStartY);
            if (dx > 16 && dx > dy) {
              touchDragConfirmed = true;
            } else if (dy > dx) {
              isDragging = false;
              return;
            }
          }
          if (touchDragConfirmed) {
            e.preventDefault();
            setPosition(getPercentFromEvent(t.clientX));
          }
        },
        { passive: false }
      );

      slider.addEventListener('touchend', () => {
        isDragging = false;
        touchDragConfirmed = false;
      });

      setPosition(50);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     TESTIMONIAL CAROUSEL — manual navigation only (no auto-scroll)
  ═══════════════════════════════════════════════════════════ */
  function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimPrev');
    const nextBtn = document.getElementById('testimNext');
    const dotsContainer = document.getElementById('testimDots');
    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(carousel.children);
    const isMobileView = () => window.innerWidth <= 900;
    const cardsPerView = () => (isMobileView() ? 1 : 3);
    let currentPage = 0;

    function totalPages() {
      return Math.max(1, Math.ceil(cards.length / cardsPerView()));
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const pages = totalPages();
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Show review page ${i + 1}`);
        if (i === currentPage) dot.classList.add('is-active');
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToPage(page) {
      const pages = totalPages();
      currentPage = Math.max(0, Math.min(page, pages - 1));

      if (isMobileView()) {
        // Mobile: scroll-snap based, handled natively by touch — sync dot only
        const card = cards[currentPage];
        if (card) card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      } else {
        const perView = cardsPerView();
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 24;
        const offset = currentPage * perView * (cardWidth + gap);
        carousel.style.transform = `translateX(-${offset}px)`;
      }

      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentPage);
      });
    }

    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Keep in sync on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        goToPage(0);
      }, 200);
    });

    buildDots();
    goToPage(0);
  }

  /* ═══════════════════════════════════════════════════════════
     MOBILE STICKY BOOKING BAR
     Appears after hero scrolls past · disappears when booking
     section is in view · WhatsApp widget is unaffected.
  ═══════════════════════════════════════════════════════════ */
  function initMobileBookingBar() {
    const bar = document.getElementById('mobileBookingBar');
    const hero = document.querySelector('.hero');
    const booking = document.getElementById('booking');
    if (!bar || !hero || !booking) return;

    if (window.innerWidth > 768) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;

    let pastHero = false;
    let inBooking = false;

    function updateVisibility() {
      if (pastHero && !inBooking) {
        bar.classList.add('is-visible');
      } else {
        bar.classList.remove('is-visible');
      }
    }

    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            updateVisibility();
          });
        },
        { threshold: 0 }
      );
      heroObserver.observe(hero);

      const bookingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inBooking = entry.isIntersecting;
            updateVisibility();
          });
        },
        { threshold: 0.15 }
      );
      bookingObserver.observe(booking);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        bar.hidden = true;
        bar.classList.remove('is-visible');
      } else {
        bar.hidden = false;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     FAQ ACCORDION (Contact page)
  ═══════════════════════════════════════════════════════════ */
  function initFAQAccordion() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach((item) => {
      const question = item.querySelector('.faq__question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all other items (single-open accordion)
        items.forEach((other) => {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.faq__question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
})();
