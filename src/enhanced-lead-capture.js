/**
 * Enhanced Lead Capture System v3.0
 *
 * Features:
 * - Premium loading + success UI
 * - Auto WhatsApp trigger
 * - Database storage
 * - Instant automation (WhatsApp + Email)
 * - Smart lead qualification
 */

class EnhancedLeadCapture {
    constructor() {
        this.leads = [];
        this.formSelector = ['#contactForm', '#auditForm', '#leadForm'];
        this.init();
    }

    init() {
        this._attachFormHandlers();
        this._monitorLeadReadiness();
    }

    _attachFormHandlers() {
        // Try multiple form selectors
        for (const selector of this.formSelector) {
            const form = document.querySelector(selector);
            if (form) {
                form.addEventListener('submit', (e) => this._handleFormSubmit(e, form));
                console.log(`✅ Lead capture attached to ${selector}`);
                break;
            }
        }

        // Also attach to any dynamically created forms
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form') &&
                (e.target.id.includes('Form') ||
                 e.target.classList.contains('lead-form') ||
                 e.target.dataset.isLeadForm === 'true')) {
                this._handleFormSubmit(e, e.target);
            }
        });
    }

    async _handleFormSubmit(event, form) {
        event.preventDefault();

        // 1. Show premium loading UI with button state
        window.premiumSuccessFlow?.showLoading("Analyzing your requirements...", form);

        try {
            // Extract lead data
            const leadData = this._extractLeadData(form);

            // Validate
            if (!this._validateLead(leadData)) {
                throw new Error('Please fill all required fields correctly');
            }

            // Enrich with session data
            await this._enrichLeadData(leadData);

            // Mandatory "Premium Analysis" delay (2.5s)
            const submissionPromise = this._submitToBackend(leadData);
            const delayPromise = new Promise(r => setTimeout(r, 2500));
            
            // Wait for both backend and artificial delay
            const [response] = await Promise.all([submissionPromise, delayPromise]);

            if (!response.success) {
                throw new Error(response.error || 'Submission failed');
            }

            // 2. Show success UI with auto WhatsApp
            window.premiumSuccessFlow?.hideLoading();
            window.premiumSuccessFlow?.showSuccess(leadData);

            // Track conversion
            this._trackConversion(leadData, response);

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Lead capture error:', error);
            window.premiumSuccessFlow?.showError(error.message, form);
        }
    }

    _extractLeadData(form) {
        const formData = new FormData(form);

        // Robust field getter: checks name attribute first, then element ID
        const getField = (names) => {
            for (const n of names) {
                const byName = formData.get(n);
                if (byName) return byName;
                const byId = form.querySelector(`#${n}`)?.value;
                if (byId) return byId;
            }
            return '';
        };

        const data = {
            name: getField(['name', 'fullName', 'full-name']),
            email: getField(['email']),
            phone: getField(['phone', 'phoneNumber', 'phone-number']),
            business: getField(['business', 'company', 'businessName', 'website']),
            service: getField(['service', 'service-select', 'interest']),
            message: getField(['message', 'details', 'challenge']),
            budget: getField(['budget']),
            timeline: getField(['timeline']),
            source: 'web_form',
            timestamp: new Date().toISOString(),
        };

        return data;
    }

    _validateLead(lead) {
        // Required fields
        if (!lead.name || !lead.name.trim()) return false;
        if (!lead.email || !lead.email.trim()) return false;
        if (!lead.phone || !lead.phone.trim()) return false;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lead.email)) return false;

        // Phone validation (at least 8 digits)
        const phoneDigits = lead.phone.replace(/\D/g, '');
        if (phoneDigits.length < 8) return false;

        return true;
    }

    async _enrichLeadData(lead) {
        // Add session data
        if (window.behaviorTracker) {
            const profile = window.behaviorTracker.getProfile?.();
            if (profile) {
                lead.sessionId = profile.sessionId;
                lead.sessionDuration = profile.sessionDuration;
                lead.scrollDepth = profile.scrollDepth;
                lead.pagesVisited = profile.pagesVisited;
                lead.topClicks = profile.topClicks;
            }
        }

        // Add AI analysis if available
        if (window.aiAnalyticsEngine) {
            const analysis = window.lastAnalysis;
            if (analysis) {
                lead.intent = analysis.user_intent;
                lead.buyingStage = analysis.buying_stage;
                lead.recommendedService = analysis.recommended_service;
                lead.score = analysis.confidence_score;
            }
        }

        // Get source from URL params
        const urlParams = new URLSearchParams(window.location.search);
        lead.utmSource = urlParams.get('utm_source') || '';
        lead.utmCampaign = urlParams.get('utm_campaign') || '';
        lead.referrer = document.referrer;
    }

    async _submitToBackend(leadData) {
        const payload = {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            business: leadData.business,
            message: leadData.message,
            sessionId: leadData.sessionId || 'web-form-' + Date.now(),
            intent: leadData.intent || leadData.service || 'General',
            buyingStage: leadData.buyingStage || 'Awareness',
            score: leadData.score || 50,
            metadata: {
                source: leadData.source,
                timestamp: leadData.timestamp,
                budget: leadData.budget,
                timeline: leadData.timeline,
                referrer: leadData.referrer,
                utmSource: leadData.utmSource,
                utmCampaign: leadData.utmCampaign,
                pages: leadData.pagesVisited,
            }
        };

        console.log('Finalizing lead capture with payload:', payload);

        try {
            const apiUrl = 'http://localhost:8000/lead';
            console.log(`Sending POST request to: ${apiUrl}`, payload);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log(`Response status: ${response.status}`);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Submission success:', result);
                return {
                    success: true,
                    leadId: result.leadId || result.lead_id,
                    message: result.message,
                    nextSteps: result.nextSteps
                };
            } else {
                const errorText = await response.text();
                console.error('Backend returned error:', errorText);
                throw new Error(`Server error: ${response.status}`);
            }
        } catch (err) {
            console.warn('Backend connection failed - falling back to local storage:', err.message);
            localStorage.setItem('mk_pending_lead', JSON.stringify(payload));
            return { 
                success: true, 
                leadId: 'offline-' + Date.now(), 
                message: 'Saved locally (offline mode)',
                isOffline: true
            };
        }
    }

    _trackConversion(leadData, response) {
        // Track event
        window.behaviorTracker?.trackEvent('lead_converted', {
            leadId: response.leadId,
            name: leadData.name,
            email: leadData.email,
            service: leadData.service,
            score: leadData.score,
            intent: leadData.intent
        });

        // Google Analytics
        if (window.gtag) {
            window.gtag('event', 'form_submission', {
                'event_category': 'lead_capture',
                'event_label': leadData.service || 'General',
                'value': leadData.score || 50
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: leadData.service || 'Website Lead',
                content_category: leadData.intent || 'General'
            });
        }

        console.log('✅ Lead converted:', response.leadId);
    }

    _monitorLeadReadiness() {
        // Show lead capture prompt after specific engagement
        setInterval(() => {
            if (!window.behaviorTracker) return;

            const profile = window.behaviorTracker.getProfile?.();
            if (!profile) return;

            // Trigger if high engagement detected and form visible
            const form = document.querySelector(this.formSelector.join(', '));
            if (form && profile.sessionDuration > 30000 && profile.scrollDepth > 50) {
                // Highlight form
                form.classList.add('lead-form-highlight');

                // Optional: Show subtle notification
                console.log('💡 Lead is ready for capture - high engagement detected');
            }
        }, 5000);
    }

    // Public method to manually trigger lead capture
    async captureManually(leadData) {
        window.premiumSuccessFlow?.showLoading();

        try {
            const response = await this._submitToBackend(leadData);
            if (response.success) {
                window.premiumSuccessFlow?.hideLoading();
                window.premiumSuccessFlow?.showSuccess(leadData);
                this._trackConversion(leadData, response);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            window.premiumSuccessFlow?.showError(error.message);
        }
    }

    // Get all captured leads
    getLeads() {
        return this.leads;
    }

    // Get lead by ID
    getLead(id) {
        return this.leads.find(l => l.id === id);
    }
}

// Bootstrap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedLeadCapture = new EnhancedLeadCapture();
    });
} else {
    window.enhancedLeadCapture = new EnhancedLeadCapture();
}

export { EnhancedLeadCapture };

