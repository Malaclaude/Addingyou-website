(() => {
  const tabs = [...document.querySelectorAll('[data-step]')];
  const next = document.getElementById('demo-next');
  const content = document.querySelector('.journey-content');
  if (!tabs.length || !next) return;
  const steps = [
    {status:'Follow-up sent', title:'A reason to reconnect.', detail:'An agreed message goes to a suitable past contact, with the conversation recorded in one place.', note:'Contact permissions checked first'},
    {status:'Reply received', title:'Interest, without the guesswork.', detail:'Their reply is visible alongside the original enquiry. Your team can see what has changed and what they want to discuss.', note:'Reply and conversation history together'},
    {status:'Ready for adviser follow-up', title:'Your adviser takes it from here.', detail:'The relevant adviser has the context and a clear next action: contact them to arrange a conversation.', note:'Human-led advice. A clearer handover.'}
  ];
  let active = 0;
  function show(index) {
    active = index;
    tabs.forEach((tab,i) => tab.setAttribute('aria-pressed', String(i === index)));
    document.getElementById('demo-status').textContent = steps[index].status;
    document.getElementById('demo-title').textContent = steps[index].title;
    document.getElementById('demo-detail').textContent = steps[index].detail;
    document.getElementById('demo-note').textContent = steps[index].note;
    document.getElementById('demo-reply').hidden = index === 0;
    next.innerHTML = index === 2 ? 'Start again <span aria-hidden="true">↺</span>' : 'Next step <span aria-hidden="true">→</span>';
    content.classList.remove('fade-in');
    requestAnimationFrame(() => content.classList.add('fade-in'));
  }
  tabs.forEach((tab, index) => tab.addEventListener('click', () => show(index)));
  next.addEventListener('click', () => show((active + 1) % steps.length));
})();
