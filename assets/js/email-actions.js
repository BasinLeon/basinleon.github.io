(function () {
  'use strict';

  async function copyEmail(button) {
    const email = button.dataset.copyEmail || 'lbasin23@gmail.com';
    const original = button.dataset.copyLabel || button.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
      button.textContent = 'Email copied';
      button.dataset.copyState = 'done';
      window.setTimeout(function () {
        button.textContent = original;
        delete button.dataset.copyState;
      }, 2200);
    } catch (_) {
      button.textContent = email;
      window.setTimeout(function () { button.textContent = original; }, 3200);
    }
  }

  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-copy-email]');
    if (!button) return;
    copyEmail(button);
  });
}());
