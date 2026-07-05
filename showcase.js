/* Interactive service showcase: autoplays through the six services while
   in view; interaction borrows control, autoplay resumes after a pause.
   The active item's gold progress line shows the cycle. */
(function () {
  'use strict';

  var grid = document.querySelector('.show-grid');
  if (!grid) return;

  var STEP_MS = 5500;    /* keep in sync with the showProg animation in styles.css */
  var RESUME_MS = 8000;  /* idle time before autoplay takes over again */

  var items = Array.prototype.slice.call(grid.querySelectorAll('.show-item'));
  var panes = Array.prototype.slice.call(grid.querySelectorAll('.pane'));
  var current = 0;
  var interval = null;
  var resumeTimer = null;
  var hoverTimer = null;
  var inView = false;
  var hovered = false;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function playing() { return interval !== null; }

  function play() {
    if (reduced || playing() || !inView || hovered) return;
    grid.classList.add('auto');
    /* restart the progress line on the current item */
    var active = items[current];
    active.classList.remove('active');
    void active.offsetWidth;
    active.classList.add('active');
    interval = setInterval(function () {
      activate((current + 1) % panes.length);
    }, STEP_MS);
  }

  function pause() {
    grid.classList.remove('auto');
    if (interval) { clearInterval(interval); interval = null; }
  }

  /* user takes over; autoplay returns after RESUME_MS of quiet */
  function takeOver(i) {
    pause();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { resumeTimer = null; play(); }, RESUME_MS);
    if (i !== current || !items[i].classList.contains('active')) activate(i);
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () {
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
      takeOver(i);
    });
    /* hover intent: only switch once the cursor settles on an item */
    item.addEventListener('mouseenter', function () {
      if (!window.matchMedia('(hover:hover)').matches) return;
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        hoverTimer = null;
        if (i !== current) takeOver(i);
      }, 150);
    });
    item.addEventListener('mouseleave', function () {
      if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
    });
  });

  /* pause while the visitor's cursor is inside the showcase (hover devices only) */
  grid.addEventListener('mouseenter', function () {
    if (!window.matchMedia('(hover:hover)').matches) return;
    hovered = true; pause();
  });
  grid.addEventListener('mouseleave', function () {
    hovered = false;
    if (!resumeTimer) play();
  });

  /* run only while the section is on screen */
  var seen = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      inView = e.isIntersecting;
      if (inView) {
        if (!seen) { seen = true; activate(current); }
        if (!resumeTimer) play();
      } else {
        pause();
      }
    });
  }, { threshold: 0.25 });
  io.observe(grid);
})();
