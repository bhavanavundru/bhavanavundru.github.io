/* =========================================================
   CLOCK
========================================================= */

const clockEl =
  document.querySelector("#clock");

function updateClock() {
  if (!clockEl) {
    return;
  }

  const now =
    new Date();

  clockEl.textContent =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Kolkata",

        hour:
          "2-digit",

        minute:
          "2-digit",

        hour12:
          false,
      }
    ).format(now);
}

updateClock();

setInterval(
  updateClock,
  1000
);


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  en: {
    navHome:
      "Home",

    navAbout:
      "About",

    navWork:
      "Work",

    navContact:
      "Contact",

    heroHello:
      "Hi,",

    heroName:
      "I’m Bhavana",

    heroSubtitle:
      "I am a Computer Science student",

    scrollDown:
      "Scroll down",

    aboutTitleOne:
      "About the",

    aboutTitleTwo:
      "Dev",

    aboutParagraphOne:
      "I like building interfaces that feel alive — combining front-end engineering, visual systems, and interactive computing.",

    aboutParagraphTwo:
      "My current focus is web development, AR/VR, and machine learning, with a strong interest in graphics and real-time interaction.",

    skillCreative:
      "Creative",

    skillProblemSolver:
      "Problem Solver",

    skillTeamPlayer:
      "Team Player",

    skillCurious:
      "Curious",

    skillLearning:
      "Always Learning",

    workTitleOne:
      "What",

    workTitleTwo:
      "I Do",

    webTitle:
      "Web Development",

    webDescription:
      "Responsive interfaces, interaction design, and polished web experiences.",

    arDescription:
      "Immersive ideas, spatial interfaces, and experimental interaction.",

    aiTitle:
      "AI & Machine Learning",

    aiDescription:
      "Computer vision, intelligent systems, and practical ML experiments.",

    contactTitleOne:
      "Get",

    contactTitleTwo:
      "in touch",

    emailPlaceholder:
      "Enter your email",

    elsewhere:
      "Elsewhere",

    weatherDay:
      "Daylight 28°C",

    weatherNight:
      "Clear night 20°C",

    hello:
      "Hello",

    welcome:
      "Welcome",

    emailSubject:
      "Portfolio contact",
  },


  de: {
    navHome:
      "Start",

    navAbout:
      "Über mich",

    navWork:
      "Arbeit",

    navContact:
      "Kontakt",

    heroHello:
      "Hallo,",

    heroName:
      "ich bin Bhavana",

    heroSubtitle:
      "Ich bin Informatikstudentin",

    scrollDown:
      "Nach unten scrollen",

    aboutTitleOne:
      "Über die",

    aboutTitleTwo:
      "Entwicklerin",

    aboutParagraphOne:
      "Ich entwickle gerne Benutzeroberflächen, die lebendig wirken — eine Verbindung aus Frontend-Entwicklung, visuellen Systemen und interaktiver Informatik.",

    aboutParagraphTwo:
      "Mein aktueller Schwerpunkt liegt auf Webentwicklung, AR/VR und maschinellem Lernen, mit besonderem Interesse an Grafik und Echtzeit-Interaktionen.",

    skillCreative:
      "Kreativ",

    skillProblemSolver:
      "Problemlöserin",

    skillTeamPlayer:
      "Teamplayerin",

    skillCurious:
      "Neugierig",

    skillLearning:
      "Immer lernbereit",

    workTitleOne:
      "Was",

    workTitleTwo:
      "ich mache",

    webTitle:
      "Webentwicklung",

    webDescription:
      "Responsive Benutzeroberflächen, Interaktionsdesign und hochwertige Web-Erlebnisse.",

    arDescription:
      "Immersive Ideen, räumliche Benutzeroberflächen und experimentelle Interaktionen.",

    aiTitle:
      "KI & Maschinelles Lernen",

    aiDescription:
      "Computer Vision, intelligente Systeme und praktische Experimente mit maschinellem Lernen.",

    contactTitleOne:
      "Melde",

    contactTitleTwo:
      "dich",

    emailPlaceholder:
      "E-Mail-Adresse eingeben",

    elsewhere:
      "Anderswo",

    weatherDay:
      "Tageslicht 28°C",

    weatherNight:
      "Klare Nacht 20°C",

    hello:
      "Hallo",

    welcome:
      "Willkommen",

    emailSubject:
      "Portfolio-Kontakt",
  },
};


/* =========================================================
   LANGUAGE
========================================================= */

const languageButtons = [
  ...document.querySelectorAll(
    ".language-button"
  ),
];

let currentLanguage =
  localStorage.getItem(
    "bhavana-language"
  ) || "en";

if (
  !translations[
    currentLanguage
  ]
) {
  currentLanguage =
    "en";
}


/* =========================================================
   HYDERABAD TIME
========================================================= */

function getHyderabadHour() {
  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Kolkata",

        hour:
          "2-digit",

        hourCycle:
          "h23",
      }
    ).formatToParts(
      new Date()
    );

  const hourPart =
    parts.find(
      (part) =>
        part.type ===
        "hour"
    );

  return Number(
    hourPart?.value ??
    12
  );
}


/* =========================================================
   WEATHER TEXT
========================================================= */

function getLocalizedWeatherMessage() {
  const hour =
    getHyderabadHour();

  const daytime =
    hour >= 6 &&
    hour < 18;

  return daytime
    ? translations[
        currentLanguage
      ].weatherDay
    : translations[
        currentLanguage
      ].weatherNight;
}


/* =========================================================
   HEADER MESSAGE
========================================================= */

const headerMessage =
  document.querySelector(
    "#header-message"
  );

const messageTypes = [
  "weather",
  "hello",
  "welcome",
];

let messageIndex =
  1;

let currentMessageType =
  "weather";

function getMessage(
  type
) {
  if (
    type ===
    "weather"
  ) {
    return getLocalizedWeatherMessage();
  }

  if (
    type ===
    "hello"
  ) {
    return translations[
      currentLanguage
    ].hello;
  }

  return translations[
    currentLanguage
  ].welcome;
}


/* =========================================================
   HEADER MESSAGE ANIMATION
========================================================= */

function setHeaderMessage(
  text,
  animate = true
) {
  if (!headerMessage) {
    return;
  }

  if (!animate) {
    headerMessage.textContent =
      text;

    return;
  }

  headerMessage.classList.add(
    "message-out"
  );

  window.setTimeout(
    () => {
      headerMessage.textContent =
        text;

      headerMessage.classList.remove(
        "message-out",
        "message-enter"
      );

      void headerMessage.offsetWidth;

      headerMessage.classList.add(
        "message-enter"
      );
    },
    190
  );
}


/* =========================================================
   HEADER MESSAGE ROTATION
========================================================= */

function showHeaderMessage() {
  const type =
    messageTypes[
      messageIndex
    ];

  currentMessageType =
    type;

  setHeaderMessage(
    getMessage(
      type
    ),
    true
  );

  messageIndex =
    (
      messageIndex +
      1
    ) %
    messageTypes.length;
}

if (headerMessage) {
  headerMessage.textContent =
    getLocalizedWeatherMessage();

  headerMessage.classList.add(
    "message-enter"
  );

  setInterval(
    showHeaderMessage,
    3600
  );
}


/* =========================================================
   LANGUAGE APPLICATION
========================================================= */

function applyLanguage(
  language
) {
  if (
    !translations[
      language
    ]
  ) {
    language =
      "en";
  }

  currentLanguage =
    language;

  document.documentElement.lang =
    language;

  localStorage.setItem(
    "bhavana-language",
    language
  );


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(
      (element) => {
        const key =
          element.dataset.i18n;

        const value =
          translations[
            language
          ][key];

        if (
          value !==
          undefined
        ) {
          element.textContent =
            value;
        }
      }
    );


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach(
      (element) => {
        const key =
          element.dataset
            .i18nPlaceholder;

        const value =
          translations[
            language
          ][key];

        if (
          value !==
          undefined
        ) {
          element.placeholder =
            value;
        }
      }
    );


  languageButtons.forEach(
    (button) => {
      const active =
        button.dataset.language ===
        language;

      button.classList.toggle(
        "is-active",
        active
      );

      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    }
  );


  if (headerMessage) {
    headerMessage.textContent =
      getMessage(
        currentMessageType
      );
  }
}

languageButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        applyLanguage(
          button.dataset.language
        );
      }
    );
  }
);

applyLanguage(
  currentLanguage
);


/* =========================================================
   WORK COUNT
========================================================= */

const workCountEl =
  document.querySelector(
    "#work-count"
  );

function updateWorkCount() {
  if (!workCountEl) {
    return;
  }

  const cards =
    document.querySelectorAll(
      "#work .service-card"
    );

  workCountEl.textContent =
    cards.length;
}

updateWorkCount();


/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value,
  minimum,
  maximum
) {
  return Math.min(
    Math.max(
      value,
      minimum
    ),
    maximum
  );
}


/* =========================================================
   ABOUT TAKEOVER
========================================================= */

const aboutStage =
  document.querySelector(
    ".home-takeover"
  );

let aboutAnimationFrame =
  null;

function updateAboutExpansion() {
  aboutAnimationFrame =
    null;

  if (!aboutStage) {
    return;
  }

  const rect =
    aboutStage.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight;


  const animationDistance =
    Math.max(viewportHeight, 1);


  let progress =
    -rect.top /
    animationDistance;


  progress =
    clamp(
      progress,
      0,
      1
    );


  /*
    Smoothstep:
    makes the beginning and end smoother.
  */

  progress =
    progress *
    progress *
    (
      3 -
      2 * progress
    );


  aboutStage.style.setProperty(
    "--about-progress",
    progress.toFixed(4)
  );

  /*
    Once basically finished, force the About panel
    to EXACTLY fill the viewport.

    This removes the light/white strips at the
    top and bottom.
  */

  aboutStage.classList.toggle(
    "is-full",
    progress >= 0.995
  );
}

function requestAboutUpdate() {
  if (
    aboutAnimationFrame !==
    null
  ) {
    return;
  }

  aboutAnimationFrame =
    requestAnimationFrame(
      updateAboutExpansion
    );
}


/* =========================================================
   FLOATING NAV
========================================================= */

function updateFloatingNavigation() {
  const shouldFloat =
    window.scrollY >
    110;

  document.body.classList.toggle(
    "is-scrolled",
    shouldFloat
  );
}


/* =========================================================
   SCROLL UPDATE
========================================================= */

function updateScrollEffects() {
  requestAboutUpdate();

  updateFloatingNavigation();
}

window.addEventListener(
  "scroll",
  updateScrollEffects,
  {
    passive: true,
  }
);

window.addEventListener(
  "resize",
  updateScrollEffects,
  {
    passive: true,
  }
);

updateScrollEffects();


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const navLinks = [
  ...document.querySelectorAll(
    ".nav a"
  ),
];

const sections = [
  ...document.querySelectorAll(
    "main section[id]"
  ),
];

const sectionObserver =
  new IntersectionObserver(
    (entries) => {
      const visible =
        entries
          .filter(
            (entry) =>
              entry.isIntersecting
          )
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          )[0];

      if (!visible) {
        return;
      }

      navLinks.forEach(
        (link) => {
          const active =
            link.getAttribute(
              "href"
            ) ===
            `#${visible.target.id}`;

          link.classList.toggle(
            "active",
            active
          );
        }
      );
    },
    {
      rootMargin:
        "-22% 0px -58% 0px",

      threshold: [
        0.01,
        0.12,
        0.3,
      ],
    }
  );

sections.forEach(
  (section) => {
    sectionObserver.observe(
      section
    );
  }
);


/* =========================================================
   SERVICE CARD ANIMATION
========================================================= */

const serviceCards = [
  ...document.querySelectorAll(
    ".service-card"
  ),
];

serviceCards.forEach(
  (
    card,
    index
  ) => {
    card.style.setProperty(
      "--card-delay",
      `${index * 120}ms`
    );
  }
);

const cardObserver =
  new IntersectionObserver(
    (
      entries,
      observer
    ) => {
      entries.forEach(
        (entry) => {
          if (
            !entry.isIntersecting
          ) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        }
      );
    },
    {
      threshold:
        0.14,

      rootMargin:
        "0px 0px -40px 0px",
    }
  );

serviceCards.forEach(
  (card) => {
    cardObserver.observe(
      card
    );
  }
);


/* =========================================================
   NAV SMOOTH SCROLL
========================================================= */

document
  .querySelectorAll(
    '.nav a[href^="#"]'
  )
  .forEach(
    (anchor) => {
      anchor.addEventListener(
        "click",
        function (
          event
        ) {
          const href =
            this.getAttribute(
              "href"
            );

          if (
            !href ||
            href === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              href
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          if (href === "#about" && aboutStage) {
            const takeoverTop =
              aboutStage.getBoundingClientRect().top +
              window.scrollY;

            window.scrollTo({
              top:
                takeoverTop +
                window.innerHeight,

              behavior:
                "smooth",
            });

            return;
          }

          target.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
        }
      );
    }
  );


/* =========================================================
   EMAIL
========================================================= */

const emailForm =
  document.querySelector(
    "#email-form"
  );

if (emailForm) {
  emailForm.addEventListener(
    "submit",
    (
      event
    ) => {
      event.preventDefault();

      const input =
        emailForm.querySelector(
          'input[name="email"]'
        );

      if (!input) {
        return;
      }

      const email =
        input.value.trim();

      if (!email) {
        return;
      }

      const subject =
        translations[
          currentLanguage
        ].emailSubject;

      window.location.href =
        `mailto:hello@example.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(
          email
        )}`;
    }
  );
}


/* =========================================================
   SCROLL RESTORATION
========================================================= */

if (
  "scrollRestoration"
  in history
) {
  history.scrollRestoration =
    "manual";
}