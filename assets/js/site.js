/* =============================================================================
 * MEERKAT UNIVERSE — site behaviour
 *
 * Three small jobs and nothing else: turn store placeholders into real links
 * when URLs exist, drive the screenshot dots, and reveal sections on scroll.
 *
 * THE PAGE WORKS WITHOUT THIS FILE. Screenshots are real <img> elements in the
 * HTML, not injected here, so they render, lazy-load and are indexed with no
 * JavaScript at all. This only adds polish on top.
 * ========================================================================== */

(function () {
  'use strict';

  var cfg = window.MU_CONFIG || {};
  var links = cfg.storeLinks || {};

  /* ---------------------------------------------------------------------
   * Store buttons
   *
   * The markup ships as a <span> — not a link, not focusable, no href — so an
   * unconfigured button cannot navigate or reload the page, and does not tell
   * a screen reader it is actionable when it is not. When a URL exists the
   * span is REPLACED by a real anchor, which is the only way to get genuine
   * link semantics (keyboard, middle-click, "open in new tab", the lot).
   * ------------------------------------------------------------------- */
  /* Human names for the platforms still to come, so a partial launch can say
     WHICH one rather than going quiet. Keyed by the `data-store` attribute. */
  var STORE_NAMES = { appStore: 'iPhone and iPad', googlePlay: 'Android' };

  function upgradeStoreButtons() {
    var placeholders = document.querySelectorAll('span.store-btn[data-store]');
    var anyLive = false;
    var stillComing = [];

    Array.prototype.forEach.call(placeholders, function (span) {
      var store = span.getAttribute('data-store');
      var url = links[store];
      if (!url) { stillComing.push(STORE_NAMES[store] || store); return; }

      var a = document.createElement('a');
      a.className = span.className;
      a.href = url;
      a.rel = 'noopener';
      // MOVED, NOT COPIED AS MARKUP. This was `a.innerHTML = span.innerHTML`,
      // which is the only DOM sink in this file — harmless today because the
      // source is static markup in the same document, and exactly the line
      // that would become a vector the day that markup turns dynamic. Moving
      // the nodes is also what lets the CSP below carry no `'unsafe-inline'`.
      while (span.firstChild) a.appendChild(span.firstChild);
      // The placeholder's label carries "coming soon"; a live link must not.
      a.setAttribute('aria-label', span.getAttribute('data-label') || '');
      span.parentNode.replaceChild(a, span);
      anyLive = true;
    });

    /* THE CAPTION IS ABOUT THE BUTTONS BESIDE IT, AND A PARTIAL LAUNCH IS THE
       CASE THAT MATTERS. This used to remove the caption as soon as ANY button
       went live — correct only if both platforms ship together, which is not
       what happened: iOS went live first, and removing the caption then would
       have left the Play placeholder looking exactly like the working App Store
       link, since the two differ by `opacity: .92` and nothing else. A button
       that looks live and does nothing is worse than one that says "not yet".
       So: gone only when everything is live, otherwise rewritten to name what
       is missing. */
    if (!anyLive) return;
    Array.prototype.forEach.call(
      document.querySelectorAll('.store-note'),
      function (n) {
        if (!stillComing.length) { n.remove(); return; }
        n.textContent = stillComing.join(' and ') + ' coming soon';
      }
    );
  }

  /* ---------------------------------------------------------------------
   * Screenshot carousel
   *
   * Scrolling itself is native CSS scroll-snap — no script, so it keeps the
   * platform's own momentum and feel. This only keeps the dots in sync and
   * lets them move the track.
   * ------------------------------------------------------------------- */
  function initCarousel() {
    var track = document.querySelector('[data-carousel]');
    var dotsBox = document.querySelector('[data-dots]');
    if (!track || !dotsBox) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.shot'));
    if (slides.length < 2) { dotsBox.remove(); return; }

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      // A real label, because "slide 3" is what a screen-reader user needs to
      // hear — a decorative <span> here would be a control they cannot name.
      dot.setAttribute('aria-label', 'Show screenshot ' + (i + 1) + ' of ' + slides.length);
      dot.addEventListener('click', function () {
        track.scrollTo({
          left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      });
      dotsBox.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsBox.children);

    function sync() {
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0;
      var bestDist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-current', i === best ? 'true' : 'false');
      });
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { sync(); ticking = false; });
    }, { passive: true });

    sync();
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------------------------------------------------------------------
   * Entrance reveal
   *
   * Deliberately a plain scroll handler over getBoundingClientRect rather than
   * an IntersectionObserver. The observer is the fashionable answer and it is
   * the wrong one here: its failure mode is SILENT and maximally bad — every
   * `.reveal` section stays at opacity 0 and the page reads as blank — and a
   * feature check cannot detect an observer that exists but never delivers
   * (measured: inside an embedded document it reports once, non-intersecting,
   * and then goes quiet through every subsequent scroll).
   *
   * Twelve rects behind a requestAnimationFrame throttle is not a performance
   * problem, and this version can be verified from the outside: scroll, then
   * assert the class is present.
   * ------------------------------------------------------------------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    function revealAll() {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      items = [];
    }

    // Content must never depend on an effect to become readable.
    if (prefersReducedMotion()) { revealAll(); return; }

    function pass() {
      if (!items.length) return;
      var h = window.innerHeight || document.documentElement.clientHeight;
      items = items.filter(function (el) {
        var r = el.getBoundingClientRect();
        // "Has it reached the trigger line yet", NOT "is it on screen now".
        // The difference matters: an element scrolled PAST has a negative top,
        // so an intersection test would leave it hidden forever — which is what
        // a restored scroll position or a deep link lands you in, a page of
        // blank sections above wherever you arrived.
        if (r.top < h * 0.92) { el.classList.add('is-visible'); return false; }
        return true;
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { pass(); ticking = false; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', pass);
    pass();
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    upgradeStoreButtons();
    initCarousel();
    initReveal();
  });
})();
