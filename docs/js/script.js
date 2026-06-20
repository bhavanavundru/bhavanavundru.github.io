/* ═══════════════════════════════════════════════
   Firebase setup
═══════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore,
    doc,
    onSnapshot,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC3Zs1zLW5igse5KwWuI0Jtzf5gS8Dagqw",
    authDomain: "portfolio-6f396.firebaseapp.com",
    projectId: "portfolio-6f396",
    storageBucket: "portfolio-6f396.firebasestorage.app",
    messagingSenderId: "427570895637",
    appId: "1:427570895637:web:4c69a2ccd5a239fd8ee71c",
    measurementId: "G-YJCNGJ4YCW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const availabilityRef = doc(db, "site", "availability");

let availabilityListenerStarted = false;

/* ═══════════════════════════════════════════════
   Availability status
═══════════════════════════════════════════════ */

function getAvailabilityElements() {
    return {
        dot: document.getElementById("availDot"),
        status: document.getElementById("availStatus")
    };
}

function renderAvailability(available) {
    const { dot, status } = getAvailabilityElements();

    if (!dot || !status) {
        console.warn("Availability elements not found. Check #availDot and #availStatus in your HTML.");
        return;
    }

    dot.classList.toggle("unavailable", !available);
    dot.setAttribute("aria-label", available ? "Available" : "Unavailable");

    status.textContent = available
        ? "Open to freelance & collab"
        : "Currently not available";
}

function startAvailabilityListener() {
    if (availabilityListenerStarted) return;
    availabilityListenerStarted = true;

    onSnapshot(
        availabilityRef,
        (snapshot) => {
            if (!snapshot.exists()) {
                console.warn("Availability document does not exist yet. Defaulting to available.");
                renderAvailability(true);
                return;
            }

            const data = snapshot.data();
            console.log("Firebase availability data:", data);

            const available = data?.available ?? true;
            renderAvailability(available);
        },
        (error) => {
            console.error("Could not load availability:", error);
            renderAvailability(true);
        }
    );
}

// Owner-only login from DevTools console
window.ownerLogin = async function (email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in. Now run await setAvail(true) or await setAvail(false).");
    } catch (error) {
        console.error("Login failed:", error);
    }
};

// Owner-only logout from DevTools console
window.ownerLogout = async function () {
    try {
        await signOut(auth);
        console.log("Logged out.");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Owner-only status changer from DevTools console
window.setAvail = async function (available) {
    if (typeof available !== "boolean") {
        console.error("Use await setAvail(true) or await setAvail(false).");
        return;
    }

    try {
        await setDoc(
            availabilityRef,
            { available },
            { merge: true }
        );

        // Update your screen instantly
        renderAvailability(available);

        console.log(`Availability set to: ${available ? "Available" : "Unavailable"}`);
    } catch (error) {
        console.error("Could not update availability. Are you logged in as the owner?", error);
    }
};

/* ═══════════════════════════════════════════════
   Main page scripts
═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    document.body.classList.remove("no-js");

    // Update year in footer
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Start Firebase availability live updates
    startAvailabilityListener();

    // Initialize Splitting.js for text animations
    if (window.Splitting) {
        Splitting();
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("about-section")) {
                        entry.target.classList.add("visible");
                    } else {
                        entry.target.classList.add("animate-in");
                    }

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px"
        }
    );

    // Observe all elements with animate-on-scroll class and about-section
    document.querySelectorAll(".animate-on-scroll, .about-section").forEach((el) => {
        observer.observe(el);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (href !== "#") {
                e.preventDefault();

                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // Fade the scroll indicator as the user scrolls down
    const scrollIndicator = document.querySelector(".scroll-indicator");

    if (scrollIndicator) {
        const fadeThreshold = 200;

        const updateScrollIndicator = () => {
            const opacity = Math.max(0, 1 - window.scrollY / fadeThreshold);

            scrollIndicator.style.opacity = opacity.toString();
            scrollIndicator.style.transform = `translateY(${Math.min(window.scrollY / 10, 18)}px)`;

            if (window.scrollY >= fadeThreshold) {
                scrollIndicator.classList.add("hidden");
            } else {
                scrollIndicator.classList.remove("hidden");
            }
        };

        updateScrollIndicator();

        window.addEventListener("scroll", updateScrollIndicator, {
            passive: true
        });
    }

    // Arrow navigation for the works track
    const worksTrack = document.getElementById("worksTrack");
    const prevWork = document.querySelector(".work-prev");
    const nextWork = document.querySelector(".work-next");

    if (worksTrack && prevWork && nextWork) {
        const items = worksTrack.querySelectorAll(".work-item");
        const gap = parseFloat(getComputedStyle(worksTrack).gap) || 24;

        const step = items[0]
            ? Math.round(items[0].getBoundingClientRect().width + gap)
            : worksTrack.clientWidth;

        const scrollToStep = (direction) => {
            const maxScroll = worksTrack.scrollWidth - worksTrack.clientWidth;

            if (direction === "next") {
                if (worksTrack.scrollLeft >= maxScroll - 1) {
                    worksTrack.scrollTo({
                        left: 0,
                        behavior: "smooth"
                    });
                } else {
                    worksTrack.scrollBy({
                        left: step,
                        behavior: "smooth"
                    });
                }
            } else {
                if (worksTrack.scrollLeft <= 1) {
                    worksTrack.scrollTo({
                        left: maxScroll,
                        behavior: "smooth"
                    });
                } else {
                    worksTrack.scrollBy({
                        left: -step,
                        behavior: "smooth"
                    });
                }
            }
        };

        prevWork.addEventListener("click", () => scrollToStep("prev"));
        nextWork.addEventListener("click", () => scrollToStep("next"));
    }

    // Initialize Swiper carousel for Selected Works with a smooth infinite loop
    if (window.Swiper && document.querySelector(".works-swiper")) {
        new Swiper(".works-swiper", {
            slidesPerView: 1.15,
            spaceBetween: 24,
            centeredSlides: true,
            loop: true,
            loopedSlides: 6,
            loopAdditionalSlides: 6,
            loopFillGroupWithBlank: false,
            slidesPerGroup: 1,
            speed: 850,
            grabCursor: true,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
            autoplay: {
                delay: 2600,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                720: {
                    slidesPerView: 1.8,
                    spaceBetween: 28
                },
                1080: {
                    slidesPerView: 2.4,
                    spaceBetween: 34
                }
            }
        });
    }

    // Optional: Add character animation delay for staggered effect
    const chars = document.querySelectorAll(".splitting .char");

    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.02}s`;
    });
});