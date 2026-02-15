(function () {
  'use strict';

  var WHATSAPP_NUMBER = '9779849027963';

  var modal = document.getElementById('whatsappModal');
  var form = document.getElementById('whatsappForm');
  var successEl = document.getElementById('whatsappSuccess');
  var errorEl = document.getElementById('whatsappError');
  var backdrop = document.getElementById('whatsappModalBackdrop');
  var closeBtn = document.getElementById('whatsappModalClose');
  var captchaLabel = document.getElementById('captchaLabel');
  var captchaInput = document.getElementById('captchaInput');

  var QUESTIONS = [
    {
      label: 'Where is Mahesh based? (Hint: momos & mountains)',
      placeholder: 'e.g. Nepal',
      check: function (val) { return val === 'nepal' || val === 'np'; }
    },
    {
      label: "What did Microsoft call him? (3 letters — you're valuable!)",
      placeholder: 'e.g. MVP',
      check: function (val) { return val === 'mvp'; }
    },
    {
      label: 'He turns 6‑month SOC 2 into ___ weeks?',
      placeholder: 'just the number',
      check: function (val) { return val === '2' || val === 'two' || val === '2 weeks' || val === 'two weeks'; }
    },
    {
      label: "What's his current company name? (Zero___)",
      placeholder: 'e.g. ZeroTB',
      check: function (val) { return val === 'zerotb' || val === 'zero tb'; }
    },
    {
      label: 'Roughly how many years of experience? (number only)',
      placeholder: 'e.g. 12',
      check: function (val) { return val === '12' || val === '12+' || val === '12 years'; }
    }
  ];

  var currentQuestionIndex = 0;

  function normalize(s) {
    return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function pickRandomQuestion() {
    currentQuestionIndex = Math.floor(Math.random() * QUESTIONS.length);
    var q = QUESTIONS[currentQuestionIndex];
    if (captchaLabel) captchaLabel.textContent = q.label;
    if (captchaInput) {
      captchaInput.placeholder = q.placeholder;
      captchaInput.value = '';
    }
  }

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (form) { form.hidden = false; form.reset(); }
    pickRandomQuestion();
    if (successEl) successEl.hidden = true;
    showError('');
    if (captchaInput) {
      captchaInput.classList.remove('error');
      captchaInput.focus();
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showError(msg) {
    if (errorEl) errorEl.textContent = msg;
    if (captchaInput) captchaInput.classList.toggle('error', !!msg);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form || !captchaInput) return;

    var val = normalize(captchaInput.value);
    var q = QUESTIONS[currentQuestionIndex];
    var ok = q && q.check(val);

    showError('');

    if (!ok) {
      showError('Nope! Scroll up and skim the page, then try again 😄');
      return;
    }

    form.hidden = true;
    if (successEl) successEl.hidden = false;
    showError('');
  }

  document.getElementById('whatsappTrigger') && document.getElementById('whatsappTrigger').addEventListener('click', openModal);
  document.getElementById('whatsappTriggerFooter') && document.getElementById('whatsappTriggerFooter').addEventListener('click', openModal);

  backdrop && backdrop.addEventListener('click', closeModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal && modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  form && form.addEventListener('submit', onSubmit);

  var link = document.getElementById('whatsappLink');
  if (link) {
    link.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=Hi%20Mahesh%2C%20I%20checked%20your%20site%20and%20had%20to%20pass%20your%20quiz%20to%20get%20here%20%F0%9F%98%82');
  }
})();
