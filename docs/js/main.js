import { FluidBackground } from "./fluid.js";


/* =========================================================
   FLUID BACKGROUND
========================================================= */

const canvas = document.querySelector("#fluid-canvas");

const fluid = canvas
  ? new FluidBackground(canvas)
  : null;


/* =========================================================
   HYDERABAD / INDIA CLOCK
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

/*
  Check every second so the displayed minute
  changes immediately when necessary.
*/
setInterval(updateClock, 1000);


/* =========================================================
   ACTIVE NAVIGATION SECTION
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
        .filter(
          (entry) =>
            entry.isIntersecting
        )
        .sort(
          (a, b) =>
            b.intersectionRatio -
            a.intersectionRatio
        )[0];


      if (!visible) return;


      navLinks.forEach((link) => {

        const target =
          link.getAttribute("href");

        const isActive =
          target ===
          `#${visible.target.id}`;

        link.classList.toggle(
          "active",
          isActive
        );

      });

    },
    {
      rootMargin:
        "-30% 0px -55% 0px",

      threshold: [
        0.01,
        0.2,
        0.5
      ],
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
   TOP-RIGHT CHANGING MESSAGE
========================================================= */

const headerMessage =
  document.querySelector(
    "#header-message"
  );


const messages = [
  "Clear night 28°C",
  "Hello",
  "Welcome",
];


let messageIndex = 0;


function changeHeaderMessage() {

  if (!headerMessage) return;


  headerMessage.classList.add(
    "is-changing"
  );


  setTimeout(() => {

    messageIndex =
      (messageIndex + 1) %
      messages.length;


    headerMessage.textContent =
      messages[messageIndex];


    headerMessage.classList.remove(
      "is-changing"
    );

  }, 280);
}


if (headerMessage) {
  setInterval(
    changeHeaderMessage,
    3200
  );
}


/* =========================================================
   DEVELOPMENT / HMR CLEANUP
========================================================= */

if (import.meta.hot) {

  import.meta.hot.dispose(() => {
    fluid?.destroy();
  });

}