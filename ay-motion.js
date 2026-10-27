(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const bar = document.createElement('div');
  bar.className='ay-scroll-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  let scheduled=false;
  function updateProgress(){
    scheduled=false;
    if(reduced.matches||document.body.classList.contains('motion-paused'))return;
    const total=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform=`scaleX(${total>0?Math.max(0,Math.min(1,scrollY/total)):0})`;
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});
  addEventListener('resize',updateProgress);updateProgress();
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      entry.target.classList.toggle('motion-in-view',entry.isIntersecting);
      if(entry.isIntersecting)entry.target.classList.add('motion-seen');
    }),{threshold:.08});
    document.querySelectorAll('main>section').forEach(el=>{el.classList.add('motion-scene');observer.observe(el)});
  }
})();
