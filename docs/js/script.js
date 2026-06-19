// Remove no-js class on page load
document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0,0);

    document.body.classList.remove('no-js');
    
    // Update year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Initialize Splitting.js for text animations
    if (window.Splitting) {
        Splitting();
    }
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-section')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('animate-in');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all elements with animate-on-scroll class and about-section
    document.querySelectorAll('.animate-on-scroll, .about-section').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Fade the scroll indicator as the user scrolls down
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const fadeThreshold = 200;
        const updateScrollIndicator = () => {
            const opacity = Math.max(0, 1 - window.scrollY / fadeThreshold);
            scrollIndicator.style.opacity = opacity.toString();
            scrollIndicator.style.transform = `translateY(${Math.min(window.scrollY / 10, 18)}px)`;

            if (window.scrollY >= fadeThreshold) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        };

        updateScrollIndicator();
        window.addEventListener('scroll', updateScrollIndicator, { passive: true });
    }

    // Arrow navigation for the works track
    const worksTrack = document.getElementById('worksTrack');
    const prevWork = document.querySelector('.work-prev');
    const nextWork = document.querySelector('.work-next');
    if (worksTrack && prevWork && nextWork) {
        const items = worksTrack.querySelectorAll('.work-item');
        const gap = parseFloat(getComputedStyle(worksTrack).gap) || 24;
        const step = items[0] ? Math.round(items[0].getBoundingClientRect().width + gap) : worksTrack.clientWidth;

        const scrollToStep = (direction) => {
            const maxScroll = worksTrack.scrollWidth - worksTrack.clientWidth;
            if (direction === 'next') {
                if (worksTrack.scrollLeft >= maxScroll - 1) {
                    worksTrack.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    worksTrack.scrollBy({ left: step, behavior: 'smooth' });
                }
            } else {
                if (worksTrack.scrollLeft <= 1) {
                    worksTrack.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    worksTrack.scrollBy({ left: -step, behavior: 'smooth' });
                }
            }
        };

        prevWork.addEventListener('click', () => scrollToStep('prev'));
        nextWork.addEventListener('click', () => scrollToStep('next'));
    }

    // Initialize Swiper carousel for Selected Works with a smooth infinite loop
    if (window.Swiper && document.querySelector('.works-swiper')) {
        new Swiper('.works-swiper', {
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
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                720: {
                    slidesPerView: 1.8,
                    spaceBetween: 28,
                },
                1080: {
                    slidesPerView: 2.4,
                    spaceBetween: 34,
                },
            },
        });
    }
});

// Optional: Add character animation delay for staggered effect
document.addEventListener('DOMContentLoaded', () => {
    const chars = document.querySelectorAll('.splitting .char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.02}s`;
    });
});
