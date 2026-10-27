(() => {
  const canvas = document.querySelector('.journey-canvas');
  const svg = document.querySelector('.journey-lines');
  if (!canvas || !svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const nodes = [...document.querySelectorAll('.journey-nodes>li')];
  function draw() {
    const host = canvas.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${host.width} ${host.height}`);
    svg.querySelectorAll('.journey-path').forEach(el => el.remove());
    nodes.slice(0, -1).forEach((node, i) => {
      const a = node.getBoundingClientRect(), b = nodes[i + 1].getBoundingClientRect();
      const ac = {x:a.left+a.width/2-host.left,y:a.top+a.height/2-host.top};
      const bc = {x:b.left+b.width/2-host.left,y:b.top+b.height/2-host.top};
      let x1, y1, x2, y2, d;
      if (Math.abs(ac.y-bc.y)<20) {
        const forward=bc.x>ac.x;
        x1=(forward?a.right:a.left)-host.left; y1=ac.y;
        x2=(forward?b.left:b.right)-host.left; y2=bc.y;
        d=`M${x1} ${y1}H${x2}`;
      } else {
        x1=ac.x; y1=a.bottom-host.top; x2=bc.x; y2=b.top-host.top;
        const mid=(y1+y2)/2;
        d=`M${x1} ${y1}C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
      }
      for (const type of ['base','pulse']) {
        const path=document.createElementNS(ns,'path');
        path.setAttribute('d',d); path.setAttribute('class',`journey-path journey-${type}`);path.setAttribute('pathLength','100');
        if(type==='base')path.setAttribute('marker-end','url(#journey-arrow)');
        else path.style.animationDelay=`${i*.65}s`;
        svg.appendChild(path);
      }
    });
  }
  new ResizeObserver(draw).observe(canvas);
  document.fonts.ready.then(draw);
  window.addEventListener('load',draw);
  draw();
})();
