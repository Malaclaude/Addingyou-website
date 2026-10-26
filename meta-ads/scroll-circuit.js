(() => {
  'use strict';
  const svg = document.querySelector('.flow-gold');
  if (!svg) return;
  const group = svg.querySelector('.flow-gold-curves');
  const ns = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // One continuous trail. Each pass changes side and chooses another existing contour.
  const sequence = [[0,15], [1,10], [0,5], [1,15], [0,10], [1,5]];
  let pass = 0, paths = [], samples = [], total = 0, scale = 1;
  let frame = 0, layoutFrame = 0, elapsed = 0, previous = 0, scrollPosition = scrollY;
  const duration = 10500;
  function draw() {
    layoutFrame = 0;
    const width = document.documentElement.clientWidth;
    const height = document.body.scrollHeight;
    const size = parseFloat(getComputedStyle(document.querySelector('.flow-background')).backgroundSize);
    scale = size / 2000;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    group.replaceChildren();
    const [side, lane] = sequence[pass % sequence.length];
    group.setAttribute('transform', `translate(${(width-size)/2} 0) scale(${scale})${side ? ' translate(2000 0) scale(-1 1)' : ''}`);
    const x = 30 + lane * 19;
    let d = `M${x} 0`;
    for (let y = 0; y < height / scale; y += 900) {
      d += ` C${x+540} ${y+300} ${x-540} ${y+600} ${x} ${y+900}`;
    }
    paths = [];
    for (let i = 0; i < 18; i++) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-gold-trail');
      path.style.opacity = String(.035 + .42 * Math.pow((i+1)/18, 1.7));
      group.append(path);
      paths.push(path);
    }
    total = paths[0].getTotalLength();
    // Monotonic lookup keeps animation cheap while following the actual curve precisely.
    samples = Array.from({length:401}, (_,i) => {
      const length = total*i/400;
      return {length, y:paths[0].getPointAtLength(length).y};
    });
    render();
  }
  function lengthAtY(y) {
    if (y <= 0) return y;
    if (y >= samples.at(-1).y) return total + y - samples.at(-1).y;
    let low = 0, high = samples.length - 1;
    while (high-low > 1) {
      const mid = (low+high)>>1;
      if (samples[mid].y < y) low = mid; else high = mid;
    }
    const a = samples[low], b = samples[high];
    return a.length + (b.length-a.length)*(y-a.y)/(b.y-a.y);
  }
  function render() {
    if (!paths.length) return;
    const t = Math.min(elapsed/duration, 1);
    const eased = .5 - .5*Math.cos(Math.PI*t);
    const trail = Math.min(440, innerHeight*.6)/scale;
    const headY = (scrollPosition - 160 + eased*(innerHeight+520))/scale;
    const head = lengthAtY(headY);
    const piece = trail/paths.length;
    group.style.opacity = String(Math.min(1, t/.09, (1-t)/.12));
    paths.forEach((path,i) => {
      path.style.strokeDasharray = `${piece+.4} ${total+trail+1000}`;
      path.style.strokeDashoffset = String(-(head-trail+i*piece));
    });
  }
  function tick(time) {
    frame = 0;
    if (document.hidden || reduced.matches) { previous = 0; return; }
    const delta = previous ? Math.min(time-previous, 60) : 0;
    previous = time;
    elapsed += delta;
    scrollPosition += (scrollY-scrollPosition)*(1-Math.exp(-delta/180));
    if (elapsed >= duration) { elapsed = 0; pass++; draw(); }
    render();
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (reduced.matches || document.hidden) {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
    } else if (!frame) frame = requestAnimationFrame(tick);
  }
  const scheduleDraw = () => { if (!layoutFrame) layoutFrame = requestAnimationFrame(draw); };
  addEventListener('resize', scheduleDraw, {passive:true});
  new ResizeObserver(scheduleDraw).observe(document.body);
  reduced.addEventListener('change', resume);
  document.addEventListener('visibilitychange', resume);
  const system = document.querySelector('.system');
  if (system) new IntersectionObserver(([entry]) => system.classList.toggle('process-in-view', entry.isIntersecting)).observe(system);
  document.fonts.ready.then(scheduleDraw);
  draw();
  resume();
})();
