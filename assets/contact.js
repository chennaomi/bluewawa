// Contact form — open user's email client with a prefilled message
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const TO = 'hello@bluewawa.media';
  const topic = document.getElementById('contact-topic');
  const topicHelp = document.getElementById('contact-topic-help');
  const requestedTopic = new URLSearchParams(window.location.search).get('topic');
  // Match a built-in option; never display arbitrary query-string text.
  if ([...topic.options].some(option => option.value && option.value === requestedTopic)) {
    topic.value = requestedTopic;
  }
  const updateHint = () => {
    topicHelp.textContent = topic.selectedOptions[0]?.dataset.prompt || 'Choose a topic, or describe your plans below.';
  };
  topic.addEventListener('change', updateHint);
  form.addEventListener('reset', () => queueMicrotask(updateHint));
  updateHint();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const get = (k) => (data.get(k) || '').toString().trim();
    const name = get('name');
    const company = get('company');
    const email = get('email');
    const country = get('country');
    const message = get('message');
    const selectedTopic = [...topic.options].find(option => option.value && option.value === get('topic'));
    const topicLabel = selectedTopic?.textContent.trim() || '';
    const guide = selectedTopic ? `https://www.bluewawa.media/insights/${encodeURIComponent(selectedTopic.value)}/` : '';

    const subject = `New China-readiness inquiry${topicLabel ? ' — ' + topicLabel : ''} — ${name}${company ? ' / ' + company : ''}`;
    const body =
`Hi Bluewawa team,

I'd like to book a free China-readiness call.

— Name: ${name}
— Company: ${company || '—'}
— Work email: ${email}
— Country / region: ${country || '—'}
— Topic: ${topicLabel || 'General enquiry'}${guide ? '\n— Related guide: ' + guide : ''}

What I'm trying to do in China:
${message || '(not specified)'}

Thanks!`;

    const href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  });
})();
