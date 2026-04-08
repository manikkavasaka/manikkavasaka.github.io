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
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Handle Dropdowns (Mobile + Desktop Click/Touch)
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = trigger.parentElement;
            const isOpen = parent.classList.contains('open');
            
            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => {
                if (d !== parent) d.classList.remove('open');
            });
            
            // Toggle current
            parent.classList.toggle('open');
        });
    });

    // Close dropdowns on clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // Close mobile menu on link click
    const internalLinks = navLinks.querySelectorAll('a:not(.dropdown-trigger)');
    internalLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// 6. FORM HANDLING & VALIDATION
function initForms() {
    const form = document.getElementById('contactForm') || document.getElementById('auditForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Analyzing Requirements...';
        btn.disabled = true;

        // Simulate data analysis transmission
        setTimeout(() => {
            alert('Analysis Complete. Your Strategic Audit has been prioritized. Our Lead Growth strategist will review the data and contact you within 60 minutes.');
            form.reset();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 2500);
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
