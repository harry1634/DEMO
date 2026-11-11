(function () {
  var WA = '919963891199';
  var EMAIL = 'veerahpropertymanagement@gmail.com';

  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.classList.remove('open'); }
  });

  document.getElementById('yr').textContent = new Date().getFullYear();

  // reveal + counters
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, n = +el.dataset.n, i = 0;
      var t = setInterval(function () { i++; el.textContent = i; if (i >= n) clearInterval(t); }, Math.max(30, 900 / n));
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-n]').forEach(function (el) { co.observe(el); });

  // contact form -> WhatsApp / Email
  var form = document.getElementById('form');
  var err = document.getElementById('err');

  function build() {
    var f = form.elements;
    var name = f.name.value.trim();
    var phone = f.phone.value.trim();
    if (!name || phone.replace(/\D/g, '').length < 10) {
      err.textContent = 'Please enter your name and a valid 10-digit phone number.';
      return null;
    }
    err.textContent = '';
    return [
      'Hello Veerah Property Management,',
      '',
      'I would like to enquire about property management services.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Property type: ' + f.type.value,
      'Beds / units: ' + (f.size.value.trim() || '-'),
      'Location: ' + (f.location.value.trim() || '-'),
      'Message: ' + (f.msg.value.trim() || '-')
    ].join('\n');
  }

  form.addEventListener('click', function (e) {
    var b = e.target.closest('[data-send]');
    if (!b) return;
    var text = build();
    if (!text) return;
    if (b.dataset.send === 'wa') {
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    } else {
      window.location.href = 'mailto:' + EMAIL + '?subject=' +
        encodeURIComponent('Enquiry: ' + form.elements.type.value + ' management') +
        '&body=' + encodeURIComponent(text);
    }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
