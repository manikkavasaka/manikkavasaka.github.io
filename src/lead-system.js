/**
 * Lead Capture & Scoring System
 * Automated lead qualification and management
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
        this.attachFormHandlers();
        this.monitorLeadReadiness();
        this.setupAutoPopulation();
    }

    attachFormHandlers() {
        const form = document.getElementById('contactForm') || document.getElementById('auditForm');
        if (!form) return;

        form.addEventListener('change', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.trackFormProgress(e.target);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.captureAndQualifyLead(form);
        });
    }

    setupAutoPopulation() {
        // Auto-populate form from chatbot or tracking data
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Check if chatbot has collected any info
        const chatInfo = window.aiChatbot?.extractLeadInfo?.();
        if (chatInfo?.email) {
            const emailInput = form.querySelector('#email');
            if (emailInput && !emailInput.value) {
                emailInput.value = chatInfo.email;
            }
        }

        // Auto-populate service based on behavior tracking
        const suggestedService = window.behaviorTracker?.getSuggestedService?.();
        if (suggestedService) {
            const serviceSelect = form.querySelector('#service-select');
            if (serviceSelect) {
                const option = Array.from(serviceSelect.options).find(o =>
                    o.value === suggestedService
                );
                if (option) {
                    serviceSelect.value = suggestedService;
                    serviceSelect.dispatchEvent(new Event('change'));
                }
            }
        }
    }

    trackFormProgress(element) {
        const form = element.closest('form');
        const completionPercent = this.calculateFormCompletion(form);

        window.behaviorTracker?.trackEvent('form_progress', {
            field: element.name || element.id,
            completionPercent,
            value: element.value.slice(0, 50)
        });
    }

    calculateFormCompletion(form) {
        if (!form) return 0;

        const requiredFields = Array.from(form.querySelectorAll('[required]'));
        const filledFields = requiredFields.filter(f => f.value.trim());

        return Math.round((filledFields.length / requiredFields.length) * 100);
    }

    async captureAndQualifyLead(form) {
        // Extract form data
        const formData = new FormData(form);
        const lead = {
            id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            source: 'contact_form',
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            service: formData.get('service-select') || '',
            message: formData.get('message') || '',
            sessionId: window.behaviorTracker?.sessionId,
            utmSource: this.getUTMParam('source'),
            utmCampaign: this.getUTMParam('campaign')
        };

        // Add tracking data
        const sessionSummary = window.behaviorTracker?.getSessionSummary?.();
        if (sessionSummary) {
            lead.sessionData = sessionSummary;
        }

        // Calculate lead score
        lead.score = this.calculateLeadScore(lead, sessionSummary);
        lead.quality = this.determineLeadQuality(lead.score);

        // Save lead
        this.saveLead(lead);

        // Show success state
        this.showLeadSubmitSuccess(form, lead);

        // Send to backend
        await this.submitLeadToBackend(lead);

        // Trigger post-conversion actions
        this.executePostConversionActions(lead);
    }

    calculateLeadScore(lead, sessionData) {
        let score = 0;

        // Service interest score (0-40)
        const serviceScore = this.calculateServiceInterest(lead.service, sessionData) * this.scoreWeights.serviceInterest;

        // Engagement time score (0-30)
        const timeScore = Math.min(sessionData?.duration || 30 / 300, 1) * 30 * this.scoreWeights.engagementTime;

        // Form completion score (0-20)
        const form = document.getElementById('contactForm');
        const completionScore = this.calculateFormCompletion(form) * this.scoreWeights.formCompletion;

        // Source score (0-10)
        const sourceScore = this.getSourceScore(lead.source) * this.scoreWeights.source;

        return Math.round(serviceScore + timeScore + completionScore + sourceScore);
    }

    calculateServiceInterest(service, sessionData) {
        if (!sessionData?.services) return 0.5;

        const serviceCount = sessionData.services.filter(s => s === service).length;
        return Math.min(serviceCount / 5, 1);
    }

    getSourceScore(source) {
        const sourceScores = {
            'contact_form': 8,
            'chatbot': 7,
            'popup': 5,
            'organic': 6,
            'paid': 7,
            'social': 5
        };
        return sourceScores[source] || 5;
    }

    determineLeadQuality(score) {
        if (score >= 80) return 'hot';
        if (score >= 60) return 'warm';
        if (score >= 40) return 'cool';
        return 'cold';
    }

    saveLead(lead) {
        this.leads.push(lead);

        // Save to localStorage
        let savedLeads = JSON.parse(localStorage.getItem('mk_leads') || '[]');
        savedLeads.push(lead);
        localStorage.setItem('mk_leads', JSON.stringify(savedLeads));

        console.log(`Lead captured: ${lead.name} (Score: ${lead.score}, Quality: ${lead.quality})`);
    }

    async submitLeadToBackend(lead) {
        try {
            // Try to submit to backend API
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': import.meta.env.VITE_API_KEY || ''
                },
                body: JSON.stringify(lead)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Lead submitted successfully:', result);

                // Send immediate follow-up email via backend
                if (result.success) {
                    this.triggerFollowUpEmail(lead);
                }
            }
        } catch (error) {
            console.error('Failed to submit lead:', error);
            // Lead is still saved locally even if backend fails
        }
    }

    triggerFollowUpEmail(lead) {
        // This would be called by backend, but we can trigger notification here
        window.behaviorTracker?.trackEvent('lead_converted', {
            leadId: lead.id,
            quality: lead.quality,
            score: lead.score,
            service: lead.service
        });
    }

    showLeadSubmitSuccess(form, lead) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = '✓ Lead Submitted Successfully!';
        btn.disabled = true;
        btn.style.background = '#22c55e';

        // Show lead quality indicator
        const qualityEmojis = { hot: '🔥', warm: '☀️', cool: '❄️', cold: '❓' };
        const message = `
            <div style="padding: 20px; margin-top: 20px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; text-align: center;">
                <p style="font-size: 1.5em; margin: 0;">${qualityEmojis[lead.quality]}</p>
                <p style="margin: 10px 0 0; color: #22c55e; font-weight: 600;">Thank you, ${lead.name.split(' ')[0]}!</p>
                <p style="margin: 5px 0 0; color: #94a3b8; font-size: 0.9rem;">Our team will contact you within 60 minutes.</p>
            </div>
        `;

        form.insertAdjacentHTML('afterend', message);

        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    }

    executePostConversionActions(lead) {
        // Show success notification
        this.showNotification(`${lead.name}, your request has been received! 🎉`, 'success', 5000);

        // Track conversion
        if (window.gtag) {
            window.gtag('event', 'form_submission', {
                'event_category': 'engagement',
                'event_label': lead.service,
                'value': lead.score
            });
        }

        // Show next steps
        this.showNextSteps(lead);
    }

    showNextSteps(lead) {
        const stepsContent = `
            <div style="position: fixed; top: 20px; right: 20px; background: #1a1a1a; color: white; padding: 20px; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 350px; z-index: 1000; animation: slideIn 0.5s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary);">What Happens Next</h3>
                    <button style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0;">×</button>
                </div>
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">📧 Check your email for our welcome package</li>
                    <li style="margin-bottom: 8px;">📞 Expect a call from our strategy team</li>
                    <li style="margin-bottom: 8px;">📊 Receive your personalized audit report</li>
                    <li style="margin-bottom: 8px;">🚀 Start your growth transformation</li>
                </ol>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">Have questions? Reply to the email or call +91 95007 04443</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', stepsContent);

        // Auto-close after 8 seconds
        setTimeout(() => {
            const modal = document.querySelector('[style*="position: fixed"]');
            if (modal) modal.remove();
        }, 8000);

        // Close on button click
        document.querySelector('[style*="position: fixed"] button')?.addEventListener('click', function() {
            this.closest('[style*="position: fixed"]').remove();
        });
    }

    showNotification(message, type = 'info', duration = 3000) {
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            info: 'var(--primary)',
            warning: '#eab308'
        };

        const notification = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${colors[type]};
                color: white;
                padding: 15px 30px;
                border-radius: 50px;
                font-weight: 600;
                z-index: 999;
                animation: slideDown 0.3s ease-out;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            ">
                ${message}
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', notification);

        setTimeout(() => {
            document.querySelector('[style*="animation: slideDown"]')?.remove();
        }, duration);
    }

    getUTMParam(param) {
        const params = new URLSearchParams(window.location.search);
        return params.get(param) || '';
    }

    // Get leads by quality
    getLeadsByQuality(quality) {
        return this.leads.filter(l => l.quality === quality);
    }

    // Get high-value leads (hot & warm)
    getHighValueLeads() {
        return this.leads.filter(l => l.quality === 'hot' || l.quality === 'warm');
    }

    // Get average lead score
    getAverageScore() {
        if (this.leads.length === 0) return 0;
        const sum = this.leads.reduce((acc, lead) => acc + lead.score, 0);
        return Math.round(sum / this.leads.length);
    }

    // Export leads
    exportLeads(format = 'json') {
        if (format === 'csv') {
            return this.convertToCSV(this.leads);
        }
        return JSON.stringify(this.leads, null, 2);
    }

    convertToCSV(data) {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Score', 'Quality', 'Date'];
        const rows = data.map(lead => [
            lead.id,
            lead.name,
            lead.email,
            lead.phone,
            lead.service,
            lead.score,
            lead.quality,
            new Date(lead.timestamp).toLocaleString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        return csv;
    }
}

// Initialize lead system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.leadSystem = new LeadSystem();
    });
} else {
    window.leadSystem = new LeadSystem();
}

