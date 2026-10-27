(() => {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('ready'); observer.observe(element); });
})();

(() => {
 const host=document.getElementById('brokerVisual'), svg=document.getElementById('brokerFlow');
 if(!host||!svg)return;
 const ns='http://www.w3.org/2000/svg';let pending=0;
 function draw(){pending=0;const h=host.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${h.width} ${h.height}`);svg.querySelectorAll('path').forEach(p=>p.remove());
 const cards=[1,2,3,4,5].map(i=>document.getElementById('bn'+i).getBoundingClientRect());
 for(let i=0;i<cards.length-1;i++){const a=cards[i],b=cards[i+1];let x1=a.left+a.width/2-h.left,y1=a.bottom-h.top,x2=b.left+b.width/2-h.left,y2=b.top-h.top;const mid=(y1+y2)/2;const d=`M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
 for(const cls of ['broker-line','broker-pulse']){const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class',cls);p.setAttribute('pathLength','100');p.style.animationDelay=`${i*.8}s`;svg.appendChild(p);}}
 }
 const schedule=()=>{if(!pending)pending=requestAnimationFrame(draw);};new ResizeObserver(schedule).observe(host);document.fonts.ready.then(schedule);window.addEventListener('load',schedule);schedule();
})();
