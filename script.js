const WA = '919963891199';
const EMAIL = 'veerahpropertymanagement@gmail.com';

const toggle = document.getElementById('toggle'), nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('form');
const note = document.getElementById('formnote');
const DEFAULT_NOTE = note.textContent;

function buildMessage() {
  const d = new FormData(form);
  const name = (d.get('name') || '').trim();
  const email = (d.get('email') || '').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    note.textContent = 'Please enter your name and a valid email address.';
    note.style.color = '#b3392f';
    return null;
  }
  note.textContent = DEFAULT_NOTE;
  note.style.color = '';
  return {
    org: (d.get('org') || '').trim(),
    text: [
      'Hello Veerah Property Management,',
      '',
      'I would like to discuss property management services.',
      '',
      'Name: ' + name,
      'Organization: ' + ((d.get('org') || '').trim() || '-'),
      'Email: ' + email,
      'Requirements: ' + ((d.get('message') || '').trim() || '-')
    ].join('\n')
  };
}

form.addEventListener('submit', e => e.preventDefault());
form.addEventListener('click', e => {
  const b = e.target.closest('[data-send]');
  if (!b) return;
  const m = buildMessage();
  if (!m) return;
  if (b.dataset.send === 'wa') {
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m.text), '_blank', 'noopener');
  } else {
    sendEmail(b, m);
  }
});

function sendEmail(btn, m) {
  const subject = 'Property management enquiry' + (m.org ? ' - ' + m.org : '');
  const d = new FormData(form);
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  fetch('https://formsubmit.co/ajax/' + EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _replyto: d.get('email'),
      name: d.get('name'),
      organization: d.get('org') || '-',
      email: d.get('email'),
      requirements: d.get('message') || '-'
    })
  })
    .then(r => r.json().then(j => ({ ok: r.ok && String(j.success) !== 'false', j })))
    .then(res => {
      if (!res.ok) throw new Error(res.j && res.j.message);
      form.reset();
      note.textContent = 'Thank you! Your enquiry has been sent. We will get back to you shortly.';
      note.style.color = '#2e7d4f';
    })
    .catch(() => {
      note.style.color = '#b3392f';
      note.innerHTML = 'Could not send automatically. <a href="https://mail.google.com/mail/?view=cm&fs=1&to=' +
        EMAIL + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(m.text) +
        '" target="_blank" rel="noopener"><b>Open Gmail to send</b></a> or use WhatsApp.';
    })
    .finally(() => { btn.disabled = false; btn.textContent = label; });
}
