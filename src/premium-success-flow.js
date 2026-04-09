/**
 * Premium Success Flow System v2.0
 *
 * Replaces basic browser alerts with:
 * - Animated premium success UI
 * - Loading state with progress animation
 * - Auto WhatsApp trigger
 * - Thank-you page redirect or overlay
 * - Smooth fade-in animations
 */

class PremiumSuccessFlow {
    constructor() {
        this.isLoadingShown = false;
        this.successTimeout = null;
        this.whatsappMessage = encodeURIComponent(
            "Hi, I just submitted my audit request. Please share details."
        );
        this.init();
    }

    init() {
        // Inject CSS styles
        this._injectStyles();
    }

    _injectStyles() {
        const styles = `
            /* ═══════════════════════════════════════════════════════ */
            /* PREMIUM SUCCESS FLOW STYLES */
            /* ═══════════════════════════════════════════════════════ */

            /* Loading Overlay */
            .psf-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(15, 23, 42, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                backdrop-filter: blur(4px);
                animation: fadeInOverlay 0.3s ease-out;
            }

            @keyframes fadeInOverlay {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .psf-loading-container {
                text-align: center;
                color: white;
            }

            .psf-spinner {
                width: 60px;
                height: 60px;
                margin: 0 auto 30px;
                border: 4px solid rgba(255, 140, 0, 0.2);
                border-top-color: #ff8c00;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .psf-loading-text {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
            }

            .psf-loading-subtext {
                font-size: 0.95rem;
                color: #94a3b8;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 0.6;
                }
                50% {
                    opacity: 1;
                }
            }

            /* Progress Bar */
            .psf-progress-bar {
                height: 3px;
                background: rgba(255, 140, 0, 0.2);
                border-radius: 2px;
                margin-top: 20px;
                overflow: hidden;
            }

            .psf-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff8c00, #ffb13d);
                animation: progress 2.5s ease-out forwards;
                box-shadow: 0 0 10px rgba(255, 140, 0, 0.5);
            }

            @keyframes progress {
                from {
                    width: 0;
                }
                to {
                    width: 100%;
                }
            }

            /* Success Box */
            .psf-success-box {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                max-width: 500px;
                width: 90%;
                overflow: hidden;
                animation: successIn 0.5s cubic-bezier(0.23, 1, 0.320, 1);
            }

            @keyframes successIn {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            /* Success Header with gradient */
            .psf-success-header {
                background: linear-gradient(135deg, #ff8c00 0%, #ffb13d 100%);
                padding: 40px 30px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .psf-success-header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -10%;
                width: 200px;
                height: 200px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }

            .psf-checkmark {
                font-size: 4rem;
                animation: checkmarkScale 0.6s cubic-bezier(0.36, 0, 0.66, 1);
                display: inline-block;
            }

            @keyframes checkmarkScale {
                0% {
                    transform: scale(0);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }

            .psf-success-title {
                margin: 15px 0 5px;
                color: white;
                font-size: 1.8rem;
                font-weight: 700;
                letter-spacing: -0.5px;
            }

            .psf-success-subtitle {
                color: rgba(255, 255, 255, 0.95);
                font-size: 1rem;
                margin: 0;
                font-weight: 500;
            }

            /* Success Content */
            .psf-success-content {
                padding: 40px 30px;
            }

            .psf-timeline-item {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                opacity: 0;
                animation: slideInLeft 0.5s ease-out forwards;
            }

            .psf-timeline-item:nth-child(1) {
                animation-delay: 0.2s;
            }

            .psf-timeline-item:nth-child(2) {
                animation-delay: 0.3s;
            }

            .psf-timeline-item:nth-child(3) {
                animation-delay: 0.4s;
            }

            .psf-timeline-item:nth-child(4) {
                animation-delay: 0.5s;
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .psf-timeline-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
                width: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .psf-timeline-content {
                flex: 1;
            }

            .psf-timeline-label {
                font-weight: 600;
                color: #1a1a1a;
                margin: 0 0 3px;
                font-size: 0.95rem;
            }

            .psf-timeline-desc {
                color: #64748b;
                font-size: 0.85rem;
                margin: 0;
            }

            /* CTA Buttons */
            .psf-cta-section {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-top: 30px;
            }

            .psf-btn {
                padding: 14px 24px;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .psf-btn-primary {
                background: linear-gradient(135deg, #ff8c00 0%, #ffb13d 100%);
                color: white;
                box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
            }

            .psf-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
            }

            .psf-btn-secondary {
                background: #f1f5f9;
                color: #1a1a1a;
            }

            .psf-btn-secondary:hover {
                background: #e2e8f0;
                transform: translateY(-2px);
            }

            /* Close Button */
            .psf-close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .psf-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* Confetti Animation */
            .psf-confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                background: #ff8c00;
                pointer-events: none;
                animation: confettiFall 3s ease-out forwards;
            }

            @keyframes confettiFall {
                to {
                    transform: translateY(600px) rotateZ(720deg);
                    opacity: 0;
                }
            }

            /* Overlay for success */
            .psf-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 9997;
                animation: fadeInOverlay 0.3s ease-out;
            }

            /* Button Spinner */
            .psf-btn-spinner {
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                display: inline-block;
                animation: spin 0.8s linear infinite;
                margin-right: 8px;
            }

            /* Form Group Spacing */
            .form-group {
                margin-bottom: 25px !important;
            }

            /* Input Glow */
            .form-input:focus {
                outline: none;
                border-color: var(--primary) !important;
                box-shadow: 0 0 15px rgba(255, 140, 0, 0.3) !important;
                transform: translateY(-1px);
                transition: all 0.3s ease;
            }

            /* Responsive */
            @media (max-width: 600px) {
                .psf-success-box {
                    width: 95%;
                    max-width: none;
                }

                .psf-success-header {
                    padding: 30px 20px 20px;
                }

                .psf-success-content {
                    padding: 25px 20px;
                }

                .psf-success-title {
                    font-size: 1.5rem;
                }

                .psf-checkmark {
                    font-size: 3rem;
                }

                .psf-cta-section {
                    flex-direction: column;
                }

                .psf-btn {
                    width: 100%;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    /**
     * Show loading state with progress animation
     */
    showLoading(message = "Analyzing your requirements...", form = null) {
        if (this.isLoadingShown) return;

        // Button Loading State
        if (form) {
            this.currentForm = form; // Store for later reset
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                this.originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="psf-btn-spinner"></span> Analyzing...`;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }
        }

        const overlay = document.createElement('div');
        overlay.className = 'psf-loading-overlay';
        overlay.id = 'psf-loading-overlay';
        overlay.innerHTML = `
            <div class="psf-loading-container">
                <div class="psf-spinner"></div>
                <div class="psf-loading-text">${message}</div>
                <div class="psf-loading-subtext">Matchmaking with our strategy team...</div>
                <div class="psf-progress-bar">
                    <div class="psf-progress-fill"></div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.isLoadingShown = true;
    }

    /**
     * Hide loading overlay manually
     */
    hideLoading() {
        const overlay = document.getElementById('psf-loading-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeInOverlay 0.3s ease-out reverse';
            setTimeout(() => overlay.remove(), 300);
            this.isLoadingShown = false;
        }

        // Reset button state if form was stored
        if (this.currentForm && this.originalBtnText) {
            const submitBtn = this.currentForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = this.originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }
    }

    /**
     * Show premium success UI
     */
    showSuccess(leadData = {}) {
        this.hideLoading();

        const backdrop = document.createElement('div');
        backdrop.className = 'psf-backdrop';
        backdrop.id = 'psf-backdrop';

        const successBox = document.createElement('div');
        successBox.className = 'psf-success-box';
        successBox.id = 'psf-success-box';

        const name = (leadData.name || 'there').split(' ')[0];

        successBox.innerHTML = `
            <button class="psf-close-btn" onclick="document.getElementById('psf-backdrop')?.remove(); document.getElementById('psf-success-box')?.remove();">×</button>
            
            <div class="psf-success-header">
                <div class="psf-checkmark">✅</div>
                <h1 class="psf-success-title">Audit Submitted Successfully</h1>
                <p class="psf-success-subtitle">📞 Our expert will contact you within 60 minutes</p>
            </div>

            <div class="psf-success-content">
                <div class="psf-roadmap">
                    <div class="psf-timeline-item">
                        <div class="psf-timeline-icon">⚡</div>
                        <div class="psf-timeline-content">
                            <p class="psf-timeline-label">Instant Queue</p>
                            <p class="psf-timeline-desc">Your request is prioritized in our system</p>
                        </div>
                    </div>

                    <div class="psf-timeline-item">
                        <div class="psf-timeline-icon">📞</div>
                        <div class="psf-timeline-content">
                            <p class="psf-timeline-label">Direct Callback</p>
                            <p class="psf-timeline-desc">Expect a call from +91 72000 59453 shortly</p>
                        </div>
                    </div>

                    <div class="psf-timeline-item">
                        <div class="psf-timeline-icon">📊</div>
                        <div class="psf-timeline-content">
                            <p class="psf-timeline-label">Strategy Intel</p>
                            <p class="psf-timeline-desc">We are analyzing your site's growth potential</p>
                        </div>
                    </div>
                </div>

                <div class="psf-cta-section">
                    <button class="psf-btn psf-btn-primary" onclick="window.premiumSuccessFlow.openWhatsApp('${leadData.phone || ''}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span>GET INSTANT WHATSAPP UPDATE</span>
                    </button>
                    <button class="psf-btn psf-btn-secondary" onclick="document.getElementById('psf-backdrop').remove(); document.getElementById('psf-success-box').remove();">
                        Close Window
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(successBox);

        // Generate confetti
        this.generateConfetti();

        // Auto-trigger WhatsApp after 3 seconds if phone available
        if (leadData.phone) {
            setTimeout(() => {
                this.openWhatsApp(leadData.phone);
            }, 3000);
        }

        // Close on backdrop click
        backdrop.addEventListener('click', () => {
            backdrop.remove();
            successBox.remove();
        });
    }

    /**
     * Open WhatsApp with pre-filled message
     */
    openWhatsApp(phone) {
        if (!phone) {
            console.warn('No phone number provided for WhatsApp');
            return;
        }

        // Clean phone number (remove spaces, dashes, etc.)
        const cleanPhone = phone.replace(/\D/g, '');

        // Ensure it has country code (assume +91 for India if not present)
        let whatsappPhone = cleanPhone;
        if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
            whatsappPhone = '91' + cleanPhone;
        }

        const whatsappURL = `https://wa.me/${whatsappPhone}?text=${this.whatsappMessage}`;
        window.open(whatsappURL, '_blank');

        // Track WhatsApp click
        window.behaviorTracker?.trackEvent('whatsapp_opened', {
            phone: cleanPhone,
            source: 'success_flow'
        });
    }

    /**
     * Generate confetti animation
     */
    generateConfetti() {
        const confettiCount = 30;
        const colors = ['#ff8c00', '#ffb13d', '#ff6b6b', '#4ecdc4', '#45b7d1'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'psf-confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.delay = Math.random() * 0.3 + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    /**
     * Show thank you page or redirect
     */
    redirectToThankyou(url = '/thank-you.html') {
        setTimeout(() => {
            window.location.href = url;
        }, 4000);
    }

    /**
     * Show error state
     */
    showError(message = "Something went wrong. Please try again.", form = null) {
        this.hideLoading();

        // Reset button state
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && this.originalBtnText) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = this.originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }

        const backdrop = document.createElement('div');
        backdrop.className = 'psf-backdrop';
        backdrop.id = 'psf-backdrop';

        const errorBox = document.createElement('div');
        errorBox.className = 'psf-success-box';
        errorBox.style.borderTop = '4px solid #ef4444';
        errorBox.id = 'psf-error-box';

        errorBox.innerHTML = `
            <div class="psf-success-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                <div class="psf-checkmark" style="font-size: 3rem;">⚠️</div>
                <h1 class="psf-success-title">Submission Failed</h1>
                <p class="psf-success-subtitle">${message}</p>
            </div>

            <div class="psf-success-content">
                <div class="psf-cta-section">
                    <button class="psf-btn psf-btn-primary" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);" onclick="location.reload()">
                        Try Again
                    </button>
                    <button class="psf-btn psf-btn-secondary" onclick="document.getElementById('psf-backdrop').remove(); document.getElementById('psf-error-box').remove();">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(errorBox);
    }
}

// Bootstrap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumSuccessFlow = new PremiumSuccessFlow();
    });
} else {
    window.premiumSuccessFlow = new PremiumSuccessFlow();
}

export { PremiumSuccessFlow };
