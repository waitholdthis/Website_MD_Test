/* =====================================================================
   Tootie Designs — church websites, landing interactions
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
    '.section-head, .card, .band, .statement, .services-cols, .integrations, ' +
    '.studio-head, .panel, .contact-heading, .contact-sub'
  );
  if (!prefersReduced && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    /* Stagger siblings against each other, not against document order — a long
       card grid should ripple, but a lone panel shouldn't wait its turn. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var peers = el.parentNode ? el.parentNode.children : [el];
        var rank = Array.prototype.indexOf.call(peers, el);
        el.style.transitionDelay = Math.min(rank, 5) * 70 + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* Video.
     - Reduced motion: never play. The poster is a real frame, so the page still reads.
     - Below the fold: only fetch and play once seen, and pause again when it leaves.
       Autoplaying three clips at once would cost more than the whole rest of the page. */
  var videos = document.querySelectorAll('video');
  if (prefersReduced) {
    Array.prototype.forEach.call(videos, function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  } else if ('IntersectionObserver' in window) {
    var lazyVideos = document.querySelectorAll('video[data-lazyplay]');
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.preload !== 'auto') v.preload = 'auto';
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* autoplay refused — poster stands in */ });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.2 });
    Array.prototype.forEach.call(lazyVideos, function (v) { vio.observe(v); });
  }

  /* Placeholder links — no jump-to-top until real URLs land. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#"]'), function (link) {
    link.addEventListener('click', function (ev) { ev.preventDefault(); });
  });

  /* Footer year. */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
