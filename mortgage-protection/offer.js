(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.masthead')) closeMenu(); });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const globalControl = document.querySelector('.motion-toggle');
  const play = document.getElementById('journey-play');
  const board = document.querySelector('.relationship-board');
  const stage = document.querySelector('.relationship-stage');
  const stageButtons = [...document.querySelectorAll('button[data-stage]')];
  const caseButtons = [...document.querySelectorAll('[data-case]')];
  const cases = [
    {title:'A move put on hold.', interest:'Moving home', context:'Not ready to proceed', reconnect:'Ask whether their moving plans have changed, using an agreed message that refers to the earlier enquiry.', response:'Their plans have moved forward. They would like to speak to an adviser about the next step.'},
    {title:'A conversation left open.', interest:'Protection review', context:'Review not arranged', reconnect:'Offer to pick up the earlier protection conversation. The message invites a discussion, without recommending cover.', response:'They would like to revisit the conversation. Your adviser can arrange a review and assess their needs.'},
    {title:'Timing worth revisiting.', interest:'Remortgage enquiry', context:'Wanted to revisit later', reconnect:'Ask whether now is a useful time to speak again, using the context and timing recorded by your team.', response:'They are ready to talk through their plans. Your adviser has the earlier enquiry and new reply together.'}
  ];
  const steps = [
    {record:'Paused', status:'Review the contact', title:'Start with a reason.', action:'Review before contacting', detail:'Check the earlier enquiry and contact permissions. Agree who it makes sense to approach, and why.', note:'Relevant contact. Relevant timing.'},
    {record:'Contacted', status:'Agreed follow-up sent', title:'Pick up the thread.', action:'Watch for a reply', detail:'', note:'The earlier context shapes the message.'},
    {record:'Replied', status:'Interest confirmed', title:'Now there’s a conversation.', action:'Prepare adviser handover', detail:'', note:'A response your team can act on.'},
    {record:'For adviser', status:'Your team takes over', title:'The context comes with them.', action:'Call to arrange a conversation', detail:'The assigned adviser can see the original interest and the new response. They contact the client to arrange a conversation.', note:'Advice and suitability stay with your advisers.'}
  ];
  let activeCase = 0, activeStage = 0, visible = false, timer = null;
  let paused = reduced.matches, playing = !reduced.matches;
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  function clearTimer() { clearTimeout(timer); timer = null; }
  function controls() {
    globalControl.setAttribute('aria-pressed', String(paused));
    globalControl.setAttribute('aria-label', paused ? 'Enable page animations' : 'Pause page animations');
    globalControl.innerHTML = paused ? '<span aria-hidden="true">▷</span> Enable motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
    document.body.classList.toggle('motion-paused', paused);
    const isPlaying = playing && !paused;
    play.setAttribute('aria-pressed', String(isPlaying));
    play.innerHTML = isPlaying ? 'Pause example <span aria-hidden="true">Ⅱ</span>' : 'Play example <span aria-hidden="true">▷</span>';
  }
  function schedule() {
    clearTimer();
    if (visible && playing && !paused && !document.hidden) timer = setTimeout(() => { render(activeCase, (activeStage + 1) % 4); }, 5200);
  }
  function render(whichCase, whichStage) {
    activeCase = whichCase; activeStage = whichStage;
    const c = cases[activeCase], s = steps[activeStage];
    stage.dataset.stage = String(activeStage);
    if (!paused && !reduced.matches) { document.querySelector('.adviser-view').animate([{opacity:.3,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], {duration:650,easing:'cubic-bezier(.16,1,.3,1)'}); }
    setText('record-title', c.title); setText('record-interest', c.interest); setText('record-context', c.context); setText('record-action', s.action); setText('record-status', s.record);
    setText('adviser-title', s.title); setText('adviser-status', s.status); setText('adviser-detail', activeStage === 1 ? c.reconnect : activeStage === 2 ? c.response : s.detail); setText('adviser-note', s.note);
    caseButtons.forEach((b,i) => b.setAttribute('aria-pressed', String(i === activeCase)));
    stageButtons.forEach((b,i) => b.setAttribute('aria-pressed', String(i === activeStage)));
    controls(); schedule();
  }
  caseButtons.forEach((b,i) => b.addEventListener('click', () => { playing = false; render(i, 0); }));
  stageButtons.forEach((b,i) => b.addEventListener('click', () => { playing = false; render(activeCase, i); }));
  play.addEventListener('click', () => { const wasPlaying = playing && !paused; paused = false; playing = !wasPlaying; controls(); schedule(); });
  globalControl.addEventListener('click', () => { paused = !paused; controls(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { paused = reduced.matches; if (reduced.matches) playing = false; controls(); schedule(); });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold:.25});
  observer.observe(board); render(0,0);

  if (!reduced.matches && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) {e.target.classList.add('visible'); reveal.unobserve(e.target);} }), {threshold:.08});
    document.querySelectorAll('.relationship-heading,.relationship-board,.engagement,.commercial-rail,.proof-grid,.system-map').forEach(el => { el.classList.add('reveal-scene','ready'); reveal.observe(el); });
  }
})();
