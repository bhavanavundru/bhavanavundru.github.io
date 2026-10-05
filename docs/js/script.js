/* ==========================================================
   script.js — portfolio interactions
   ========================================================== */

(() => {

  'use strict';


  console.log(
    '%cAh, Yes.\nWelcome behind the pixels.\nThere are no fancy animations here.\nNo polished UI.\nJust code, secrets,\nand several decisions I refuse to explain.\nYou are now part of a very exclusive club\nconsisting entirely of people who press F12.\nMembership benefits:\n• absolutely nothing\n• mild developer superiority\n• permission to judge my variable names\n\nEnjoy your stay.',
    'color:#c8adff;background:#10091d;padding:12px 16px;border-left:3px solid #b794ff;font:500 13px/1.6 monospace;border-radius:4px'
  );


  /* =========================================================
     CONFIG
     Edit these values when needed
     ========================================================= */

  const CONFIG = {

    email:
      'vundrubhavana@gmail.com',

    timeZone:
      'Asia/Kolkata',

    workCount:
      3,

    links: {

      github:
        'https://github.com/bhavanavundru',

      linkedin:
        'https://www.linkedin.com/in/bhavana-vundru-241b35316',

      codepen:
        'https://codepen.io/Bhavana-Vundru',

      leetcode:
        'https://leetcode.com/u/bhavanavundru/',

      resume:
        'Bhavana_Vundru_Resume.pdf',

    },

  };


  /* =========================================================
     TRANSLATIONS
     ========================================================= */

  const I18N = {

    en: {

      'page.title':
        'Bhavana — Portfolio',

      'nav.work':
        'Work',

      'nav.project':
        'Start a project',

      'nav.contact':
        'Contact',

      'nav.myWork':
        'My Work',

      'aria.main':
        'Main navigation',

      'aria.menu':
        'Selected projects',

      'aria.work':
        'Work, selected projects',

      'aria.language':
        'Language',

      'a11y.scroll':
        'Scroll down',

      'a11y.close':
        'Close',

      'skills.open':
        'Open skills panel',

      'skills.close':
        'Close skills panel',

      'skills.title':
        'Skills unlocked',

      'hero.l1':
        'Precision like Clockwork.',

      'hero.l2':
        'Ambition like an Empire',

      'about.title':
        'About the dev',

      'about.intro':
        "I'm Bhavana, a computer science student. I make digital experiences that work smoothly and have major impact.",

      'about.resume':
        'Get to know me more — <a class="link-underline" data-link="resume" href="#" target="_blank" rel="noopener">Resume</a>',

      'about.work':
        'or look at <a class="pill-link" href="#projects">My Work</a>',

      'projects.eyebrow':
        'Selected work',

      'projects.title':
        "Things I've built.",

      'project.football':
        'Football Analyser',

      'project.medical':
        'Medical Training Simulator',

      'project.card':
        'Virtual Card Holder',

      'project.typeFootball':
        'Data · Analysis',

      'project.typeMedical':
        'Simulation · Interactive',

      'project.typeCard':
        'Web · Product',

      'about.text':
        `I'm Bhavana, a computer science student. I make digital experiences that work smoothly and have major impact. <span class="about-cta-line">Get to know me more — <a class="link-underline" data-link="resume" href="resume.pdf" target="_blank" rel="noopener">Resume</a></span><span class="about-cta-line">or look at <a class="pill-link" href="#projects">My Work</a></span>`,

      'stat.lc':
        `<a data-link="leetcode" href="#" target="_blank" rel="noopener">Leetcode</a> questions solved`,

      'stat.gh':
        `<a data-link="github" href="#" target="_blank" rel="noopener">GitHub</a> projects pushed`,

      'footer.elsewhere':
        'ELSEWHERE',

      'footer.kicker':
        'Open to ideas, collaborations and interesting builds.',

      'footer.idea':
        'Have an idea?',

      'footer.cta':
        "Let's make it real",

      'social.github':
        'GitHub',

      'social.linkedin':
        'LinkedIn',

      'social.codepen':
        'CodePen',

      'footer.resume':
        'Resume',

      'footer.made':
        `Made with <span class="heart">♡</span> in Hyderabad`,

      'project.title':
        'Start a project',

      'project.name':
        'Name of project',

      'field.email':
        'Email',

      'btn.send':
        'Send',

      'contact.title':
        `Don't hesitate to contact us.`,

      'contact.purpose':
        'Purpose of the request',

      'contact.p1':
        'Project',

      'contact.p2':
        'Reach out / Communication',

      'contact.first':
        'First name',

      'contact.last':
        'Last name',

      'contact.message':
        'Message',

      'form.sending':
        'Sending your message…',

      'form.sent':
        'Your message has been sent.',

      'form.error':
        'Your message could not be sent. Please try again.',

    },


    de: {

      'page.title':
        'Bhavana — Portfolio',

      'nav.work':
        'Arbeiten',

      'nav.project':
        'Projekt starten',

      'nav.contact':
        'Kontakt',

      'nav.myWork':
        'Meine Arbeit',

      'aria.main':
        'Hauptnavigation',

      'aria.menu':
        'Ausgewählte Projekte',

      'aria.work':
        'Projekte und ausgewählte Arbeiten',

      'aria.language':
        'Sprache',

      'a11y.scroll':
        'Nach unten scrollen',

      'a11y.close':
        'Schließen',

      'skills.open':
        'Technologien anzeigen',

      'skills.close':
        'Technologien schließen',

      'skills.title':
        'Freigeschaltete Skills',

      'hero.l1':
        'Präzision wie ein Uhrwerk.',

      'hero.l2':
        'Ehrgeiz wie ein Imperium',

      'about.title':
        'Über die Entwicklerin',

      'about.intro':
        'Ich bin Bhavana, Informatikstudentin. Ich entwickle digitale Erlebnisse, die reibungslos funktionieren und viel bewirken.',

      'about.resume':
        'Lerne mich besser kennen — <a class="link-underline" data-link="resume" href="#" target="_blank" rel="noopener">Lebenslauf</a>',

      'about.work':
        'oder entdecke <a class="pill-link" href="#projects">meine Projekte</a>',

      'projects.eyebrow':
        'Ausgewählte Projekte',

      'projects.title':
        'Das habe ich entwickelt.',

      'project.football':
        'Fußballanalyse',

      'project.medical':
        'Medizinischer Trainingssimulator',

      'project.card':
        'Virtuelle Kartenmappe',

      'project.typeFootball':
        'Daten · Analyse',

      'project.typeMedical':
        'Simulation · Interaktiv',

      'project.typeCard':
        'Web · Produkt',

      'about.text':
        `Ich bin Bhavana, Informatikstudentin. Ich gestalte digitale Erlebnisse, die reibungslos funktionieren und große Wirkung entfalten. <span class="about-cta-line">Lerne mich besser kennen — <a class="link-underline" data-link="resume" href="resume.pdf" target="_blank" rel="noopener">Lebenslauf</a></span><span class="about-cta-line">oder sieh dir <a class="pill-link" href="#projects">meine Arbeiten</a> an</span>`,

      'stat.lc':
        `Gelöste <a data-link="leetcode" href="#" target="_blank" rel="noopener">Leetcode</a>-Aufgaben`,

      'stat.gh':
        `Auf <a data-link="github" href="#" target="_blank" rel="noopener">GitHub</a> veröffentlichte Projekte`,

      'footer.elsewhere':
        'WEITERE LINKS',

      'footer.kicker':
        'Offen für Ideen, Zusammenarbeit und spannende Projekte.',

      'footer.idea':
        'Eine Idee?',

      'footer.cta':
        'Machen wir sie wahr',

      'social.github':
        'GitHub',

      'social.linkedin':
        'LinkedIn',

      'social.codepen':
        'CodePen',

      'footer.resume':
        'Lebenslauf',

      'footer.made':
        `Mit <span class="heart">♡</span> in Hyderabad gemacht`,

      'project.title':
        'Projekt starten',

      'project.name':
        'Name des Projekts',

      'field.email':
        'E-Mail',

      'btn.send':
        'Senden',

      'contact.title':
        'Zögere nicht, mich zu kontaktieren.',

      'contact.purpose':
        'Zweck der Anfrage',

      'contact.p1':
        'Projekt',

      'contact.p2':
        'Kontaktaufnahme / Kommunikation',

      'contact.first':
        'Vorname',

      'contact.last':
        'Nachname',

      'contact.message':
        'Nachricht',

      'form.sending':
        'Nachricht wird gesendet…',

      'form.sent':
        'Deine Nachricht wurde gesendet.',

      'form.error':
        'Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.',

    },

  };


  /* =========================================================
     CONTACT PROMPTS
     ========================================================= */

  const CONTACT_PROMPTS = {

    en: [

      'Fill this out to get in touch.',

      "Tell me what's on your mind.",

      "Let's start a conversation.",

      "Have a project in mind? Let's talk.",

    ],


    de: [

      'Fülle das Formular aus, um mich zu erreichen.',

      'Was liegt dir auf dem Herzen?',

      'Lass uns ins Gespräch kommen.',

      'Du hast ein Projekt im Kopf? Lass uns reden.',

    ],

  };


  /* =========================================================
     PROJECT DATA

     This powers project.html.

     You can edit the text here later without creating
     separate HTML files for every project.
     ========================================================= */

  const PROJECTS = {


    /* ---------------------------------------------------------
       FOOTBALL ANALYSER
       --------------------------------------------------------- */

    'football-analyser': {

      title:
        'Football Analyser',

      lead:
        'A football analysis project designed to transform match and player data into clear, useful insights.',

      type:
        'Data Analysis',

      role:
        'Developer',

      year:
        '2026',

      overview:
        'Football Analyser is a project focused on analysing football information and presenting it in a way that is easier to understand. Replace this paragraph with the real purpose of your project, the problem you wanted to solve, and who the application is intended for.',

      built:
        'Describe what you actually built here. You can talk about match statistics, player analysis, data processing, visualisations, APIs, algorithms, predictions, filters, the user interface, database structure, or other important implementation details.',

      tags: [

        'Python',

        'Data Analysis',

        'Web Development',

      ],

      outcome:
        'Describe what the finished project achieved, what you learned while developing it, and what you would improve or add in a future version.',

      next:
        'medical-training-simulator',

    },


    /* ---------------------------------------------------------
       MEDICAL TRAINING SIMULATOR
       --------------------------------------------------------- */

    'medical-training-simulator': {

      title:
        'Medical Training Simulator',

      lead:
        'An interactive simulation project exploring how technology can support practical medical training.',

      type:
        'Interactive Simulation',

      role:
        'Developer',

      year:
        '2026',

      overview:
        'The Medical Training Simulator is an interactive project designed around digital training experiences. Replace this paragraph with the real purpose of the simulator, the medical scenario it covers, and the users it was created for.',

      built:
        'Explain the simulator here. You can describe interaction logic, medical scenarios, user feedback, scoring, 3D environments, AR or VR functionality, training workflows, interface design, or the technical architecture behind the application.',

      tags: [

        'Simulation',

        'Interactive Design',

        'Computer Science',

      ],

      outcome:
        'Explain what you achieved with the simulator, what you learned while developing it, and what functionality you would like to add in a future version.',

      next:
        'virtual-card-holder',

    },


    /* ---------------------------------------------------------
       VIRTUAL CARD HOLDER
       --------------------------------------------------------- */

    'virtual-card-holder': {

      title:
        'Virtual Card Holder',

      lead:
        'A digital card management concept built around a clean interface and simple access to important cards.',

      type:
        'Web Application',

      role:
        'Developer',

      year:
        '2026',

      overview:
        'Virtual Card Holder is a project focused on storing and accessing cards digitally. Replace this paragraph with the actual problem your application solves, who it is intended for, and what motivated you to create it.',

      built:
        'Describe the functionality you implemented here, such as adding cards, editing information, categories, search, authentication, storage, responsive design, security considerations, animations, or other important technical decisions.',

      tags: [

        'JavaScript',

        'UI / UX',

        'Web Application',

      ],

      outcome:
        'Explain the final result, what you learned while building the project, and which improvements or features you would introduce in a future version.',

      next:
        'football-analyser',

    },

  };


  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (
    selector,
    root = document
  ) => {

    return root.querySelector(
      selector
    );

  };


  const $$ = (
    selector,
    root = document
  ) => {

    return Array.from(

      root.querySelectorAll(
        selector
      )

    );

  };


  const clamp = (
    value,
    minimum = 0,
    maximum = 1
  ) => {

    return Math.min(

      maximum,

      Math.max(
        minimum,
        value
      )

    );

  };


  const reduceMotion =

    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  const html =
    document.documentElement;


  const nav =
    $('#nav');


  const stage =
    $('#stage');


  const about =
    $('#about');


  const aboutInner =
    $('#aboutInner');


  const aboutText =
    $('#aboutText');


  const peek =
    $('.about-peek');


  let lang =
    'en';


  let words =
    [];


  let ticking =
    false;


  let lastScrollY =
    window.scrollY;


  let contactPromptIndex =
    -1;


  const t = (
    key
  ) => {

    return (

      I18N[lang] &&
      I18N[lang][key]

    ) ||

    I18N.en[key] ||

    '';

  };


  /* =========================================================
     LINKS FROM CONFIG
     ========================================================= */

  function applyLinks(
    root = document
  ) {

    $$(
      '[data-link]',
      root
    ).forEach(

      anchor => {

        const url =

          CONFIG.links[
            anchor.dataset.link
          ];


        if (url) {

          anchor.setAttribute(
            'href',
            url
          );

        }

      }

    );

  }


  /* =========================================================
     WORD-BY-WORD ABOUT REVEAL
     ========================================================= */

  function splitWords() {


    /*
      project.html does not have #aboutText,
      so simply do nothing there.
    */


    if (!aboutText) {

      words = [];

      return;

    }


    const fragment =

      document.createDocumentFragment();


    Array.from(
      aboutText.childNodes
    ).forEach(

      node => {


        if (
          node.nodeType === 3
        ) {


          node.textContent

            .split(
              /(\s+)/
            )

            .forEach(

              part => {


                if (!part) {

                  return;

                }


                if (
                  /^\s+$/.test(
                    part
                  )
                ) {


                  fragment.appendChild(

                    document.createTextNode(
                      ' '
                    )

                  );


                }
                else {


                  const span =

                    document.createElement(
                      'span'
                    );


                  span.className =
                    'w';


                  span.textContent =
                    part;


                  fragment.appendChild(
                    span
                  );


                }

              }

            );


        }
        else if (
          node.nodeType === 1
        ) {


          /*
            Links and CTA elements reveal as one unit.
          */


          node.classList.add(
            'w'
          );


          fragment.appendChild(
            node
          );


        }


      }

    );


    aboutText.replaceChildren(
      fragment
    );


    words =

      $$(
        '.w',
        aboutText
      );


    if (
      reduceMotion
    ) {


      words.forEach(

        element => {

          element.style.opacity =
            1;

        }

      );


    }


  }


  /* =========================================================
     LANGUAGE
     ========================================================= */

  function applyLang(
    next,
    persist
  ) {


    lang =

      I18N[next]
        ? next
        : 'en';


    html.lang =
      lang;


    $$(
      '[data-i18n]'
    ).forEach(

      element => {


        element.innerHTML =

          t(
            element.dataset.i18n
          );


      }

    );


    $$('[data-i18n-aria-label]').forEach(
      element => {
        element.setAttribute(
          'aria-label',
          t(element.dataset.i18nAriaLabel)
        );
      }
    );


    $$(
      '[data-lang]'
    ).forEach(

      button => {


        button.setAttribute(

          'aria-pressed',

          String(
            button.dataset.lang ===
            lang
          )

        );


      }

    );


    applyLinks();


    /*
      Only split words when the About paragraph exists.
    */


    splitWords();


    /*
      Update random contact heading if the panel exists.
    */


    if (
      panels.contact &&
      openPanel === panels.contact &&
      contactPromptIndex >= 0
    ) {


      const contactTitle =

        $('#contact-title');


      if (contactTitle) {


        contactTitle.textContent =

          CONTACT_PROMPTS[
            lang
          ][
            contactPromptIndex
          ];


      }


    }


    update();


    if (persist) {


      try {


        localStorage.setItem(
          'lang',
          lang
        );


      }
      catch (error) {

        /*
          Ignore unavailable localStorage.
        */

      }


    }


  }


  $$(
    '[data-lang]'
  ).forEach(

    button => {


      button.addEventListener(

        'click',

        () => {


          applyLang(

            button.dataset.lang,

            true

          );


        }

      );


    }

  );


  /* =========================================================
     WORK MEGA MENU
     ========================================================= */

  const workMenuWrap =

    $('.work-menu-wrap');


  const workLink =

    $('.work-link');


  const skillsToggle =
    $('#skillsToggle');


  const skillsPanel =
    $('#skillsPanel');


  const skillsClose =
    $('#skillsClose');


  if (skillsToggle && skillsPanel) {

    const setSkillsOpen = isOpen => {
      skillsPanel.classList.toggle('is-open', isOpen);
      skillsPanel.setAttribute('aria-hidden', String(!isOpen));
      skillsPanel.toggleAttribute('inert', !isOpen);
      skillsToggle.setAttribute('aria-expanded', String(isOpen));
      skillsToggle.setAttribute(
        'aria-label',
        t(isOpen ? 'skills.close' : 'skills.open')
      );
    };

    skillsToggle.addEventListener('click', () => {
      setSkillsOpen(true);
    });

    skillsClose.addEventListener('click', () => {
      setSkillsOpen(false);
      skillsToggle.focus();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && skillsPanel.classList.contains('is-open')) {
        setSkillsOpen(false);
        skillsToggle.focus();
      }
    });
  }


  if (
    window.matchMedia('(pointer: fine)').matches &&
    !reduceMotion
  ) {
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    customCursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(customCursor);
    document.body.classList.add('custom-cursor-enabled');

    document.addEventListener('pointermove', event => {
      customCursor.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      customCursor.classList.add('is-visible');
    }, { passive: true });

    document.addEventListener('pointerover', event => {
      customCursor.classList.toggle(
        'is-hovering',
        Boolean(event.target.closest('a, button, input, textarea, select, [role="button"]'))
      );
    });

    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) {
        customCursor.classList.remove('is-visible', 'is-hovering');
      }
    });

    window.addEventListener('blur', () => {
      customCursor.classList.remove('is-visible', 'is-hovering');
    });
  }


  let workMenuCloseTimer =
    0;


  function scheduleWorkMenuClose() {

    window.clearTimeout(
      workMenuCloseTimer
    );

    workMenuCloseTimer = window.setTimeout(
      () => setWorkMenuOpen(false),
      180
    );

  }


  function setWorkMenuOpen(
    isOpen
  ) {


    if (
      !workMenuWrap ||
      !workLink
    ) {

      return;

    }


    window.clearTimeout(
      workMenuCloseTimer
    );


    workMenuWrap.classList.toggle(

      'is-open',

      isOpen

    );


    if (nav) {


      nav.classList.toggle(

        'menu-open',

        isOpen

      );


    }


    workLink.setAttribute(

      'aria-expanded',

      String(
        isOpen
      )

    );


  }


  if (
    workMenuWrap &&
    workLink
  ) {


    /*
      Mouse hover.
    */


    workMenuWrap.addEventListener(

      'pointerenter',

      () => {

        window.clearTimeout(
          workMenuCloseTimer
        );

        setWorkMenuOpen(
          true
        );

      }

    );


    workMenuWrap.addEventListener(

      'pointerleave',

      () => {

        scheduleWorkMenuClose();

      }

    );


    $('#workMegaMenu').addEventListener(
      'pointerenter',
      () => window.clearTimeout(workMenuCloseTimer)
    );


    $('#workMegaMenu').addEventListener(
      'pointerleave',
      scheduleWorkMenuClose
    );


    /*
      Keyboard navigation.
    */


    workMenuWrap.addEventListener(

      'focusin',

      () => {

        setWorkMenuOpen(
          true
        );

      }

    );


    workMenuWrap.addEventListener(

      'focusout',

      event => {


        if (

          !workMenuWrap.contains(
            event.relatedTarget
          )

        ) {


          setWorkMenuOpen(
            false
          );


        }


      }

    );


    /*
      Clicking WORK itself toggles the menu.
    */


    workLink.addEventListener(

      'click',

      event => {


        /*
          If WORK is a button this prevents
          unwanted default behaviour.

          If you later turn it into a link,
          this keeps the dropdown behaviour.
        */


        event.preventDefault();


        setWorkMenuOpen(
          true
        );


      }

    );


  }


  /*
    Click outside → close Work menu.
  */


  document.addEventListener(

    'click',

    event => {


      if (
        !workMenuWrap
      ) {

        return;

      }


      if (

        !workMenuWrap.contains(
          event.target
        )

      ) {


        setWorkMenuOpen(
          false
        );


      }


    }

  );


  /* =========================================================
     CLOCK
     ========================================================= */

  const clockEl =
    $('#clock');


  if (clockEl) {


    try {


      const formatter =

        new Intl.DateTimeFormat(

          'en-GB',

          {

            hour:
              '2-digit',

            minute:
              '2-digit',

            hourCycle:
              'h23',

            timeZone:
              CONFIG.timeZone,

          }

        );


      const tick = () => {


        const value =

          formatter.format(
            new Date()
          );


        if (
          clockEl.textContent !==
          value
        ) {


          clockEl.textContent =
            value;


        }


      };


      tick();


      setInterval(
        tick,
        1000
      );


    }
    catch (error) {


      clockEl.hidden =
        true;


    }


  }


  /* =========================================================
     WORK COUNT
     ========================================================= */

  const workCountElement =
    $('#workCount');


  if (
    workCountElement
  ) {


    workCountElement.textContent =

      CONFIG.workCount;


  }


  /* =========================================================
     SCROLL-DRIVEN HOMEPAGE VISUALS
     ========================================================= */

  function update() {


    ticking =
      false;


    /*
      None of this should run on project.html.
    */


    if (
      !stage ||
      !about
    ) {


      if (nav) {


        nav.classList.add(
          'solid'
        );


      }


      return;

    }


    const viewportHeight =

      window.innerHeight;


    /*
      ---------------------------------------------------------
      1. ABOUT TAKES OVER HERO
      ---------------------------------------------------------
    */


    const rect =

      about.getBoundingClientRect();


    const progress =

      clamp(

        (
          viewportHeight -
          rect.top
        ) /

        (
          viewportHeight *
          .95
        )

      );


    const easedProgress =

      progress *

      progress *

      (
        3 -
        2 * progress
      );


    if (
      reduceMotion
    ) {


      stage.style.setProperty(

        '--p',

        0

      );


    }
    else {


      stage.style.setProperty(

        '--p',

        progress.toFixed(
          3
        )

      );


      about.style.setProperty(

        '--ix',

        (
          24 *
          (
            1 -
            easedProgress
          )
        ).toFixed(
          2
        ) +
        'vw'

      );


      about.style.setProperty(

        '--r',

        (
          56 *
          (
            1 -
            easedProgress
          )
        ).toFixed(
          1
        ) +
        'px'

      );


      if (peek) {


        peek.style.opacity =

          (
            1 -
            clamp(
              progress /
              .5
            )
          ).toFixed(
            3
          );


      }


      if (aboutInner) {


        aboutInner.style.opacity =

          clamp(

            (
              progress -
              .6
            ) /
            .35

          ).toFixed(
            3
          );


      }


    }


    if (nav) {


      nav.classList.toggle(

        'solid',

        progress >
        .85

      );


    }


    /*
      ---------------------------------------------------------
      2. ABOUT PARAGRAPH WORD REVEAL
      ---------------------------------------------------------
    */


    if (

      !reduceMotion &&
      words.length &&
      aboutText

    ) {


      const textRect =

        aboutText.getBoundingClientRect();


      const start =

        viewportHeight *
        .78;


      const end =

        viewportHeight *
        .22;


      const wordProgress =

        clamp(

          (
            start -
            textRect.top
          ) /

          (
            start -
            end
          )

        );


      const numberOfWords =

        words.length;


      const spread =
        5;


      for (
        let index = 0;
        index < numberOfWords;
        index++
      ) {


        const amount =

          clamp(

            (
              wordProgress *

              (
                numberOfWords +
                spread
              ) -

              index

            ) /

            spread

          );


        words[index].style.opacity =

          (
            .14 +
            .86 *
            amount
          ).toFixed(
            3
          );


      }


    }


  }


  function onScroll() {


    const currentY =

      window.scrollY;


    if (nav) {


      if (

        currentY <=
        100 ||

        currentY <
        lastScrollY -
        4

      ) {


        nav.classList.remove(
          'nav-hidden'
        );


      }
      else if (

        currentY >
        lastScrollY +
        1

      ) {


        nav.classList.add(
          'nav-hidden'
        );


      }


    }


    lastScrollY =
      currentY;


    if (
      !ticking
    ) {


      ticking =
        true;


      requestAnimationFrame(
        update
      );


    }


  }


  window.addEventListener(
    'pointermove',
    event => {
      if (nav && event.clientY <= 8) {
        nav.classList.remove('nav-hidden');
        lastScrollY = window.scrollY;
      }
    },
    { passive: true }
  );


  window.addEventListener(

    'scroll',

    onScroll,

    {
      passive: true
    }

  );


  window.addEventListener(

    'resize',

    onScroll

  );


  /* =========================================================
     COUNT-UP NUMBERS
     ========================================================= */

  function countUp(
    element
  ) {


    if (!element) {

      return;

    }


    const target =

      Number(
        element.dataset.count
      ) ||

      0;


    if (
      reduceMotion
    ) {


      element.textContent =
        target;


      return;

    }


    const duration =
      1800;


    const startTime =

      performance.now();


    const step = (
      now
    ) => {


      const progress =

        clamp(

          (
            now -
            startTime
          ) /

          duration

        );


      element.textContent =

        Math.round(

          target *

          (
            1 -

            Math.pow(

              1 -
              progress,

              3

            )

          )

        );


      if (
        progress <
        1
      ) {


        requestAnimationFrame(
          step
        );


      }


    };


    requestAnimationFrame(
      step
    );


  }


  /* =========================================================
     REVEAL OBSERVER
     ========================================================= */

  if (
    'IntersectionObserver'
    in
    window
  ) {


    const observer =

      new IntersectionObserver(

        entries => {


          entries.forEach(

            entry => {


              if (
                !entry.isIntersecting
              ) {


                return;

              }


              entry.target.classList.add(
                'in'
              );


              if (

                entry.target.classList.contains(
                  'stat'
                )

              ) {


                countUp(

                  $(
                    '.stat-num',
                    entry.target
                  )

                );


              }


              observer.unobserve(
                entry.target
              );


            }

          );


        },

        {

          threshold:
            .2,

          rootMargin:
            '0px 0px -8% 0px',

        }

      );


    $$(
      '.reveal'
    ).forEach(

      element => {

        observer.observe(
          element
        );

      }

    );


  }
  else {


    $$(
      '.reveal'
    ).forEach(

      element => {

        element.classList.add(
          'in'
        );

      }

    );


    $$(
      '.stat-num'
    ).forEach(

      element => {

        element.textContent =

          element.dataset.count;

      }

    );


  }


  /* =========================================================
     INFINITE MARQUEE
     ========================================================= */

  const marquee =
    $('#marquee');


  const track =
    $('#marqueeTrack');


  if (
    marquee &&
    track
  ) {


    if (
      track.children.length ===
      0
    ) {


      marquee.hidden =
        true;


    }
    else {


      Array.from(
        track.children
      ).forEach(

        child => {


          track.appendChild(

            child.cloneNode(
              true
            )

          );


        }

      );


    }


  }


  /* =========================================================
     SLIDE-IN PANELS
     ========================================================= */

  const backdrop =
    $('#backdrop');


  const panels = {

    project:
      $('#panel-project'),

    contact:
      $('#panel-contact'),

  };


  let openPanel =
    null;


  let lastFocus =
    null;


  function openSlide(
    name
  ) {


    const panel =

      panels[name];


    if (!panel) {

      return;

    }


    if (openPanel) {


      closeSlide(
        true
      );


    }


    lastFocus =

      document.activeElement;


    openPanel =
      panel;


    /*
      Random contact heading.
    */


    if (
      name ===
      'contact'
    ) {


      const prompts =

        CONTACT_PROMPTS[
          lang
        ];


      const availableIndexes =

        prompts

          .map(
            (
              unused,
              index
            ) => index
          )

          .filter(

            index =>

              index !==
              contactPromptIndex

          );


      contactPromptIndex =

        availableIndexes[

          Math.floor(

            Math.random() *

            availableIndexes.length

          )

        ];


      const contactTitle =

        $('#contact-title');


      if (contactTitle) {


        contactTitle.textContent =

          prompts[
            contactPromptIndex
          ];


      }


    }


    $$(
      '.form-status',
      panel
    ).forEach(

      status => {

        status.textContent =
          '';

      }

    );


    panel.classList.add(
      'open'
    );


    panel.setAttribute(

      'aria-hidden',

      'false'

    );


    if (backdrop) {


      backdrop.classList.add(
        'open'
      );


    }


    document.body.classList.add(
      'lock'
    );


    setTimeout(

      () => {


        const closeButton =

          $(
            '.panel-close',
            panel
          );


        if (closeButton) {


          closeButton.focus();


        }


      },

      50

    );


  }


  function closeSlide(
    keepFocus
  ) {


    if (!openPanel) {

      return;

    }


    openPanel.classList.remove(
      'open'
    );


    openPanel.setAttribute(

      'aria-hidden',

      'true'

    );


    if (backdrop) {


      backdrop.classList.remove(
        'open'
      );


    }


    document.body.classList.remove(
      'lock'
    );


    openPanel =
      null;


    if (
      !keepFocus &&
      lastFocus
    ) {


      lastFocus.focus();


    }


  }


  /* =========================================================
     PROJECT LINKS IN MEGA MENU

     CHANGED:
     These DO NOT open the Start Project form anymore.

     They are real links to project.html.
     ========================================================= */

  $$(
    '.mega-project'
  ).forEach(

    project => {


      project.addEventListener(

        'click',

        () => {


          /*
            Do NOT preventDefault.

            The <a href="project.html?..."> must be allowed
            to navigate normally.
          */


          setWorkMenuOpen(
            false
          );


        }

      );


    }

  );


  /* =========================================================
     OPEN PANEL BUTTONS
     ========================================================= */

  $$(
    '[data-open]'
  ).forEach(

    button => {


      button.addEventListener(

        'click',

        event => {


          event.preventDefault();


          openSlide(

            button.dataset.open

          );


        }

      );


    }

  );


  /* =========================================================
     CLOSE PANEL BUTTONS
     ========================================================= */

  $$(
    '[data-close]'
  ).forEach(

    button => {


      button.addEventListener(

        'click',

        () => {

          closeSlide();

        }

      );


    }

  );


  if (backdrop) {


    backdrop.addEventListener(

      'click',

      () => {

        closeSlide();

      }

    );


  }


  /* =========================================================
     ESCAPE + FOCUS TRAP
     ========================================================= */

  document.addEventListener(

    'keydown',

    event => {


      /*
        Escape can also close mega menu even when
        no side panel is open.
      */


      if (
        event.key ===
        'Escape'
      ) {


        setWorkMenuOpen(
          false
        );


      }


      if (!openPanel) {

        return;

      }


      if (
        event.key ===
        'Escape'
      ) {


        closeSlide();


        return;

      }


      if (
        event.key ===
        'Tab'
      ) {


        const focusableElements =

          $$(
            'button, input, textarea, select, a[href]',
            openPanel
          ).filter(

            element =>

              !element.disabled

          );


        if (
          !focusableElements.length
        ) {


          return;

        }


        const first =

          focusableElements[0];


        const last =

          focusableElements[

            focusableElements.length -
            1

          ];


        if (

          event.shiftKey &&
          document.activeElement ===
          first

        ) {


          event.preventDefault();


          last.focus();


        }
        else if (

          !event.shiftKey &&
          document.activeElement ===
          last

        ) {


          event.preventDefault();


          first.focus();


        }


      }


    }

  );


  /* =========================================================
     PROJECT FORM → GMAIL
     ========================================================= */

  const gmailUrl = (
    subject,
    body
  ) => {


    return (

      'https://mail.google.com/mail/?view=cm&fs=1' +

      '&to=' +
      encodeURIComponent(
        CONFIG.email
      ) +

      '&su=' +
      encodeURIComponent(
        subject
      ) +

      '&body=' +
      encodeURIComponent(
        body
      )

    );

  };


  function handleForm(
    form,
    build
  ) {


    if (!form) {

      return;

    }


    form.addEventListener(

      'submit',

      event => {


        event.preventDefault();


        const data =

          new FormData(
            form
          );


        const {

          subject,
          body

        } =

          build(
            data
          );


        window.open(

          gmailUrl(
            subject,
            body
          ),

          '_blank',

          'noopener'

        );


        const status =

          $(
            '.form-status',
            form
          );


        if (status) {


          status.textContent =

            t(
              'form.sent'
            );


        }


        form.reset();


      }

    );


  }


  handleForm(

    $('#projectForm'),

    data => ({


      subject:

        'New project: ' +

        data.get(
          'project'
        ),


      body:

        `Project name: ${data.get('project')}\n` +

        `Email: ${data.get('email')}\n`,


    })

  );


  /* =========================================================
     CONTACT FORM → FORMSUBMIT
     ========================================================= */

  const contactForm =
    $('#contactForm');


  if (
    contactForm
  ) {


    contactForm.addEventListener(

      'submit',

      async event => {


        event.preventDefault();


        const status =

          $(
            '.form-status',
            contactForm
          );


        const submitButton =

          $(
            'button[type="submit"]',
            contactForm
          );


        const formData =

          new FormData(
            contactForm
          );


        const subject =

          `Portfolio contact (${formData.get('purpose')}) — ${formData.get('first')} ${formData.get('last')}`;


        formData.append(

          '_subject',

          subject

        );


        formData.append(

          '_captcha',

          'false'

        );


        const payload =

          Object.fromEntries(

            formData.entries()

          );


        payload._subject =
          subject;


        if (status) {


          status.classList.remove(
            'is-error'
          );


          status.textContent =

            t(
              'form.sending'
            );


        }


        if (submitButton) {


          submitButton.disabled =
            true;


        }


        contactForm.setAttribute(

          'aria-busy',

          'true'

        );


        try {


          const response =

            await fetch(

              `https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.email)}`,

              {

                method:
                  'POST',

                headers: {

                  Accept:
                    'application/json',

                  'Content-Type':
                    'application/json',

                },

                body:
                  JSON.stringify(
                    payload
                  ),

              }

            );


          const result =

            await response.json();


          if (

            !response.ok ||

            String(
              result.success
            ).toLowerCase() !==
            'true'

          ) {


            throw new Error(

              'Contact form submission failed'

            );


          }


          if (status) {


            status.textContent =

              t(
                'form.sent'
              );


          }


          contactForm.reset();


        }
        catch (error) {


          console.error(

            'Contact form error:',

            error

          );


          if (status) {


            status.classList.add(
              'is-error'
            );


            status.textContent =

              t(
                'form.error'
              );


          }


        }
        finally {


          if (submitButton) {


            submitButton.disabled =
              false;


          }


          contactForm.removeAttribute(
            'aria-busy'
          );


        }


      }

    );


  }


  /* =========================================================
     PROJECT DETAIL PAGE
     ========================================================= */

  function populateProjectPage() {


    /*
      This attribute exists only on project.html:

      <body data-project-page>
    */


    if (

      !document.body.hasAttribute(
        'data-project-page'
      )

    ) {


      return;

    }


    const parameters =

      new URLSearchParams(

        window.location.search

      );


    /*
      Example:

      project.html?project=football-analyser
    */


    const slug =

      parameters.get(
        'project'
      ) ||

      'football-analyser';


    const project =

      PROJECTS[
        slug
      ] ||

      PROJECTS[
        'football-analyser'
      ];


    const nextProject =

      PROJECTS[
        project.next
      ];


    /*
      Browser tab title.
    */


    document.title =

      `${project.title} — Bhavcodes`;


    /*
      Helper for putting text into elements.
    */


    function setText(
      selector,
      value
    ) {


      const element =

        $(
          selector
        );


      if (element) {


        element.textContent =
          value;


      }


    }


    /*
      Project heading and metadata.
    */


    setText(

      '#projectName',

      project.title

    );


    setText(

      '#projectLead',

      project.lead

    );


    setText(

      '#projectType',

      project.type

    );


    setText(

      '#projectRole',

      project.role

    );


    setText(

      '#projectYear',

      project.year

    );


    /*
      Project content.
    */


    setText(

      '#projectOverview',

      project.overview

    );


    setText(

      '#projectBuilt',

      project.built

    );


    setText(

      '#projectOutcome',

      project.outcome

    );


    /*
      Animated graphic label.
    */


    setText(

      '#projectVisualLabel',

      project.title.toUpperCase()

    );


    /*
      Tech stack.
    */


    const tagsContainer =

      $('#projectTags');


    if (
      tagsContainer
    ) {


      tagsContainer.innerHTML =
        '';


      project.tags.forEach(

        technology => {


          const span =

            document.createElement(
              'span'
            );


          span.textContent =
            technology;


          tagsContainer.appendChild(
            span
          );


        }

      );


    }


    /*
      Next project.
    */


    if (
      nextProject
    ) {


      setText(

        '#nextProjectName',

        nextProject.title

      );


      const nextProjectLink =

        $('#nextProjectLink');


      if (
        nextProjectLink
      ) {


        nextProjectLink.href =

          `project.html?project=${project.next}`;


      }


    }


  }


  /* =========================================================
     INITIALISATION
     ========================================================= */

  let savedLanguage =
    'en';


  try {


    savedLanguage =

      localStorage.getItem(
        'lang'
      ) ||

      'en';


  }
  catch (error) {

    /*
      Ignore unavailable localStorage.
    */

  }


  /*
    Populate project page first.
  */


  populateProjectPage();


  /*
    Then initialise language.
  */


  applyLang(

    savedLanguage,

    false

  );


  /*
    Initial scroll/layout calculation.
  */


  update();


})();