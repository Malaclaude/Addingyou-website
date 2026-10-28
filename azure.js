(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const line = document.createElement('div'); line.className = 'azure-line'; line.setAttribute('aria-hidden', 'true'); document.body.appendChild(line);
  let queued = false;
  function progress() { queued = false; if (reduced.matches || document.body.classList.contains('motion-paused')) return; const total = document.documentElement.scrollHeight - innerHeight; line.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`; }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(progress); } }, {passive:true});
  addEventListener('resize', progress); progress();
  if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-in-view', entry.isIntersecting)), {threshold:.05}); document.querySelectorAll('main>section').forEach(section => observer.observe(section)); }
})();
