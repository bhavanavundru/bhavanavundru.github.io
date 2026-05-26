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
                entry.target.classList.add('animate-in');
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
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
});

// Optional: Add character animation delay for staggered effect
document.addEventListener('DOMContentLoaded', () => {
    const chars = document.querySelectorAll('.splitting .char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.02}s`;
    });
});
