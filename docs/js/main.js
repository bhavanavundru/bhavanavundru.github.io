import { FluidBackground } from "./fluid.js";

const canvas = document.querySelector("#fluid-canvas");
const fluid = new FluidBackground(canvas);

// Keep the clock in the upper-left alive.
const clockEl = document.querySelector("#clock");

function updateClock() {
  const now = new Date();
  clockEl.textContent = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

updateClock();
setInterval(updateClock, 30_000);

// Update active nav item as sections cross the viewport.
const navLinks = [...document.querySelectorAll(".nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("active", isActive);
    });
  },
  {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0.01, 0.2, 0.5],
  }
);

sections.forEach((section) => observer.observe(section));

// Helpful during HMR / development.
if (import.meta.hot) {
  import.meta.hot.dispose(() => fluid.destroy());
}
