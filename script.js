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
    location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Property management enquiry' + (m.org ? ' - ' + m.org : '')) +
      '&body=' + encodeURIComponent(m.text);
  }
});
