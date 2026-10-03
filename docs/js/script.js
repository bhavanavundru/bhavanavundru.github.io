/* ==========================================================
   script.js — portfolio interactions
   ========================================================== */
(() => {
  'use strict';

  /* ---------------- CONFIG: edit these ---------------- */
  const CONFIG = {
    email: 'vundrubhavana@gmail.com',
    timeZone: 'Asia/Kolkata',   // the clock always shows this time, for every visitor
    workCount: 3,               // the small number next to "Work"
    links: {
      github:   'https://github.com/YOUR-USERNAME',
      linkedin: 'https://www.linkedin.com/in/YOUR-USERNAME',
      codepen:  'https://codepen.io/YOUR-USERNAME',
      leetcode: 'https://leetcode.com/u/YOUR-USERNAME',
      resume:   'resume.pdf',
    },
  };

  /* ---------------- Translations ---------------- */
  const I18N = {
    en: {
      'nav.time': 'Time',
      'nav.work': 'Work',
      'nav.project': 'Start a project',
      'nav.contact': 'Contact',
      'hero.l1': 'Precision like Clockwork.',
      'hero.l2': 'Ambition like an Empire',
      'about.title': 'About the dev',
      'about.text': `I'm Bhavana, a computer science student. I make digital experiences that work smoothly and have major impact. Get to know me more <a class="link-underline" data-link="resume" href="resume.pdf" target="_blank" rel="noopener">resume</a> or take a look at <a class="pill-link" href="work.html">my work</a>`,
      'stat.lc': `<a data-link="leetcode" href="#" target="_blank" rel="noopener">Leetcode</a> questions solved`,
      'stat.gh': `<a data-link="github" href="#" target="_blank" rel="noopener">GitHub</a> projects pushed`,
      'footer.end': 'This is the end of my portfolio website.',
      'footer.elsewhere': 'Elsewhere',
      'footer.resume': 'Resume',
      'footer.made': `Made with <span class="heart">♡</span> in Hyderabad`,
      'project.title': 'Start a project',
      'project.name': 'Name of project',
      'field.email': 'Email',
      'btn.send': 'Send',
      'contact.title': `Don't hesitate to contact us.`,
      'contact.purpose': 'Purpose of the request',
      'contact.p1': 'Project',
      'contact.p2': 'Reach out / Communication',
      'contact.first': 'First name',
      'contact.last': 'Last name',
      'contact.message': 'Message',
      'form.sent': 'Opening Gmail with your message — just hit send there.',
    },
    de: {
      'nav.time': 'Zeit',
      'nav.work': 'Arbeiten',
      'nav.project': 'Projekt starten',
      'nav.contact': 'Kontakt',
      'hero.l1': 'Präzision wie ein Uhrwerk.',
      'hero.l2': 'Ehrgeiz wie ein Imperium',
      'about.title': 'Über die Entwicklerin',
      'about.text': `Ich bin Bhavana, Informatikstudentin. Ich gestalte digitale Erlebnisse, die reibungslos funktionieren und große Wirkung entfalten. Lerne mich besser kennen: <a class="link-underline" data-link="resume" href="resume.pdf" target="_blank" rel="noopener">Lebenslauf</a> oder wirf einen Blick auf <a class="pill-link" href="work.html">meine Arbeiten</a>`,
      'stat.lc': `Gelöste <a data-link="leetcode" href="#" target="_blank" rel="noopener">Leetcode</a>-Aufgaben`,
      'stat.gh': `Auf <a data-link="github" href="#" target="_blank" rel="noopener">GitHub</a> veröffentlichte Projekte`,
      'footer.end': 'Das ist das Ende meiner Portfolio-Website.',
      'footer.elsewhere': 'Anderswo',
      'footer.resume': 'Lebenslauf',
      'footer.made': `Mit <span class="heart">♡</span> in Hyderabad gemacht`,
      'project.title': 'Projekt starten',
      'project.name': 'Name des Projekts',
      'field.email': 'E-Mail',
      'btn.send': 'Senden',
      'contact.title': 'Zögere nicht, uns zu kontaktieren.',
      'contact.purpose': 'Zweck der Anfrage',
      'contact.p1': 'Projekt',
      'contact.p2': 'Kontaktaufnahme / Kommunikation',
      'contact.first': 'Vorname',
      'contact.last': 'Nachname',
      'contact.message': 'Nachricht',
      'form.sent': 'Gmail wird mit deiner Nachricht geöffnet – dort nur noch auf Senden klicken.',
    },
  };

  /* ---------------- Helpers ---------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const html       = document.documentElement;
  const nav        = $('#nav');
  const stage      = $('#stage');
  const about      = $('#about');
  const aboutInner = $('#aboutInner');
  const aboutText  = $('#aboutText');
  const peek       = $('.about-peek');

  let lang = 'en';
  let words = [];
  let ticking = false;

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.en[key] || '';

  /* ---------------- Links from CONFIG ---------------- */
  function applyLinks(root = document) {
    $$('[data-link]', root).forEach((a) => {
      const url = CONFIG.links[a.dataset.link];
      if (url) a.setAttribute('href', url);
    });
  }

  /* ---------------- Word-by-word scroll reveal ---------------- */
  function splitWords() {
    const frag = document.createDocumentFragment();
    Array.from(aboutText.childNodes).forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
      } else if (node.nodeType === 1) {
        node.classList.add('w');          // links/buttons reveal as one unit
        frag.appendChild(node);
      }
    });
    aboutText.replaceChildren(frag);
    words = $$('.w', aboutText);
    if (reduceMotion) words.forEach((el) => (el.style.opacity = 1));
  }

  /* ---------------- Language ---------------- */
  function applyLang(next, persist) {
    lang = I18N[next] ? next : 'en';
    html.lang = lang;

    $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));

    applyLinks();
    splitWords();
    update();

    if (persist) {
      try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    }
  }

  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang, true)));

  /* ---------------- Clock (always your time) ---------------- */
  const clockEl = $('#clock');
  try {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: CONFIG.timeZone,
    });
    const tick = () => {
      const s = fmt.format(new Date());
      if (clockEl.textContent !== s) clockEl.textContent = s;
    };
    tick();
    setInterval(tick, 1000);
  } catch (e) {
    clockEl.hidden = true;
  }

  $('#workCount').textContent = CONFIG.workCount;

  /* ---------------- Scroll-driven visuals ---------------- */
  function update() {
    ticking = false;
    const vh = window.innerHeight;

    // 1) About takes over the hero (card widens, corners square off, hero dims)
    const r = about.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh * 0.95));
    const e = p * p * (3 - 2 * p);

    if (reduceMotion) {
      stage.style.setProperty('--p', 0);
    } else {
      stage.style.setProperty('--p', p.toFixed(3));
      about.style.setProperty('--ix', (24 * (1 - e)).toFixed(2) + 'vw');
      about.style.setProperty('--r', (56 * (1 - e)).toFixed(1) + 'px');
      peek.style.opacity = (1 - clamp(p / 0.5)).toFixed(3);
      aboutInner.style.opacity = clamp((p - 0.6) / 0.35).toFixed(3);
    }
    nav.classList.toggle('solid', p > 0.85);

    // 2) Paragraph lights up word by word as you scroll
    if (!reduceMotion && words.length) {
      const tr = aboutText.getBoundingClientRect();
      const start = vh * 0.78, end = vh * 0.22;
      const wp = clamp((start - tr.top) / (start - end));
      const n = words.length, spread = 5;
      for (let i = 0; i < n; i++) {
        const a = clamp((wp * (n + spread) - i) / spread);
        words[i].style.opacity = (0.14 + 0.86 * a).toFixed(3);
      }
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------------- Count-up numbers + reveal ---------------- */
  function countUp(el) {
    const target = Number(el.dataset.count) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1800, t0 = performance.now();
    const step = (now) => {
      const k = clamp((now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.classList.contains('stat')) countUp($('.stat-num', en.target));
        io.unobserve(en.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
    $$('.stat-num').forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------------- Infinite marquee (stays hidden while empty) ---------------- */
  const marquee = $('#marquee');
  const track = $('#marqueeTrack');
  if (track.children.length === 0) {
    marquee.hidden = true;
  } else {
    Array.from(track.children).forEach((c) => track.appendChild(c.cloneNode(true)));
  }

  /* ---------------- Slide-in panels ---------------- */
  const backdrop = $('#backdrop');
  const panels = { project: $('#panel-project'), contact: $('#panel-contact') };
  let openPanel = null;
  let lastFocus = null;

  function openSlide(name) {
    const panel = panels[name];
    if (!panel) return;
    if (openPanel) closeSlide(true);
    lastFocus = document.activeElement;
    openPanel = panel;
    $$('.form-status', panel).forEach((s) => (s.textContent = ''));
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('open');
    document.body.classList.add('lock');
    setTimeout(() => $('.panel-close', panel).focus(), 50);
  }

  function closeSlide(keepFocus) {
    if (!openPanel) return;
    openPanel.classList.remove('open');
    openPanel.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('open');
    document.body.classList.remove('lock');
    openPanel = null;
    if (!keepFocus && lastFocus) lastFocus.focus();
  }

  $$('[data-open]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    openSlide(b.dataset.open);
  }));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => closeSlide()));
  backdrop.addEventListener('click', () => closeSlide());

  document.addEventListener('keydown', (e) => {
    if (!openPanel) return;
    if (e.key === 'Escape') { closeSlide(); return; }
    if (e.key === 'Tab') {                       // keep focus inside the panel
      const f = $$('button, input, textarea, a[href]', openPanel).filter((el) => !el.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- Forms -> Gmail compose ---------------- */
  // No backend needed: "Send" opens Gmail with the message ready to go.
  const gmailUrl = (subject, body) =>
    'https://mail.google.com/mail/?view=cm&fs=1' +
    '&to=' + encodeURIComponent(CONFIG.email) +
    '&su=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);

  function handleForm(form, build) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const { subject, body } = build(d);
      window.open(gmailUrl(subject, body), '_blank', 'noopener');
      $('.form-status', form).textContent = t('form.sent');
      form.reset();
    });
  }

  handleForm($('#projectForm'), (d) => ({
    subject: 'New project: ' + d.get('project'),
    body: `Project name: ${d.get('project')}\nEmail: ${d.get('email')}\n`,
  }));

  handleForm($('#contactForm'), (d) => ({
    subject: `Portfolio contact (${d.get('purpose')}) — ${d.get('first')} ${d.get('last')}`,
    body: `Purpose: ${d.get('purpose')}\nName: ${d.get('first')} ${d.get('last')}\nEmail: ${d.get('email')}\n\n${d.get('message') || ''}`,
  }));

  /* ---------------- Init ---------------- */
  let saved = 'en';
  try { saved = localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore */ }
  applyLang(saved, false);
  update();
})();