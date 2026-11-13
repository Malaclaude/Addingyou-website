(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  const journeys = {
    new: {
      step1Title: 'A new lead arrives.',
      step1Text: 'From a provider, your website or an enquiry form. The details enter your marketing CRM.',
      step2Title: 'The AI starts a conversation.',
      step2Text: 'A prompt call or message asks your agreed questions and follows up when there’s no reply.',
      step3Title: 'Your adviser takes over.',
      step3Text: 'An available time is booked. Your adviser gets the answers and context before the conversation.',
      exampleContext: 'A new mortgage enquiry',
      question: '“Thanks for your enquiry. Are you looking to buy a property or remortgage?”',
      answer: '“Remortgage. My current deal ends in six months.”',
      result: 'Purpose and timing captured. Next step: offer an adviser call.'
    },
    database: {
      step1Title: 'Choose who to reconnect with.',
      step1Text: 'Agree suitable past enquiries and customers due a review, using the contact permissions you hold.',
      step2Title: 'Restart the conversation.',
      step2Text: 'An agreed call or message checks whether their needs have changed and whether they want to speak.',
      step3Title: 'Book the next review.',
      step3Text: 'Interested contacts choose an adviser call. Their answers and history are ready for your team.',
      exampleContext: 'A protection review invitation',
      question: '“Would you like to arrange a conversation with an adviser to review your protection?”',
      answer: '“Yes. We’ve moved house since we last spoke.”',
      result: 'Review requested. Next step: offer a protection adviser call.'
    }
  };
  const tabs = [...document.querySelectorAll('[data-journey]')];
  const panel = document.querySelector('#journey-panel');
  const selectJourney = tab => {
    const selected = journeys[tab.dataset.journey];
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.querySelectorAll('[data-copy]').forEach(element => { element.textContent = selected[element.dataset.copy]; });
    panel.classList.remove('is-changing');
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-changing')));
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectJourney(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) { event.preventDefault(); target.focus(); selectJourney(target); }
    });
  });
})();
