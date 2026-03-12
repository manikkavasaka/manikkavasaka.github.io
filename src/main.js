console.log('MK ShopZone App Initialized');






// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('active'); // Add active state css if needed
    });

    // Close menu when link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });
}

// Fade In Animation on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));

// Form Submission Handling


// Form Submission Handling
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = leadForm.querySelector('button');
        const originalText = btn.innerText;

        // Capture Data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        const service = document.getElementById('service').value;

        btn.innerText = 'Processing...';
        btn.disabled = true;

        // 1. WhatsApp Integration (Client-side convenience)
        const waNumber = "917200059453";
        // Use a real domain if available, otherwise just show the concept
        const imageUrl = "https://mkshopzone.me/promo-share.jpg";
        const websiteUrl = "https://mkshopzone.me/";
        const waMessage = `*New Lead Inquiry*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Message:* ${message}%0A%0A*Website:* ${websiteUrl}`;
        const waURL = `https://wa.me/${waNumber}?text=${waMessage}`;

        // Direct to WhatsApp (no backend dependency)
        window.open(waURL, '_blank');

        // Reset and notify
        setTimeout(() => {
            leadForm.reset();
            btn.innerText = 'Message Sent';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            }, 2000);
        }, 500);
    });
}

// Smooth Scroll for Anchor Links (Polyfill-like behavior if needed, but CSS handles it mostly)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Close others
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        // Toggle current
        item.classList.toggle('active');
    });
});

// Animated Number Counter for Stats Section
const animateValue = (obj, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end + suffix; // Ensure exact final value
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.innerText;
            let endVal = 0;
            let suffix = '';
            
            // Parse the number and the suffix (+ or %)
            if (text.includes('+')) {
                endVal = parseInt(text.replace(/\D/g, ''));
                suffix = '+';
            } else if (text.includes('%')) {
                endVal = parseInt(text.replace(/\D/g, ''));
                suffix = '%';
            } else {
                endVal = parseInt(text.replace(/\D/g, ''));
            }
            
            if (!isNaN(endVal) && endVal > 0) {
                // Initial state
                el.innerText = '0' + suffix;
                // Start animation
                animateValue(el, 0, endVal, 2500, suffix);
            }
            observer.unobserve(el); // Only animate once
        }
    });
}, { threshold: 0.5 }); // Trigger when 50% visible

document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));
