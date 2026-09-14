import { FluidBackground } from "./fluid.js";


/* =========================================================
   FLUID
========================================================= */

const canvas = document.querySelector("#fluid-canvas");

const fluid = canvas
  ? new FluidBackground(canvas)
  : null;


/* =========================================================
   HYDERABAD CLOCK
========================================================= */

const clockEl = document.querySelector("#clock");


function updateClock() {
  if (!clockEl) return;

  const now = new Date();

  clockEl.textContent =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
}


updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const navLinks = [
  ...document.querySelectorAll(".nav a")
];

const sections = [
  ...document.querySelectorAll("main section[id]")
];


const sectionObserver =
  new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio -
            a.intersectionRatio
        )[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") ===
          `#${visible.target.id}`;

        link.classList.toggle(
          "active",
          isActive
        );
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.01, 0.2, 0.5],
    }
  );


sections.forEach((section) => {
  sectionObserver.observe(section);
});


/* =========================================================
   DYNAMIC WORK COUNT
========================================================= */

const workCountEl =
  document.querySelector("#work-count");


function updateWorkCount() {
  if (!workCountEl) return;

  const workItems =
    document.querySelectorAll(
      "#work .service-card"
    );

  workCountEl.textContent =
    workItems.length;
}


updateWorkCount();


/* =========================================================
   HYDERABAD DAY / NIGHT
========================================================= */

function getHyderabadHour() {
  const parts =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

  const hourPart =
    parts.find(
      (part) => part.type === "hour"
    );

  return Number(hourPart?.value ?? 12);
}


function getWeatherMessage() {
  const hour = getHyderabadHour();

  /*
    06:00 → 17:59 = daytime
    18:00 → 05:59 = night
  */
  const isDaytime =
    hour >= 6 && hour < 18;

  return isDaytime
    ? "Daylight 28°C"
    : "Clear night 20°C";
}


/* =========================================================
   HEADER MESSAGE ROTATION
========================================================= */

const headerMessage =
  document.querySelector("#header-message");

const languageButtons = [
  ...document.querySelectorAll(".language-button"),
];

let currentLanguage =
  localStorage.getItem("bhavana-language") || "en";


const messageTypes = [
  "weather",
  "hello",
  "welcome",
];


let messageIndex = 0;


function getMessage(type) {
  if (type === "weather") {
    return getLocalizedWeatherMessage();
  }

  if (type === "hello") {
    return currentLanguage === "de" ? "Hallo" : "Hello";
  }

  return currentLanguage === "de" ? "Willkommen" : "Welcome";
}


function getLocalizedWeatherMessage() {
  const hour = getHyderabadHour();
  const isDaytime = hour >= 6 && hour < 18;
  return currentLanguage === "de"
    ? isDaytime ? "Tageslicht 28°C" : "Klare Nacht 20°C"
    : isDaytime ? "Daylight 28°C" : "Clear night 20°C";
}


function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  localStorage.setItem("bhavana-language", language);

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (headerMessage) {
    headerMessage.textContent = getLocalizedWeatherMessage();
  }
}


function showHeaderMessage() {
  if (!headerMessage) return;

  const type =
    messageTypes[messageIndex];

  headerMessage.classList.add(
    "message-out"
  );


  setTimeout(() => {
    headerMessage.classList.remove(
      "message-out",
      "weather-enter",
      "hello-enter",
      "welcome-enter"
    );

    headerMessage.textContent =
      getMessage(type);

    /*
      Force browser reflow so the animation
      restarts every time.
    */
    void headerMessage.offsetWidth;

    headerMessage.classList.add(
      `${type}-enter`
    );

    messageIndex =
      (messageIndex + 1) %
      messageTypes.length;

  }, 220);
}


if (headerMessage) {
  headerMessage.textContent =
    getLocalizedWeatherMessage();

  headerMessage.classList.add(
    "weather-enter"
  );

  setInterval(
    showHeaderMessage,
    3600
  );
}


languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.language);
  });
});

applyLanguage(currentLanguage);


/* =========================================================
   HMR CLEANUP
========================================================= */

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    fluid?.destroy();
  });
}