/* =====================================================================
   Tootie Designs — landing interactions
   Vanilla JS, no dependencies. The page is fully readable without it.
   ===================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky-header hairline once the page scrolls. */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Quiet, one-shot scroll reveals (reduced-motion aware). */
  var targets = document.querySelectorAll(
    '.section-head, .card, .band, .statement, .services-cols, .studio-head, .panel, .contact-heading, .contact-sub'
  );
  if (!prefersReduced && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 5, 4) * 55 + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* Placeholder work links — no jump-to-top until real URLs land. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#"]'), function (link) {
    link.addEventListener('click', function (ev) { ev.preventDefault(); });
  });

  /* Footer year. */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
