(function () {
  'use strict';

  const form = document.getElementById('website-review-form');
  const church = form.elements.namedItem('church');
  const website = form.elements.namedItem('website');
  const email = form.elements.namedItem('email');
  const status = document.getElementById('website-review-status');
  const message = document.getElementById('website-review-message');
  const draft = document.getElementById('website-review-draft');

  church.addEventListener('input', () => church.setCustomValidity(''));
  website.addEventListener('input', () => website.setCustomValidity(''));

  form.addEventListener('input', () => {
    message.hidden = true;
    draft.value = '';
    status.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';

    const churchName = church.value.trim();
    if (!churchName) {
      church.setCustomValidity('Enter your church name.');
      church.reportValidity();
      return;
    }

    const websiteUrl = website.value.trim();
    if (!/^https?:\/\/[^/\s?#]+/i.test(websiteUrl)) {
      website.setCustomValidity('Enter a website address starting with https:// or http://.');
      website.reportValidity();
      return;
    }

    const subject = 'Free church website review';
    const body = [
      'Hi Parker,',
      '',
      'I would like a free review of our church website.',
      '',
      'Church: ' + churchName,
      'Website: ' + websiteUrl,
      'Reply email: ' + email.value.trim()
    ].join('\r\n');

    if (event.submitter?.name === 'show-message') {
      draft.value = 'To: tootiedesigns18@gmail.com\r\nSubject: ' + subject + '\r\n\r\n' + body;
      message.hidden = false;
      draft.focus();
      draft.select();
      status.textContent = 'Copy the selected text to prepare your email.';
      return;
    }

    status.textContent = 'Select Send in your email app. If it does not open, choose Show email text.';
    window.location.href = 'mailto:tootiedesigns18@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  form.hidden = false;
})();
