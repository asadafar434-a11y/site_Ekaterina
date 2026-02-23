/* ============================================================
   Elena Ozer — Art of Nutrition | main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. STICKY HEADER: add .scrolled class on scroll
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     2. SMOOTH NAV LINKS (already handled by scroll-behavior:smooth
        in CSS, but let's also close mobile menu if needed)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     3. INTERSECTION OBSERVER — scroll-in animations
  ---------------------------------------------------------- */
  const animateEls = document.querySelectorAll(
    '.animate-in, .animate-in-left, .animate-in-right'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  animateEls.forEach(el => observer.observe(el));

  /* ----------------------------------------------------------
     4. ADD ANIMATION CLASSES TO SECTIONS
  ---------------------------------------------------------- */
  // Hero
  addAnimClass('.hero__heading-group', 'animate-in', 0);
  addAnimClass('.hero__description', 'animate-in', 100);
  addAnimClass('.hero__cta', 'animate-in', 200);
  addAnimClass('.hero__images', 'animate-in-right', 200);
  addAnimClass('.hero__tagline', 'animate-in', 300);

  // Philosophy
  addAnimClass('.philosophy .section-label', 'animate-in', 0);
  addAnimClass('.philosophy__photo-wrap', 'animate-in-left', 100);
  addAnimClass('.philosophy__content', 'animate-in-right', 200);

  // Consultation
  addAnimClass('.consultation__special', 'animate-in', 0);
  addAnimClass('.consultation__inner', 'animate-in', 100);
  addAnimClass('.consultation__btn', 'animate-in', 200);

  // Reviews
  addAnimClass('.reviews__header', 'animate-in', 0);
  document.querySelectorAll('.review-card').forEach((el, i) => {
    el.classList.add('animate-in');
    el.style.transitionDelay = `${i * 120}ms`;
    observer.observe(el);
  });

  // Contacts
  addAnimClass('.contacts__header', 'animate-in', 0);
  addAnimClass('.contacts__form-col', 'animate-in-left', 100);
  addAnimClass('.contacts__info-col', 'animate-in-right', 200);

  // Footer
  addAnimClass('.footer__brand', 'animate-in', 0);
  addAnimClass('.footer__links-group', 'animate-in', 100);

  function addAnimClass(selector, cls, delayMs) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
      if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     5. CURSOR GLOW EFFECT
  ---------------------------------------------------------- */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  });

  /* ----------------------------------------------------------
     6. COUNTERS — animate stats when visible
  ---------------------------------------------------------- */
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat__num').forEach(el => {
            animateCounter(el);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.philosophy__stats');
  if (statsSection) statsObserver.observe(statsSection);

  function animateCounter(el) {
    const text = el.textContent;
    const numMatch = text.match(/[\d]+/);
    if (!numMatch) return;
    const end = parseInt(numMatch[0]);
    const suffix = text.replace(numMatch[0], '').trim();
    const prefix = text.indexOf(numMatch[0]) > 0 ? text.slice(0, text.indexOf(numMatch[0])) : '';
    const duration = 1200;
    const step = duration / end;
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(end / 60);
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = prefix + current + suffix;
    }, step);
  }

  /* ----------------------------------------------------------
     7. CONTACT FORM — validation + submit
  ---------------------------------------------------------- */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Simple validation
      const name  = form.querySelector('#formName');
      const email = form.querySelector('#formEmail');
      let valid = true;

      clearErrors(form);

      if (!name.value.trim()) {
        showError(name, 'Введите ваше имя');
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Введите корректный email');
        valid = false;
      }

      if (!valid) return;

      // Simulate send (replace with real endpoint if needed)
      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Отправка...';

      await delay(1200);

      // Show success
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    });

    // Real-time clear error on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        const field = input.closest('.form-field');
        if (field) field.classList.remove('has-error');
        const err = field && field.querySelector('.form-error');
        if (err) err.remove();
      });

      // Floating label effect
      input.addEventListener('focus', () => {
        input.closest('.form-field')?.classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.closest('.form-field')?.classList.remove('focused');
        if (input.value) input.closest('.form-field')?.classList.add('has-value');
        else input.closest('.form-field')?.classList.remove('has-value');
      });
    });
  }

  function showError(input, msg) {
    const field = input.closest('.form-field');
    field.classList.add('has-error');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = msg;
    field.appendChild(err);
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(e => e.remove());
    form.querySelectorAll('.has-error').forEach(e => e.classList.remove('has-error'));
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  /* ----------------------------------------------------------
     8. HERO IMAGE — subtle parallax on mousemove
  ---------------------------------------------------------- */
  const heroImages = document.querySelector('.hero__images');
  if (heroImages) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      heroImages.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroImages.style.transform = '';
    });
  }

  /* ----------------------------------------------------------
     9. ACTIVE NAV LINK on scroll
  ---------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navLinks   = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // Add active style via CSS
  const style = document.createElement('style');
  style.textContent = `
    .nav__link.active { color: #fff; }
    .nav__link.active::after { width: 100%; }
    .form-field.has-error { border-color: rgba(255,80,80,0.6) !important; }
    .form-field.has-error input,
    .form-field.has-error textarea { color: rgba(255,255,255,0.9); }
    .form-error {
      display: block;
      font-family: 'Manrope', sans-serif;
      font-size: 12px;
      color: rgba(255,100,100,0.8);
      padding: 4px 24px 8px;
    }
  `;
  document.head.appendChild(style);

});
