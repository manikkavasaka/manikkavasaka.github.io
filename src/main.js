/**
 * MK Shopzone - Elite Internal Growth Engine v8.0
 * High-performance interactivity, AI analytics, and automated lead conversion
 */

document.addEventListener('DOMContentLoaded', () => {
    // AI & Analytics Systems
    initAIAnalytics();

    // UI & Interactions
    initScrollReveal();
    initCounters();
    initNavbar();
    initForms();
    initVideos();
    initFAQ();

    // Personalization
    initPersonalization();
});

/**
 * Initialize AI Analytics & Behavior Tracking
 */
function initAIAnalytics() {
    // Wait for tracking system to be ready
    const trackingCheck = setInterval(() => {
        if (window.behaviorTracker && window.aiAnalyticsEngine) {
            clearInterval(trackingCheck);

            // Every 10 seconds, run analysis on current user behavior
            setInterval(() => {
                const profile = window.behaviorTracker.getProfile();
                if (profile.sessionDuration > 15000) {
                    const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);

                    // Trigger conversion opportunities
                    if (analysis.buying_stage === 'Decision') {
                        triggerHighIntentLeadCapture(analysis);
                    }
                }
            }, 10000);
        }
    }, 500);
}

/**
 * Trigger conversion when user is in decision stage
 */
function triggerHighIntentLeadCapture(analysis) {
    // Only trigger once per session
    if (window.decisionTriggered) return;
    window.decisionTriggered = true;

    // Force lead capture via proactive AI interaction
    if (window.aiChatbot && !window.aiChatbot.isOpen) {
        setTimeout(() => {
            window.aiChatbot.open();
            const offer = analysis.offer || 'Free Strategy Consultation';
            window.aiChatbot.sendMessage(
                `🚀 I've been analyzing your interest in our ${analysis.recommended_service} solutions. To maximize your results, I've unlocked a special offer for you: **${offer}**.\n\nShall we get your roadmap started?`,
                'bot'
            );
        }, 2000);
    }
}

/**
 * Initialize Personalization Engine
 */
function initPersonalization() {
    const personalizationCheck = setInterval(() => {
        if (window.personalizationEngine && window.aiAnalyticsEngine) {
            clearInterval(personalizationCheck);

            // Monitor for personalization opportunities
            setInterval(() => {
                if (window.behaviorTracker) {
                    const profile = window.behaviorTracker.getProfile();
                    const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);

                    if (analysis) {
                        window.personalizationEngine.applyDynamicContent(analysis);
                    }
                }
            }, 15000);
        }
    }, 500);
}

/**
 * Inject Premium Form UI Styles
 */
const formStyles = `
    .form-group, .mka-fc { margin-bottom: 32px !important; }
    input, select, textarea { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
    input:focus, select:focus, textarea:focus { 
        outline: none !important;
        border-color: #ff8c00 !important;
        box-shadow: 0 0 20px rgba(255, 140, 0, 0.25) !important;
        transform: translateY(-1px);
    }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = formStyles;
document.head.appendChild(styleSheet);


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

            // Close other dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => {
                if (d !== parent) d.classList.remove('active');
            });

            // Toggle current
            parent.classList.toggle('active');
        });
    });

    // Close dropdowns on clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
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

// 6. FORM HANDLING & VALIDATION — submits to FastAPI backend
function initForms() {
    const form = document.getElementById('contactForm') || document.getElementById('auditForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"], button');
        const originalText = btn?.textContent || 'Submit';

        if (btn) {
            btn.textContent = 'Analyzing...';
            btn.disabled = true;
        }

        // Show premium loading state
        if (window.premiumSuccessFlow) {
            window.premiumSuccessFlow.showLoading("Analyzing your requirements...");
        }

        // Collect form data
        const leadData = {
            name: form.querySelector('[name="name"], #name, #fullName')?.value?.trim() || '',
            email: form.querySelector('[name="email"], #email')?.value?.trim() || '',
            phone: form.querySelector('[name="phone"], #phone, #whatsapp')?.value?.trim() || '',
            business: form.querySelector('[name="business"], #business, #company')?.value?.trim() || '',
            message: form.querySelector('[name="message"], #message, textarea')?.value?.trim() || '',
            service: form.querySelector('[name="service"], #service, select')?.value || 'General Inquiry',
            source: 'contact_form',
        };

        if (!leadData.name || !leadData.email) {
            if (window.premiumSuccessFlow) window.premiumSuccessFlow.showError('Please enter your name and email.');
            if (btn) { btn.textContent = originalText; btn.disabled = false; }
            return;
        }

        // Submit to backend
        const bridge = window.backendBridge;
        const result = await (bridge ? bridge.submitLead(leadData) : directLeadSubmit(leadData));

        // Add premium delay for analysis feel
        setTimeout(() => {
            if (btn) { btn.textContent = originalText; btn.disabled = false; }

            if (result?.success || result?.leadId) {
                if (window.premiumSuccessFlow) {
                    window.premiumSuccessFlow.showSuccess(leadData);
                }
                form.reset();
            } else {
                if (window.premiumSuccessFlow) window.premiumSuccessFlow.showError();
            }
        }, 2500);
    });
}

async function directLeadSubmit(leadData) {
    try {
        const r = await fetch('/api/v1/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...leadData,
                sessionId: 'form-' + Date.now(),
                intent: leadData.service || 'General',
                buyingStage: 'Decision',
                score: 70,
            })
        });
        return r.ok ? await r.json() : null;
    } catch (_) { return null; }
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
