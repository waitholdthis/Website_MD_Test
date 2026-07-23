/* =====================================================================
   Tootie Chat — js/tootie-chat.js
   Client-side intake assistant
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Delivery                                                           */
  /* ------------------------------------------------------------------ */
  var BUSY = false;

  /* ------------------------------------------------------------------ */
  /*  DOM refs                                                          */
  /* ------------------------------------------------------------------ */
  var toggleEls = document.querySelectorAll('[data-tootie-chat-toggle]');
  var panelEl   = document.querySelector('[data-tootie-chat-panel]');
  var messagesEl= document.querySelector('[data-tootie-chat-messages]');
  var inputEl   = document.querySelector('[data-tootie-chat-input]');
  var formEl    = document.querySelector('[data-tootie-chat-form]');
  var pillEl    = document.querySelector('[data-tootie-chat-pill]');

  var state = {
    open: false,
    step: 'greeting',
    data: {}
  };

  /* ------------------------------------------------------------------ */
  /*  Helper utilities                                                  */
  /* ------------------------------------------------------------------ */
  function ts() {
    try { return new Date().toISOString(); } catch (e) { return ''; }
  }
  function encode(v) {
    try { return encodeURIComponent(String(v)); } catch (e) { return ''; }
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  /* ------------------------------------------------------------------ */
  /*  Rendering                                                          */
  /* ------------------------------------------------------------------ */
  function addMessage(html, ctaHtml, opts) {
    opts = opts || {};
    var type = opts.type || 'bot';
    var node = messagesEl.querySelector('[data-tootie-temp]') || document.createElement('div');
    node.setAttribute('data-tootie-temp', '1');
    node.className = 'tootie-chat-bubble ' + type;
    node.innerHTML = html;

    if (ctaHtml) {
      var ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'tootie-chat-choices';
      ctaWrapper.innerHTML = ctaHtml;
      node.appendChild(ctaWrapper);
    }

    messagesEl.appendChild(node);
    node.removeAttribute('data-tootie-temp');

    var body = panelEl.querySelector('.tootie-chat-body');
    setTimeout(function () { body.scrollTop = body.scrollHeight; }, 10);
  }

  function renderGreetingReply() {
    return (
      'Thanks — I\'m Tootie Designs. Tell me about your current church site and what\'s ' +
      'frustrating you most. I\'ll give you a straight read and, if I can help, walk you ' +
      'through the right plan. No forms, no funnel, no pitch deck.' +
      '<br/><br/>Just to start: <span class="tootie-chat-strong">what\'s your church website URL?</span>'
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Step logic                                                        */
  /* ------------------------------------------------------------------ */
  var CHOICES = {
    frust_buried:   '<span class="tootie-chat-url">Giving or sermons are buried</span><br/>The site works, but something important is hard to use.',
    frust_looks:    '<span class="tootie-chat-url">It doesn\'t look like us anymore</span><br/>The design, photos, or tone are out of date.',
    frust_tech:     '<span class="tootie-chat-url">I\'m the tech person now</span><br/>A volunteer manages everything and it\'s a nightmare.',
    frust_other:    'Something else — I\'ll tell you below.'
  };

  var CHOICES_TIMELINE = {
    timeline_now:   'We\'d like to start soon.',
    timeline_soon:  'We\'re thinking over the next 1–3 months.',
    timeline_later: 'Just exploring for now.'
  };

  var CHOICES_GIVING = {
    giving_none:    'Not yet — we\'d like that built in.',
    giving_pushpay: 'Pushpay',
    giving_tithely: 'Tithe.ly',
    giving_planning:'Planning Center',
    giving_other:   'Something else — I\'ll specify below.'
  };

  function nextStep(answer) {
    state.data.answer = answer || '';
    switch (state.step) {
      case 'greeting':
        state.data.currentUrl = String(answer || '').trim() || '(not provided)';
        state.step = 'frustration';
        addBot('What\'s the biggest frustration with it right now?', choiceHtml(CHOICES));
        return;
      case 'frustration':
        if (CHOICES[answer]) {
          state.data.biggestFrustration = CHOICES[answer].replace(/<[^>]+>/g, '').replace(/\s+/g,' ').trim();
        } else {
          state.data.biggestFrustration = String(answer || '').trim();
        }
        state.step = 'timeline';
        addBot('When would you ideally like this sorted?', choiceHtml(CHOICES_TIMELINE));
        return;
      case 'timeline':
        state.data.timeline = CHOICES_TIMELINE[answer] ? CHOICES_TIMELINE[answer] : String(answer || '').trim();
        state.step = 'giving';
        addBot('Do you have an online giving tool already?', choiceHtml(CHOICES_GIVING));
        return;
      case 'giving':
        state.data.givingTool = CHOICES_GIVING[answer] ? CHOICES_GIVING[answer] : String(answer || '').trim();
        state.step = 'name';
        addBot('Great. Drop your name and the church/school name, and I\'ll send your review to the team.');
        return;
      case 'name':
        state.data.name = String(answer || '').trim();
        state.step = 'email';
        addBot('What’s the best email address to reply to?');
        return;
      case 'email':
        state.data.email = String(answer || '').trim();
        state.step = 'phone';
        addBot('Any phone number to reach you? You can skip this.');
        return;
      case 'phone':
        state.data.phone = String(answer || '').trim();
        finish();
        return;
    }
  }

  function finish() {
    var d = state.data;
    BUSY = true;
    setBusy(true);

    var label =
      'Thanks, ' + escapeHtml((d.name || '').split(' ')[0] || 'friend') +
      '. I\'m sending your site review now — ‘<span class="tootie-chat-url">' + escapeHtml(d.currentUrl || 'your site') + '</span>’ —';

    if (d.timeline && d.timeline.toLowerCase().indexOf('now') !== -1) {
      label += ' and from your note this sounds like something you want to tackle soon.';
    } else if (d.timeline && d.timeline.toLowerCase().indexOf('explor') !== -1) {
      label += ' no problem if it\'s still early days.';
    } else {
      label += ' perfect timing.';
    }

    label += '<br/><br/>We review sites once the form lands here, and we\'ll reply from <strong>tootiedesigns18@gmail.com</strong> or your call.';

    addBot(label + '<br/><br/>If you want, you can also <a class="link-mono" href="#contact">visit the contact section</a>.');
    submitForm(d);
    returnToStart();
  }

  function returnToStart() {
    setTimeout(function () {
      BUSY = false;
      state.step = 'greeting';
      state.data = {};
      setBusy(false);
    }, 1800);
  }

  function suggestBestTime() {
    try {
      var h = new Date().getHours();
      if (h < 12) return 'This morning';
      if (h < 17) return 'This afternoon';
      return 'This evening';
    } catch (e) {
      return 'Soon';
    }
  }

  function buildMailto(d) {
    var subject = 'New church site review request';
    var body =
      'Timestamp: ' + (d.timestamp || new Date().toISOString()) + '\n' +
      'Current site: ' + (d.currentUrl || 'not provided') + '\n' +
      'Biggest frustration: ' + (d.biggestFrustration || 'not provided') + '\n' +
      'Timeline: ' + (d.timeline || 'not provided') + '\n' +
      'Giving/tooling: ' + (d.givingTool || 'not provided') + '\n' +
      'Name/church: ' + (d.name || 'not provided') + '\n' +
      'Email: ' + (d.email || 'not provided') + '\n' +
      'Phone: ' + (d.phone || 'not provided') + '\n';

    var encodedSubject = encodeURIComponent(subject);
    var encodedBody = encodeURIComponent(body);
    return 'mailto:tootiedesigns18@gmail.com?subject=' + encodedSubject + '&body=' + encodedBody;
  }

  /* ------------------------------------------------------------------ */
  /*  Google Forms submit                                                */
  /* ------------------------------------------------------------------ */
  function submitForm(d) {
    var missing = [];
    if (!d.currentUrl) missing.push('website URL');
    if (!d.biggestFrustration) missing.push('biggest frustration');
    if (!d.timeline) missing.push('timeline');
    if (!d.givingTool) missing.push('giving tool preference');
    if (!d.name) missing.push('name');
    if (!d.email) missing.push('email');

    if (missing.length) {
      addBot('I missed a couple of details — ' + missing.join(', ') + ' — but I\'ll still send what I have.');
    }

    var mailto = buildMailto(d);
    var ok = false;
    try {
      ok = window.location.href = mailto;
    } catch (e) {
      ok = false;
    }

    if (!ok) {
      addBot(
        'Your email app didn\'t open. Please send your answers to ' +
        '<strong>tootiedesigns18@gmail.com</strong> and we\'ll reply straight back.'
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /*  UI helpers                                                        */
  /* ------------------------------------------------------------------ */
  function addBot(text) {
    addMessage(text, null, { type: 'bot' });
  }

  function addUser(text) {
    addMessage(escapeHtml(text), null, { type: 'user' });
  }

  function choiceHtml(choices) {
    var items = [];
    var keys = Object.keys(choices);
    keys.forEach(function (k) {
      items.push('<button class="tootie-chat-choice" type="button" data-tc-choice="' + escapeHtml(k) + '">' + choices[k] + '</button>');
    });
    return items.join('');
  }

  function setBusy(busy) {
    if (!inputEl) return;
    inputEl.disabled = busy;
    var sendBtn = formEl ? formEl.querySelector('.tootie-chat-send') : null;
    if (sendBtn) sendBtn.disabled = busy;
    if (busy) inputEl.removeAttribute('placeholder');
    else inputEl.placeholder = 'Type your answer...';
  }

  function startConversation() {
    openPanel();
    addBot(renderGreetingReply());
    state.step = 'greeting';
    state.data = {};
    setBusy(false);
    if (inputEl) setTimeout(function () { inputEl.focus(); }, 180);
  }

  /* ------------------------------------------------------------------ */
  /*  Open / close                                                      */
  /* ------------------------------------------------------------------ */
  function openPanel() {
    if (!panelEl) return;
    state.open = true;
    panelEl.classList.add('is-open');
    if (pillEl) {
      pillEl.classList.add('is-hidden');
      setTimeout(function () {
        if (!state.open) pillEl.classList.remove('is-hidden');
      }, 400);
    }
    if (isMobile()) {
      try { panelEl.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch (e) {}
    }
  }

  function closePanel() {
    if (!panelEl) return;
    state.open = false;
    panelEl.classList.remove('is-open');
    if (pillEl) setTimeout(function () { pillEl.classList.remove('is-hidden'); }, 220);
  }

  /* ------------------------------------------------------------------ */
  /*  Event wiring                                                       */
  /* ------------------------------------------------------------------ */
  toggleEls.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state.open && state.step !== 'greeting') {
        closePanel();
      } else if (messagesEl && messagesEl.children.length === 0) {
        startConversation();
      } else if (state.step === 'greeting') {
        openPanel();
      } else {
        closePanel();
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!state.open) return;
    var target = e.target;
    var within = target.closest('.tootie-chat-panel, .tootie-chat-launcher');
    if (!within) {
      closePanel();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!state.open) return;
    if (e.key === 'Escape') {
      closePanel();
      var toggle = document.querySelector('[data-tootie-chat-toggle]');
      if (toggle) toggle.focus();
    }
  });

  if (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (BUSY) return;
      var text = (inputEl && inputEl.value || '').trim();
      if (!text) return;

      addUser(escapeHtml(text));
      if (inputEl) inputEl.value = '';
      nextStep(text);

      if (state.step !== 'phone') {
        setTimeout(function () {
          if (inputEl) inputEl.focus();
        }, 220);
      }
    });
  }

  document.querySelector('[data-tootie-chat-messages]').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tc-choice]');
    if (!btn || BUSY) return;
    var key = btn.getAttribute('data-tc-choice');
    if (!key) return;

    var choiceText = btn.textContent || key;
    addUser(choiceText);
    nextStep(key);

    if (state.step !== 'phone') {
      setTimeout(function () {
        if (inputEl) inputEl.focus();
      }, 220);
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Improved delayed pill reveal on page load                         */
  /* ------------------------------------------------------------------ */
  setTimeout(function () {
    if (!state.open && pillEl && !isMobile()) {
      pillEl.classList.remove('is-hidden');
    }
  }, 1800);

})();
