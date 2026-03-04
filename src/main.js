import './style.css'


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
        const service = document.getElementById('service').value;

        btn.innerText = 'Processing...';
        btn.disabled = true;

        // 1. WhatsApp Integration (Client-side convenience)
        const waNumber = "917200059453";
        // Use a real domain if available, otherwise just show the concept
        const imageUrl = "https://mkshopzone.com/promo-image.jpg";
        const waMessage = `*New Lead Inquiry* %0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A%0A*Company Info:* ${imageUrl}`;
        const waURL = `https://wa.me/${waNumber}?text=${waMessage}`;

        // 2. Secure Backend Storage (Server-side)
        const leadData = { name, email, phone, service };

        // Send data to secure backend
        fetch('http://localhost:3000/api/submit-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Success Flow
                    window.open(waURL, '_blank');
                    alert('Thank you! Your details have been securely saved. Redirecting to WhatsApp...');
                    leadForm.reset();
                    btn.innerText = 'Message Sent';
                } else {
                    throw new Error('Backend failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Fallback for demo if server is not running
                window.open(waURL, '_blank');
                alert('Connected to WhatsApp. (Note: Backend server might be offline, but your chat is ready!)');
            })
            .finally(() => {
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 2000);
            });
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
