/* =============================================
   MAIN.JS — Navbar, Scroll, Animations, UI
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar Scroll Shadow --- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* --- Hamburger Menu --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  const navAuth   = document.querySelector('.nav-auth');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks && navLinks.classList.toggle('open');
      navAuth  && navAuth.classList.toggle('open');
      // Animate spans
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('open');
      if (hamburger.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks && navLinks.classList.remove('open');
        navAuth  && navAuth.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* --- Scroll Reveal Animation --- */
  const revealEls = document.querySelectorAll('.feature-card, .drink-card, .testi-card, .menu-item, .value-card, .about-grid, .contact-section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    revealObserver.observe(el);
  });

  /* --- Contact Form Submission --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type=submit]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2d7a4f';
        contactForm.reset();
        setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 2500);
      }, 1200);
    });
  }

  /* --- Active nav link --- */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (path.endsWith(a.getAttribute('href').replace('../','').replace('./','')) ||
        (path.endsWith('/') && a.getAttribute('href').endsWith('index.html'))) {
      a.classList.add('active');
    }
  });

});
