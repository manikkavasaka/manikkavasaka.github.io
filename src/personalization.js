/**
 * Personalization Engine v2.0
 * Dynamically modifies DOM elements based on behavior tracking analysis.
 */

class PersonalizationEngine {
    constructor() {
        this.analysis = null;
    }

    applyDynamicContent(analysis) {
        if (!analysis) return;
        this.analysis = analysis;

        // 1. Update Main Headlines (if applicable)
        const heroH1 = document.querySelector('h1');
        if (heroH1 && analysis.headline && !heroH1.dataset.personalized) {
            // Only update once to prevent flickering
            heroH1.innerHTML = analysis.headline.replace(/#1/, '<span class="gradient-span">#1</span>');
            heroH1.dataset.personalized = "true";
        }

        // 2. Update Subheadings
        const heroP = document.querySelector('.hero-seo p, .hero-ads-v3 p, .hero-web p');
        if (heroP && analysis.subheading) {
            heroP.innerText = analysis.subheading;
        }

        // 3. Update CTAs
        const mainCta = document.querySelector('.btn-primary, .btn-elite');
        if (mainCta && analysis.cta) {
            mainCta.innerText = analysis.cta;
        }

        // 4. Trigger Chatbot Proactively for Decision Stage
        if (analysis.buying_stage === 'Decision' && !window.aiChatbot?.isOpen) {
            this._triggerDecisionNudge();
        }
    }

    _triggerDecisionNudge() {
        if (this.nudgeTriggered) return;
        this.nudgeTriggered = true;

        setTimeout(() => {
            if (window.aiChatbot) {
                window.aiChatbot.open();
                window.aiChatbot.sendMessage(`I noticed you're doing some deep research on our ${this.analysis.user_intent}. 🎯 Would you like to see a quick 90-day roadmap we built for a similar client?`, 'bot');
            }
        }, 5000);
    }

    updateProfile(profile) {
        // Sync with backend or local storage if needed
        localStorage.setItem('mk_user_profile', JSON.stringify(profile));
    }
}

// Global Export
window.personalizationEngine = new PersonalizationEngine();
