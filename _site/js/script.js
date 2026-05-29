// Remove no-js class on page load
document.addEventListener('DOMContentLoaded', () => {
    // Prevent browser from restoring scroll on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // Ensure page is at top on load
    window.scrollTo(0, 0);

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

    // Initialize Swiper carousel for Selected Works
    if (window.Swiper && document.querySelector('.works-swiper')) {
        new Swiper('.works-swiper', {
            slidesPerView: 1.05,
            spaceBetween: 20,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                720: {
                    slidesPerView: 1.5,
                    spaceBetween: 24,
                },
                1080: {
                    slidesPerView: 2.2,
                    spaceBetween: 32,
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
