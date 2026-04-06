/**
 * Personalization Engine
 * Dynamic content adaptation based on user behavior and interests
 */

class PersonalizationEngine {
    constructor() {
        this.userProfile = this.loadProfile();
        this.serviceProfiles = {
            seo: {
                headline: 'Dominate Search Rankings & Crush Your Competition',
                cta: 'Start Your SEO Transformation →',
                benefits: ['Rank for 500+ high-value keywords', '3X organic traffic growth', 'Enterprise-grade SEO']
            },
            ads: {
                headline: 'Turn Ad Spend Into Unstoppable Revenue',
                cta: 'Launch Your Paid Ads Campaign →',
                benefits: ['3X average ROI on ad spend', '24-hour optimization cycles', 'Multi-platform mastery']
            },
            web: {
                headline: 'High-Converting Websites That Generate Leads Daily',
                cta: 'Build Your Dream Website →',
                benefits: ['Mobile-first design excellence', '5-star conversion optimization', 'Future-proof technology']
            },
            social: {
                headline: 'Build a Legendary Social Presence & Authority',
                cta: 'Grow Your Social Empire →',
                benefits: ['Viral-worthy content creation', 'Community building at scale', 'Influencer-level engagement']
            },
            email: {
                headline: 'Email Campaigns That Convert Subscribers Into Customers',
                cta: 'Start Email Revenue Streams →',
                benefits: ['90% open rate strategies', 'Automated nurture sequences', 'List growth hacks']
            }
        };
        this.init();
    }

    init() {
        this.personalizeSections();
        this.setupObserver();
        this.trackProfileChanges();
    }

    loadProfile() {
        const stored = localStorage.getItem('mk_user_profile');
        return stored ? JSON.parse(stored) : {
            interestScores: {},
            engagementLevel: 'low',
            recommendedServices: [],
            lastUpdated: Date.now()
        };
    }

    saveProfile() {
        localStorage.setItem('mk_user_profile', JSON.stringify(this.userProfile));
    }

    onBehaviorEvent(event) {
        const { name, data } = event;

        // Update profile based on events
        if (name === 'service_viewed') {
            this.updateServiceInterest(data.service, 5);
        }
        if (name === 'scroll_milestone' && data.depth >= 50) {
            this.updateEngagementLevel('high');
        }
        if (name === 'form_interaction') {
            this.updateEngagementLevel('medium');
        }
        if (name === 'link_clicked' && data.href.includes('service')) {
            const service = this.extractServiceFromUrl(data.href);
            if (service) this.updateServiceInterest(service, 3);
        }

        this.saveProfile();
    }

    updateServiceInterest(service, points) {
        if (!this.userProfile.interestScores[service]) {
            this.userProfile.interestScores[service] = 0;
        }
        this.userProfile.interestScores[service] += points;
        this.userProfile.lastUpdated = Date.now();
    }

    updateEngagementLevel(level) {
        const levels = { low: 0, medium: 1, high: 2 };
        const current = levels[this.userProfile.engagementLevel] || 0;
        if (levels[level] > current) {
            this.userProfile.engagementLevel = level;
        }
    }

    extractServiceFromUrl(url) {
        const serviceMatch = url.match(/(seo|paid-ads|website-design|social-media|email|video)/);
        return serviceMatch ? serviceMatch[1].replace('-', '_').replace('paid_ads', 'ads').replace('website_design', 'web') : null;
    }

    getTopService() {
        let topService = null;
        let topScore = 0;

        for (const [service, score] of Object.entries(this.userProfile.interestScores)) {
            if (score > topScore) {
                topScore = score;
                topService = service;
            }
        }

        return topService;
    }

    personalizeSections() {
        const topService = this.getTopService();

        if (!topService || Object.keys(this.userProfile.interestScores).length === 0) {
            return; // Use defaults if no personalization data
        }

        // Personalize hero section
        this.personalizeHero(topService);

        // Personalize service cards (highlight relevant ones)
        this.personalizeServiceCards(topService);

        // Personalize CTA text
        this.personalizeCTA(topService);
    }

    personalizeHero(service) {
        const heroHeading = document.querySelector('.hero h1');
        const heroLead = document.querySelector('.hero .lead');
        const profile = this.serviceProfiles[service];

        if (heroHeading && profile) {
            const originalHeadline = heroHeading.textContent;
            
            // Create smooth transition
            this.animateTextChange(heroHeading, profile.headline, 0.3);
        }

        if (heroLead && profile) {
            const serviceDesc = {
                seo: `Ready to rank? MK's SEO experts have grown organic traffic by ${Math.floor(Math.random() * 5 + 2)}X for 500+ clients. Get your roadmap to search dominance.`,
                ads: `Your ads deserve optimization. We achieve 3X average ROI through precision targeting and continuous optimization. Let's scale your ad spend.`,
                web: `A website isn't just online real estate—it's your revenue machine. We build high-converting sites that turn visitors into loyal customers.`,
                social: `Building your brand on social? We create viral-worthy content that turns followers into fans and fans into paying customers.`,
                email: `Email is the highest ROI channel. We craft automated sequences that nurture leads into loyal, repeat customers.`
            };

            this.animateTextChange(heroLead, serviceDesc[service], 0.3);
        }
    }

    personalizeServiceCards(service) {
        const serviceCards = document.querySelectorAll('[data-service]');
        serviceCards.forEach(card => {
            if (card.dataset.service === service) {
                card.style.borderColor = 'var(--primary)';
                card.style.boxShadow = '0 0 30px rgba(255, 140, 0, 0.4)';
                card.style.transform = 'scale(1.05)';
                
                const badge = document.createElement('div');
                badge.className = 'recommended-badge';
                badge.textContent = '✨ Recommended for You';
                badge.style.cssText = `
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: var(--primary);
                    color: #000;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    animation: slideIn 0.5s ease-out;
                `;
                card.appendChild(badge);
            }
        });
    }

    personalizeCTA(service) {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        const profile = this.serviceProfiles[service];

        if (profile) {
            ctaButtons.forEach(btn => {
                if (btn.textContent.includes('Launch')) {
                    btn.textContent = profile.cta;
                }
            });
        }
    }

    animateTextChange(element, newText, duration = 0.3) {
        const originalText = element.textContent;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            if (progress === 1) {
                element.textContent = newText;
            } else {
                // Fade out effect
                element.style.opacity = 1 - (progress * 0.3);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    setupObserver() {
        // Observe when new sections come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.dataset.personalizable) {
                    this.personalizeElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-personalizable]').forEach(el => {
            observer.observe(el);
        });
    }

    personalizeElement(element) {
        const topService = this.getTopService();
        if (!topService) return;

        // Custom personalization logic per element
        const elementType = element.dataset.personalizable;

        if (elementType === 'hero') {
            this.personalizeHero(topService);
        } else if (elementType === 'services') {
            this.personalizeServiceCards(topService);
        }
    }

    updateProfile(updates) {
        this.userProfile = { ...this.userProfile, ...updates };
        this.saveProfile();
        this.personalizeSections();
    }

    trackProfileChanges() {
        // Re-personalize periodically as profile evolves
        setInterval(() => {
            const topService = this.getTopService();
            if (topService !== this.lastPersonalizedService) {
                this.lastPersonalizedService = topService;
                this.personalizeSections();
            }
        }, 5000);
    }

    generateRecommendation() {
        const scores = this.userProfile.interestScores;
        const topService = this.getTopService();
        
        if (!topService) return null;

        return {
            service: topService,
            confidence: scores[topService] / 20, // Normalize to 0-100 scale
            reasons: this.generateRecommendationReasons(topService)
        };
    }

    generateRecommendationReasons(service) {
        const reasons = {
            seo: [
                'You showed high interest in ranking and organic visibility',
                'Your engagement suggests you\'re serious about long-term growth',
                'SEO typically offers the highest ROI for sustained growth'
            ],
            ads: [
                'You explored our paid advertising services multiple times',
                'Your quick interaction pattern suggests you want fast results',
                'PPC offers immediate visibility and revenue potential'
            ],
            web: [
                'You spent significant time on web development pages',
                'A strong website foundation is crucial for all digital success',
                'Your profile indicates you prioritize online presence'
            ],
            social: [
                'You showed strong engagement with social media content',
                'Your profile suggests you value brand building and community',
                'Social media is essential for modern brand authority'
            ]
        };

        return reasons[service] || [];
    }

    // A/B Testing support
    shouldShowVariant(testId, variantA = true) {
        let testResults = JSON.parse(localStorage.getItem('mk_ab_tests') || '{}');
        
        if (!testResults[testId]) {
            testResults[testId] = Math.random() < 0.5;
            localStorage.setItem('mk_ab_tests', JSON.stringify(testResults));
        }

        return testResults[testId] === variantA;
    }

    trackABTestResult(testId, result) {
        window.behaviorTracker?.trackEvent('ab_test_result', {
            testId,
            result
        });
    }
}

// Initialize personalization engine
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.personalizationEngine = new PersonalizationEngine();
    });
} else {
    window.personalizationEngine = new PersonalizationEngine();
}

