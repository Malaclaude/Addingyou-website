(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.masthead')) closeMenu(); });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const control = document.querySelector('.motion-toggle');
  let paused = reduced.matches;
  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    if (!control) return;
    control.setAttribute('aria-pressed', String(paused));
    control.setAttribute('aria-label', paused ? 'Enable page animations' : 'Pause page animations');
    control.innerHTML = paused ? '<span aria-hidden="true">▷</span> Enable motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
  }
  control?.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updateMotion(); });
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('tab-hidden', document.hidden));
  updateMotion();
  // All copy stays visible. A short, one-time highlight simply reinforces the order.
  if ('IntersectionObserver' in window) {
    const flowObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('flow-seen'); flowObserver.unobserve(entry.target); }
    }), {threshold: .15});
    document.querySelectorAll('[data-quick-flow]').forEach(el => flowObserver.observe(el));
  }
})();
