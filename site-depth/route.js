(() => {
 const scenes=document.querySelectorAll('.motion-scene');
 if(!('IntersectionObserver' in window)) {scenes.forEach(el=>el.classList.add('is-visible'));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.classList.toggle('is-visible',isIntersecting)),{threshold:.15});
 scenes.forEach(el=>observer.observe(el));
})();
