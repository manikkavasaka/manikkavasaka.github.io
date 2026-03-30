/**
 * MK Shopzone - Elite Internal Growth Engine v7.0
 * High-performance interactivity and animation framework
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initNavbar();
    initForms();
    initVideos();
    initFAQ();
});



// 3. INTERSECTION OBSERVER REVEAL
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// 4. PERFORMANCE COUNTERS
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const suffix = counter.getAttribute('data-suffix') || '';
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.floor(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// 5. NAVBAR INTERACTIONS
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// 6. FORM HANDLING & VALIDATION
function initForms() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Transmitting Growth Strategy...';
        btn.disabled = true;

        // Simulate transmission
        setTimeout(() => {
            alert('Strategic Audit Requested Successfully. Our lead growth specialist will contact you within 90 minutes.');
            form.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

// 7. VIDEO OPTIMIZATION
function initVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
        v.playbackRate = 0.8; // Subtle slow motion for premium feel
    });
}
// 8. FAQ ACCORDION
function initFAQ() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const header = card.querySelector('.faq-header');
        if (!header) return;
        
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            faqCards.forEach(c => c.classList.remove('active'));
            if (!isActive) card.classList.add('active');
        });
    });
}
