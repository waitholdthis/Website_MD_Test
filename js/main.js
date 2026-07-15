/* =====================================================================
   Tootie Designs — landing interactions
   Vanilla JS, no dependencies. Degrades gracefully without it.
   ===================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------
     1. Hero type specimen — the thesis, demonstrated.
     The same slot cycles through different clients, each rendered
     in a typeface that fits it. Range, shown rather than claimed.
     ------------------------------------------------------------- */
  var rotator = document.querySelector('[data-rotator]');
  var specimens = [
    { text: 'a record label',  family: "'Bricolage Grotesque', sans-serif", weight: 800, style: 'normal',  tracking: '-0.03em' },
    { text: 'a corner bakery', family: "'Newsreader', Georgia, serif",       weight: 400, style: 'italic',  tracking: '0'       },
    { text: 'a law firm',      family: "'Newsreader', Georgia, serif",       weight: 500, style: 'normal',  tracking: '0.02em'  },
    { text: 'a coffee roaster',family: "'Hanken Grotesk', sans-serif",       weight: 700, style: 'normal',  tracking: '-0.02em' },
    { text: 'a game studio',   family: "'JetBrains Mono', monospace",        weight: 500, style: 'normal',  tracking: '-0.03em' },
    { text: 'a florist',       family: "'Newsreader', Georgia, serif",       weight: 300, style: 'italic',  tracking: '0'       },
    { text: 'a photographer',  family: "'Bricolage Grotesque', sans-serif",  weight: 300, style: 'normal',  tracking: '-0.02em' }
  ];

  function applySpecimen(spec) {
    rotator.textContent = spec.text;
    rotator.style.fontFamily = spec.family;
    rotator.style.fontWeight = spec.weight;
    rotator.style.fontStyle = spec.style;
    rotator.style.letterSpacing = spec.tracking;
  }

  if (rotator) {
    var idx = 0;
    applySpecimen(specimens[0]);

    if (!prefersReduced) {
      var advance = function () {
        rotator.classList.add('is-out');
        window.setTimeout(function () {
          idx = (idx + 1) % specimens.length;
          applySpecimen(specimens[idx]);
          rotator.classList.remove('is-out');
        }, 340);
      };
      // Kick off after a beat so the first word is read, then hold each ~2.4s.
      window.setInterval(advance, 2600);
    }
  }

  /* -------------------------------------------------------------
     2. Theme toggle — respects OS default, remembers a manual pick.
     ------------------------------------------------------------- */
  var toggle = document.querySelector('.theme-toggle');
  var root = document.documentElement;
  var stored = null;
  try { stored = window.localStorage.getItem('tootie-theme'); } catch (e) { stored = null; }

  function currentTheme() {
    if (root.getAttribute('data-theme')) return root.getAttribute('data-theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
  }

  if (stored === 'dark' || stored === 'light') {
    root.setAttribute('data-theme', stored);
  }
  syncToggle();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { window.localStorage.setItem('tootie-theme', next); } catch (e) { /* private mode */ }
      syncToggle();
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#150F12' : '#F4EEEC');
    });
  }

  /* -------------------------------------------------------------
     3. Sticky-header hairline once the page scrolls.
     ------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------
     4. Scroll reveals — quiet, one-shot, reduced-motion aware.
     ------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    '.credo-heading, .credo-cols, .work-card, .step, .service, .studio-body, .contact-heading, .contact-sub'
  );
  if (!prefersReduced && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealTargets, function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------
     5. Placeholder work links — no jump-to-top until real URLs land.
     ------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#"]'), function (link) {
    link.addEventListener('click', function (ev) { ev.preventDefault(); });
  });

  /* -------------------------------------------------------------
     6. Footer year.
     ------------------------------------------------------------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
