(() => {
  'use strict';
  const form = document.getElementById('venue-form');
  const fields = document.getElementById('form-fields');
  const status = document.getElementById('form-status');
  const label = document.getElementById('submit-label');
  const config = window.AY_VENUE_FORM || {};
  const startedAt = Date.now();
  let busy = false;
  let submissionId = crypto.randomUUID();
  let lastPayload = '';
  const showStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('error', error);
    status.hidden = false;
    status.focus();
  };
  document.querySelectorAll('a[href="#privacy"]').forEach(a => a.addEventListener('click', () => { document.getElementById('privacy').open = true; }));
  for (const input of form.querySelectorAll('input:not([name="fax_number"]),select')) {
    input.setAttribute('aria-describedby', `${input.name}-error`);
    input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); document.getElementById(`${input.name}-error`).textContent = ''; });
  }
  if (!config.enabled || !config.endpoint) return;
  let endpoint;
  try { endpoint = new URL(config.endpoint, location.origin); } catch { return; }
  if (endpoint.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(endpoint.hostname)) return;
  document.getElementById('preview-notice').hidden = true;
  fields.disabled = false;
  fields.hidden = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    status.hidden = true;
    let firstInvalid;
    const data = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(data)) data[key] = data[key].trim();
    for (const input of form.querySelectorAll('input:not([name="fax_number"]),select')) {
      let message = '';
      if (input.required && !data[input.name]) message = 'Please complete this field.';
      else if (input.name === 'email' && !input.validity.valid) message = 'Enter a valid email address.';
      else if (input.name === 'phone' && !/^\+?[\d\s().-]{7,30}$/.test(data.phone)) message = 'Enter a valid phone number, including dialling code.';
      else if (input.name === 'phone' && (data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15)) message = 'Enter a valid phone number.';
      else if (input.name === 'website' && data.website) {
        try { const url = new URL(/^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`); if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw Error(); } catch { message = 'Enter a website such as yourvenue.co.uk.'; }
      }
      document.getElementById(`${input.name}-error`).textContent = message;
      if (message) { input.setAttribute('aria-invalid', 'true'); firstInvalid ||= input; } else input.removeAttribute('aria-invalid');
    }
    if (firstInvalid) { firstInvalid.focus(); return; }
    const fingerprint = JSON.stringify(data);
    if (lastPayload && lastPayload !== fingerprint) submissionId = crypto.randomUUID();
    lastPayload = fingerprint;
    busy = true;
    fields.disabled = true;
    label.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(endpoint.href, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, submission_id: submissionId, started_at: startedAt }), signal: AbortSignal.timeout(18000), credentials: 'omit' });
      const result = await response.json();
      if (response.ok && result.status === 'accepted') {
        form.querySelector('fieldset').hidden = true;
        showStatus('Your callback request has been received. Malachi will be in touch within one business day.');
        return;
      }
      if (result.code === 'uncertain' || result.code === 'pending') {
        showStatus(`We couldn’t confirm delivery. Please email info@addingyou.com with reference ${submissionId.slice(0, 8)} so we can check before you submit again.`, true);
        return;
      }
      fields.disabled = false;
      showStatus(result.code === 'rate_limited' ? 'Too many attempts. Please try again later or email info@addingyou.com.' : result.code === 'validation' ? 'Please check your details and try again.' : 'Your enquiry could not be sent. Your details are still here. Please try again later or email info@addingyou.com.', true);
    } catch {
      // The relay may have received the request. Retain the same ID on retry.
      fields.disabled = false;
      showStatus('We couldn’t confirm delivery. You can retry once using the same details, or email info@addingyou.com. Retrying this form uses the same request reference to avoid a duplicate.', true);
    } finally { busy = false; label.textContent = 'Request my callback'; }
  });
})();
