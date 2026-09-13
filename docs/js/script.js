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
