/**
 * Sends form data by email via FormSubmit (https://formsubmit.co) — no backend needed.
 * The first submission sends an activation email to TO_EMAIL; nothing is delivered until it's confirmed.
 */
const TO_EMAIL = 'yananikolenko18@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${TO_EMAIL}`;

export async function sendForm(subject, fields, replyTo) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      ...(replyTo ? { _replyto: replyTo } : {}),
      ...fields,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || `HTTP ${res.status}`);
}
