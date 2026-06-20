// ============================================
// IVY'S BEAUTY SECRET — CORE INTERACTIONS
// ============================================

// Header scroll state
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    body.classList.toggle('nav-open');
  });
}

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    body.classList.remove('nav-open');
  });
});

// Scroll reveal via IntersectionObserver
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Duplicate marquee content for seamless loop
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

// Services page: sticky tab active-state on scroll
const serviceTabs = document.querySelectorAll('.service-tab');
const menuSections = document.querySelectorAll('.menu-section');

if (serviceTabs.length && menuSections.length) {
  const tabObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        serviceTabs.forEach(tab => {
          tab.classList.toggle('active', tab.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });

  menuSections.forEach(section => tabObserver.observe(section));
}

// Gallery page: category filter
const filterPills = document.querySelectorAll('.filter-pill');
const masonryItems = document.querySelectorAll('.masonry-item');

if (filterPills.length && masonryItems.length) {
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      masonryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

// Gallery page: lightbox
const lightbox = document.querySelector('.lightbox');
if (lightbox && masonryItems.length) {
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;

  const getVisibleItems = () => Array.from(masonryItems).filter(i => !i.classList.contains('hidden'));

  const openLightbox = (index) => {
    const visible = getVisibleItems();
    currentIndex = index;
    const fullSrc = visible[currentIndex].dataset.full || visible[currentIndex].querySelector('img').src;
    lightboxImg.src = fullSrc;
    lightbox.classList.add('open');
  };

  masonryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      openLightbox(idx);
    });
  });

  closeBtn?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  nextBtn?.addEventListener('click', () => {
    const visible = getVisibleItems();
    openLightbox((currentIndex + 1) % visible.length);
  });
  prevBtn?.addEventListener('click', () => {
    const visible = getVisibleItems();
    openLightbox((currentIndex - 1 + visible.length) % visible.length);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'ArrowLeft') prevBtn?.click();
  });
}

// Contact page: Formspree AJAX submission
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  const formSuccess = document.querySelector('.form-success');
  const submitBtn = bookingForm.querySelector('button[type="submit"]');

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(bookingForm.action, {
        method: 'POST',
        body: new FormData(bookingForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        bookingForm.style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = 'Something went wrong — try WhatsApp instead';
      submitBtn.disabled = false;
      setTimeout(() => { submitBtn.textContent = originalText; }, 3000);
    }
  });
}

