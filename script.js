(function() {
  'use strict';

  // ===== Language Toggle =====
  const defaultLang = 'de';
  let currentLang = localStorage.getItem('wedding-lang') || defaultLang;

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('wedding-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-de]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'de' ? 'EN' : 'DE';
    }

    document.querySelectorAll('.form-link').forEach(el => {
      const href = el.getAttribute('data-href-' + lang);
      if (href) el.href = href;
    });
  }

  document.getElementById('lang-toggle').addEventListener('click', function() {
    applyLanguage(currentLang === 'de' ? 'en' : 'de');
  });

  // Apply on load
  applyLanguage(currentLang);

  // ===== Countdown Timer =====
  const weddingDate = new Date('2026-08-29T14:00:00+02:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-mins').textContent = '0';
      document.getElementById('cd-secs').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = days;
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== Sticky Nav =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== Hamburger Menu =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== Scroll Reveal (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(imgEl) {
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || '';
    const captionEl = imgEl.parentElement.querySelector('.gallery-caption');
    if (captionEl) {
      const de = captionEl.getAttribute('data-de') || '';
      const en = captionEl.getAttribute('data-en') || '';
      lightboxCaption.setAttribute('data-de', de);
      lightboxCaption.setAttribute('data-en', en);
      lightboxCaption.innerHTML = currentLang === 'en' ? en : de;
    } else {
      lightboxCaption.removeAttribute('data-de');
      lightboxCaption.removeAttribute('data-en');
      lightboxCaption.innerHTML = '';
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImg.src = '';
    lightboxCaption.innerHTML = '';
  }

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
      openLightbox(this);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        activeItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

})();
