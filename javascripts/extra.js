/*
  Extra UI: Professional scroll reveal animations for Material for MkDocs
  - IntersectionObserver based (no layout thrashing)
  - CSS transitions only (JS toggles classes)
  - Reduced motion supported
*/

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements we want to reveal.
  // Keep selectors broad but safe for different Material structures.
  const selectors = [
    '.md-content > section',
    '.md-content > .card',
    '.md-content .admonition',
    '.md-content h1',
    '.md-content h2',
    '.md-content h3',
    '.md-content h4',
    '.md-content p',
    '.md-content ul',
    '.md-content ol',
    '.md-content table',
    '.md-content img'
  ];

  const els = Array.prototype.slice
    .call(document.querySelectorAll(selectors.join(',')))
    // Avoid animating tiny decorative items or icons repeatedly
    .filter(function (el) {
      // Skip if element is inside code blocks heavily
      const tag = (el.tagName || '').toLowerCase();
      if (tag === 'svg') return false;
      // Don’t animate if it’s already marked as always visible
      return !el.classList.contains('reveal-always');
    });

  // If reduced motion, just show everything.
  if (prefersReduced) {
    els.forEach(function (el) {
      el.classList.add('reveal-in');
      el.classList.remove('reveal');
    });
    return;
  }

  // Add initial hidden state.
  els.forEach(function (el) {
    el.classList.add('reveal');
  });

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          const target = entry.target;
          target.classList.add('reveal-in');
          target.classList.remove('reveal');
          io.unobserve(target);
        }
      });
    },
    {
      // Trigger a bit before fully in view
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0.08, 0.15, 0.25]
    }
  );

  els.forEach(function (el) {
    io.observe(el);
  });

  /* -------------------------------------------------
     Page transition animation for Material navigation
     - Adds a short slide-in + fade when the page loads
     - No layout/HTML changes
     ------------------------------------------------- */
  try {
    var root = document.documentElement;
    // Trigger on every navigation/load; Material next pages will reload.
    root.setAttribute('data-page-transition', 'in');

    // Remove attribute after animation ends.
    // Duration matches CSS: 650ms
    window.setTimeout(function () {
      root.removeAttribute('data-page-transition');
    }, 700);
  } catch (e) {
    // no-op
  }
})();



