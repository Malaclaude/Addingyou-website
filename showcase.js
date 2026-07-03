/* Interactive service showcase: list drives the preview panel.
   Auto-rotates until the visitor chooses; counters re-run per activation. */
(function () {
  'use strict';

  var grid = document.querySelector('.show-grid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.show-item'));
  var panes = Array.prototype.slice.call(grid.querySelectorAll('.pane'));
  var current = 0;
  var timer = null;
  var userDriven = false;

  function countUp(el) {
    var target = parseFloat(el.dataset.t);
    var suffix = el.dataset.s || '';
    var prefix = el.dataset.p || '';
    var dur = 1300, start = performance.now();
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  function activate(i) {
    current = i;
    items.forEach(function (item, n) {
      item.classList.toggle('active', n === i);
      item.setAttribute('aria-selected', n === i ? 'true' : 'false');
    });
    panes.forEach(function (pane, n) {
      var on = n === i;
      pane.classList.toggle('active', on);
      if (on) {
        pane.querySelectorAll('.mk-cnt').forEach(function (el) {
          el.textContent = (el.dataset.p || '') + '0' + (el.dataset.s || '');
          countUp(el);
        });
      }
    });
  }

  function stopAuto() {
    userDriven = true;
    if (timer) { clearInterval(timer); timer = null; }
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { stopAuto(); activate(i); });
    item.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover:hover)').matches) { stopAuto(); activate(i); }
    });
  });

  grid.addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
  grid.addEventListener('mouseleave', function () { startAuto(); });

  function startAuto() {
    if (userDriven || timer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () {
      activate((current + 1) % panes.length);
    }, 5000);
  }

  /* begin when the section first scrolls into view */
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        activate(current);
        startAuto();
        seen.disconnect();
      }
    });
  }, { threshold: 0.25 });
  seen.observe(grid);
})();
