/**
 * Lead Capture & Scoring System v5.0 - NEXT LEVEL AUTOMATION
 * Automated lead qualification, backend integration, and premium success UI.
 */

class LeadSystem {
    constructor() {
        this.leads = [];
        this.scoreWeights = {
            serviceInterest: 0.40,
            engagementTime: 0.30,
            formCompletion: 0.20,
            source: 0.10
        };
        this.init();
    }

    init() {
        // Form handling moved to enhanced-lead-capture.js to avoid duplication
        // this.attachFormHandlers(); 
        this.monitorLeadReadiness();
        this.setupAutoPopulation();
        // Styles moved to main CSS or premium-success-flow.js
        // this._injectStyles();
    }

    _injectStyles() {
        if (document.getElementById('mka-lead-styles')) return;
        const style = document.createElement('style');
        style.id = 'mka-lead-styles';
        style.textContent = `
            @keyframes mkaFadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes mkaRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .mka-loader-overlay {
                position: fixed; inset: 0; background: rgba(3, 4, 8, 0.95);
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                z-index: 10000; backdrop-filter: blur(10px);
            }
            .mka-spinner {
                width: 60px; height: 60px; border: 4px solid rgba(255, 140, 0, 0.1);
                border-top: 4px solid var(--primary); border-radius: 50%;
                animation: mkaRotate 1s linear infinite; margin-bottom: 20px;
            }
            .mka-success-modal {
                position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
                z-index: 10001; padding: 20px;
            }
            .mka-success-card {
                background: #080808; border: 1px solid rgba(255,255,255,0.1);
                border-radius: 32px; padding: 60px; max-width: 600px; width: 100%;
                text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                animation: mkaFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .mka-success-icon {
                width: 80px; height: 80px; background: #22c55e; color: white;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                margin: 0 auto 30px; font-size: 40px; box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
            }
            .mka-whatsapp-btn {
                display: inline-flex; align-items: center; gap: 12px;
                background: #25D366; color: white; padding: 18px 40px;
                border-radius: 100px; font-weight: 800; text-decoration: none;
                margin-top: 30px; transition: 0.3s;
            }
            .mka-whatsapp-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        `;
        document.head.appendChild(style);
    }

    // method removed to avoid duplication
    attachFormHandlers() { /* DEPRECATED */ }

    async handleFormSubmission(form) { /* DEPRECATED */ }

    showPremiumLoading() { /* DEPRECATED */ }

    hidePremiumLoading() { /* DEPRECATED */ }

    showPremiumSuccess(lead) { /* DEPRECATED */ }

    async recordLead(leadData) {
        const sessionId = window.behaviorTracker?.session?.id || 'web-' + Date.now();
        const analysis = window.behaviorTracker?.getIntentAnalysis?.() || {};

        const lead = {
            name:      leadData.name      || leadData.fullname || '',
            email:     leadData.email     || '',
            phone:     leadData.phone     || '',
            business:  leadData.business  || leadData.website || '',
            message:   leadData.message   || leadData.challenge || '',
            intent:    leadData.intent    || analysis.user_intent || 'General',
            buyingStage: analysis.buying_stage || 'Consideration',
            sessionId: sessionId,
            score:     70, // Base score for form submission
            source:    leadData.source || 'contact_form'
        };

        // Submit to Backend API
        await this.submitToBackend(lead);
        
        return lead;
    }

    async submitToBackend(lead) {
        try {
            const response = await fetch('/api/v1/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            return await response.json();
        } catch (e) {
            console.warn('Backend offline - saving lead locally.');
            this.leads.push(lead);
            localStorage.setItem('mk_pending_leads', JSON.stringify(this.leads));
        }
    }

    setupAutoPopulation() {
        const email = localStorage.getItem('mka_user_email');
        if (email) {
            document.querySelectorAll('input[type="email"]').forEach(i => i.value = email);
        }
    }

    monitorLeadReadiness() {
        // logic from previous version
    }
}

// Global Export
window.leadCaptureSystem = new LeadSystem();
