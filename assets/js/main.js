/* ИП Завадский О. Ю.: меню, разбор симптомов, форма заявки */

document.addEventListener('DOMContentLoaded', function () {
  initMenu();
  initDiag();
  initForm();
  initYear();
});

function initMenu() {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  function close() {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function () {
    var open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { close(); burger.focus(); }
  });

  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') close();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && !menu.hidden) close();
  });
}

/* Разбор симптомов: выбираем, что происходит с водой */
function initDiag() {
  var groups = document.querySelectorAll('.diag');
  if (!groups.length) return;

  groups.forEach(function (group) {
    var btns = group.querySelectorAll('[data-sym]');
    var panels = group.querySelectorAll('[data-panel]');

    function activate(key) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-sym') === key;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        p.classList.toggle('is-on', p.getAttribute('data-panel') === key);
      });
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { activate(b.getAttribute('data-sym')); });
    });

    activate(btns[0].getAttribute('data-sym'));
  });
}

function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;

  var success = document.getElementById('form-success');
  var waLink = document.getElementById('wa-link');
  var again = document.getElementById('again-btn');
  var nameInput = form.querySelector('[name="name"]');
  var phoneInput = form.querySelector('[name="phone"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    [nameInput, phoneInput].forEach(function (el) {
      var err = document.getElementById('e-' + el.name);
      var valid = el === nameInput ? el.value.trim().length > 1 : digits(el.value).length >= 9;
      el.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (err) err.textContent = valid ? '' : (el === nameInput ? 'Как к вам обращаться?' : 'Нужен номер для связи');
      if (!valid) ok = false;
    });

    if (!ok) {
      var bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }

    var d = new FormData(form);
    var lines = ['Заявка с сайта: скважины и вода', 'Имя: ' + (d.get('name') || '').trim(), 'Телефон: ' + (d.get('phone') || '').trim()];
    if (d.get('city')) lines.push('Населённый пункт: ' + d.get('city').trim());
    if (d.get('what')) lines.push('Нужно: ' + d.get('what'));
    if (d.get('note')) lines.push('Что с водой: ' + d.get('note').trim());

    waLink.href = 'https://wa.me/375333940121?text=' + encodeURIComponent(lines.join('\n'));
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  if (again) {
    again.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      nameInput.focus();
    });
  }

  function digits(v) { return (v || '').replace(/\D/g, ''); }
}

function initYear() {
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}
