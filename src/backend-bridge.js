/**
 * MK Shopzone — Backend Bridge v4.0
 * ════════════════════════════════════════════════════════════════
 * Single entry point that connects ALL frontend modules to the
 * FastAPI AI Growth Engine backend.
 *
 * What it does:
 *  1.  Sends real-time session telemetry every 10 s → /api/v1/track
 *  2.  Applies AI personalization to page headings / CTAs
 *  3.  Triggers lead-capture popup based on AI signal
 *  4.  Submits chatbot leads → /api/v1/chatbot/lead
 *  5.  Fires retargeting pixels (GA4 + FB Pixel) on conversion
 *  6.  beforeunload beacon for final session flush
 */

class BackendBridge {
    constructor() {
        this._sessionFlushed = false;
        this._personalizationApplied = false;
        this._popupTriggered = false;
        this._ready = false;

        // Wait until behavior tracker is online, then start
        this._waitForTracker();
    }

    /* ══════════════════════════════════════════════════════════
       BOOT
    ══════════════════════════════════════════════════════════ */

    _waitForTracker() {
        const t = setInterval(() => {
            if (window.behaviorTracker) {
                clearInterval(t);
                this._ready = true;
                this._startHeartbeat();
                this._registerBeforeUnload();
                console.log('🔗 Backend Bridge: online');
            }
        }, 300);
    }

    /* ══════════════════════════════════════════════════════════
       1. HEARTBEAT — sends telemetry every 10 s
    ══════════════════════════════════════════════════════════ */

    _startHeartbeat() {
        // Immediate first ping after 3 s
        setTimeout(() => this._syncWithBackend(), 3000);

        // Then every 10 s
        setInterval(() => this._syncWithBackend(), 10_000);
    }

    async _syncWithBackend() {
        if (!this._ready) return;

        try {
            const tracker  = window.behaviorTracker;
            const session  = tracker.session;

            // Build telemetry payload matching SessionTelemetry model
            const payload = {
                sessionId:   session.id,
                userAgent:   navigator.userAgent,
                platform:    /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                scrollDepth: session.scrollDepth  || 0,
                duration:    session.totalTime    || 0,
                pages_visited: (session.pagesVisited || []).map(p => p.path || p),
                events: (session.clicks || []).slice(-30).map(c => ({
                    type:      'click',
                    target:    c.text   || c.id || '',
                    path:      window.location.pathname,
                    timestamp: new Date(c.time || Date.now()).toISOString(),
                    metadata:  c
                }))
            };

            const res = await fetch('/api/v1/track', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            if (!res.ok) return;

            const data = await res.json();

            // 2. Apply personalization from backend response
            if (data.personalization && !this._personalizationApplied) {
                this._applyPersonalization(data.personalization);
            }

            // 3. Trigger lead popup if AI says so
            if (data.shouldShowLeadPopup && !this._popupTriggered) {
                this._triggerLeadCapture(data.recommendation);
            }

        } catch (_) {
            // Backend offline — silent fail, site still works
        }
    }

    /* ══════════════════════════════════════════════════════════
       2. PERSONALIZATION — update hero headline / CTA
    ══════════════════════════════════════════════════════════ */

    _applyPersonalization(p) {
        if (!p || this._personalizationApplied) return;
        this._personalizationApplied = true;

        // ── Hero headline ──────────────────────────────────────────────────
        const h1 = document.getElementById('hero-title')
                || document.querySelector('h1:not([data-no-personalize])');
        if (h1 && p.headline && !h1.dataset.personalized) {
            this._smoothTextSwap(h1, p.headline);
            h1.dataset.personalized = '1';
        }

        // ── Hero subheading ────────────────────────────────────────────────
        const sub = document.getElementById('hero-sub');
        if (sub && p.subheading && !sub.dataset.personalized) {
            this._smoothTextSwap(sub, p.subheading);
            sub.dataset.personalized = '1';
        }

        // ── Primary CTA button ─────────────────────────────────────────────
        const cta = document.getElementById('cta-btn')
                 || document.querySelector('.btn-primary:not([data-no-personalize])');
        if (cta && p.cta && !cta.dataset.personalized) {
            this._smoothTextSwap(cta, p.cta);
            cta.dataset.personalized = '1';
        }

        // ── Service card highlight ─────────────────────────────────────────
        if (p.intent && p.intent !== 'General') {
            this._highlightServiceCard(p.intent);
        }

        // ── Forward to personalization engine ─────────────────────────────
        if (window.personalizationEngine) {
            window.personalizationEngine.applyDynamicContent({
                headline:     p.headline,
                subheading:   p.subheading,
                cta:          p.cta,
                user_intent:  p.intent,
                buying_stage: p.stage || 'Awareness',
            });
        }

        console.log(`🎯 Personalized for intent: ${p.intent}`);
    }

    /** Fade-swap text for smooth, non-jarring personalization */
    _smoothTextSwap(el, newText) {
        el.style.transition = 'opacity 0.35s ease';
        el.style.opacity    = '0';
        setTimeout(() => {
            // Preserve inner HTML structure (e.g. <span class="gradient-text">)
            // Only replace plain-text content nodes, keep child elements
            const first = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
            if (first) {
                first.textContent = newText;
            } else {
                el.textContent = newText;
            }
            el.style.opacity = '1';
        }, 350);
    }

    _highlightServiceCard(intent) {
        // Map backend intent strings → data-service attribute values
        const intentToService = {
            'SEO':             'seo',
            'Paid Ads':        'ads',
            'Web Design':      'web',
            'App Development': 'app',
            'Social Media':    'social',
            'E-commerce':      'ecommerce',
            'Email Marketing': 'email',
            'Video Marketing': 'video',
        };
        const target = intentToService[intent];

        document.querySelectorAll('[data-service]').forEach(card => {
            card.style.transition = 'all 0.4s cubic-bezier(.22,.61,.36,1)';
            if (target && card.dataset.service === target) {
                // Highlight matched card
                card.style.borderColor = 'rgba(99,102,241,0.7)';
                card.style.boxShadow   = '0 0 32px rgba(99,102,241,0.3), 0 20px 40px rgba(0,0,0,0.08)';
                card.style.transform   = 'translateY(-6px) scale(1.02)';
                card.style.opacity     = '1';
                // Scroll card into view if not visible
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                // Dim non-matching cards
                card.style.opacity   = '0.55';
                card.style.transform = 'none';
            }
        });

        // Restore all cards after 8 s so the page doesn't stay locked
        setTimeout(() => {
            document.querySelectorAll('[data-service]').forEach(card => {
                card.style.opacity     = '';
                card.style.transform   = '';
                card.style.borderColor = '';
                card.style.boxShadow   = '';
            });
        }, 8000);
    }

    /* ══════════════════════════════════════════════════════════
       3. LEAD CAPTURE TRIGGER
    ══════════════════════════════════════════════════════════ */

    _triggerLeadCapture(offer) {
        if (this._popupTriggered) return;
        this._popupTriggered = true;

        // Don't show if lead already captured this session
        if (localStorage.getItem('mk_lead_captured')) return;

        // Open the chatbot pre-form with personalised offer message
        if (window.mkAssistant && !window.mkAssistant.isOpen) {
            setTimeout(() => {
                window.mkAssistant.open();
                const msg = offer
                    ? `🎁 We have a special offer for you: **${offer}** — completely free. Fill in your details and we'll get it set up right away!`
                    : `👋 You've been exploring our services — let me connect you with the right expert. Takes 30 seconds!`;
                // Send proactive message after form seen
                setTimeout(() => window.mkAssistant?.sendMessage?.(msg, 'bot'), 1500);
            }, 1200);
            return;
        }

        // Fallback to standalone popup if no chatbot
        this._showFallbackPopup(offer);
    }

    _showFallbackPopup(offer) {
        if (document.getElementById('bb-lead-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'bb-lead-popup';
        popup.setAttribute('role', 'dialog');
        popup.innerHTML = `
        <style>
          #bb-lead-popup {
            position: fixed; inset: 0;
            background: rgba(5,5,15,0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            animation: bbFadeIn .4s ease;
          }
          @keyframes bbFadeIn { from { opacity: 0; } }
          #bb-popup-card {
            background: #0d0f1c;
            border: 1px solid rgba(99,102,241,0.3);
            border-radius: 18px;
            padding: 36px;
            width: 100%; max-width: 440px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.6);
            position: relative;
            animation: bbSlideUp .45s cubic-bezier(.22,.61,.36,1);
          }
          @keyframes bbSlideUp { from { opacity:0; transform:translateY(24px); } }
          #bb-popup-card h2 { font-size:1.4rem; font-weight:800; margin-bottom:6px; color:#f1f5f9; }
          #bb-popup-card p  { font-size:.9rem; color:#94a3b8; margin-bottom:22px; }
          #bb-popup-card input {
            width:100%; padding:12px 16px;
            background: rgba(255,255,255,.05);
            border: 1px solid rgba(255,255,255,.1);
            border-radius:10px; color:#f1f5f9; font-size:.9rem;
            margin-bottom:12px; font-family:inherit; outline:none;
            transition: border-color .2s;
          }
          #bb-popup-card input:focus { border-color: rgba(99,102,241,.6); }
          #bb-submit-btn {
            width:100%; padding:14px;
            background: linear-gradient(135deg,#6366f1,#4f46e5);
            border:none; border-radius:10px; color:#fff;
            font-size:1rem; font-weight:700; cursor:pointer; font-family:inherit;
            transition: transform .15s, box-shadow .15s;
          }
          #bb-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,.5); }
          #bb-close-popup {
            position:absolute; top:14px; right:16px;
            background:none; border:none; color:#475569;
            font-size:1.4rem; cursor:pointer; line-height:1;
          }
          #bb-close-popup:hover { color:#94a3b8; }
          .bb-offer-tag {
            display:inline-flex; align-items:center; gap:6px;
            background: rgba(34,197,94,.12); color:#22c55e;
            padding:4px 12px; border-radius:20px;
            font-size:.78rem; font-weight:600; margin-bottom:16px;
          }
        </style>
        <div id="bb-popup-card">
          <button id="bb-close-popup" aria-label="Close">×</button>
          <h2>🚀 Claim Your Free Offer</h2>
          ${offer ? `<div class="bb-offer-tag">🎁 ${offer}</div>` : ''}
          <p>Enter your details and our expert will reach out within 60 minutes.</p>
          <input type="text"  id="bb-name"  placeholder="Your Name"     autocomplete="name">
          <input type="email" id="bb-email" placeholder="Email Address"  autocomplete="email">
          <input type="tel"   id="bb-phone" placeholder="Phone Number"   autocomplete="tel">
          <input type="text"  id="bb-biz"   placeholder="Company / Business (optional)">
          <button id="bb-submit-btn">Get My Free Consultation →</button>
        </div>`;

        document.body.appendChild(popup);

        // Close button
        popup.querySelector('#bb-close-popup').onclick = () => popup.remove();
        popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });

        // Submit
        popup.querySelector('#bb-submit-btn').onclick = async () => {
            const name  = document.getElementById('bb-name')?.value?.trim();
            const email = document.getElementById('bb-email')?.value?.trim();
            const phone = document.getElementById('bb-phone')?.value?.trim();
            const biz   = document.getElementById('bb-biz')?.value?.trim();

            if (!name || !email) {
                alert('Please enter your name and email.');
                return;
            }

            const btn = popup.querySelector('#bb-submit-btn');
            btn.textContent = '⏳ Submitting…';
            btn.disabled = true;

            await this.submitLead({ name, email, phone, business: biz, source: 'popup', offer });

            popup.innerHTML = `
              <div id="bb-popup-card" style="text-align:center;padding:48px 36px;">
                <div style="font-size:3rem;margin-bottom:16px">🎉</div>
                <h2>You're all set, ${name.split(' ')[0]}!</h2>
                <p style="margin-top:8px">Our expert will contact you within 60 minutes with your personalised strategy.</p>
                <p style="margin-top:16px;font-size:.85rem;color:#475569">Check your email for a welcome package.</p>
              </div>`;

            setTimeout(() => popup.remove(), 5000);
        };
    }

    /* ══════════════════════════════════════════════════════════
       4. LEAD SUBMISSION (unified)
    ══════════════════════════════════════════════════════════ */

    async submitLead(leadData) {
        const sessionId = window.behaviorTracker?.session?.id || 'bridge-' + Date.now();
        const intent    = window.behaviorTracker?.getIntentAnalysis?.()?.user_intent || leadData.intent || 'General';

        const payload = {
            name:        leadData.name     || '',
            email:       leadData.email    || '',
            phone:       leadData.phone    || '',
            business:    leadData.business || '',
            message:     leadData.message  || '',
            sessionId,
            intent,
            buyingStage: leadData.buyingStage || window.behaviorTracker?.session?.buyingStage || 'Consideration',
            score:       leadData.score || 50,
            metadata: {
                source:    leadData.source  || 'website',
                offer:     leadData.offer   || '',
                page:      window.location.pathname,
                referrer:  document.referrer || '',
                utm_source:   new URLSearchParams(location.search).get('utm_source')  || '',
                utm_campaign: new URLSearchParams(location.search).get('utm_campaign') || '',
            }
        };

        try {
            const res = await fetch('/api/v1/leads', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            if (res.ok) {
                const result = await res.json();
                localStorage.setItem('mk_lead_captured', '1');
                localStorage.setItem('mk_lead_id', result.leadId || '');
                this._fireConversionPixels(leadData, intent);
                console.log('✅ Lead captured:', result.leadId);
                return result;
            }
        } catch (_) {
            // Offline fallback — store locally
            const stored = JSON.parse(localStorage.getItem('mk_pending_leads') || '[]');
            stored.push({ ...payload, _offline: true, _ts: Date.now() });
            localStorage.setItem('mk_pending_leads', JSON.stringify(stored));
            console.warn('⚠️ Backend offline — lead queued locally');
        }
        return null;
    }

    /* ══════════════════════════════════════════════════════════
       5. RETARGETING PIXELS
    ══════════════════════════════════════════════════════════ */

    _fireConversionPixels(lead, intent) {
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', 'generate_lead', {
                event_category: 'engagement',
                event_label:     intent,
                value:           lead.score || 50,
            });
            gtag('event', 'conversion');
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Lead', {
                content_name:     intent,
                content_category: 'Digital Marketing',
            });
        }

        console.log('📡 Conversion pixels fired for:', intent);
    }

    /* ══════════════════════════════════════════════════════════
       6. BEFORE-UNLOAD beacon (final session flush)
    ══════════════════════════════════════════════════════════ */

    _registerBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            if (this._sessionFlushed) return;
            this._sessionFlushed = true;

            const session   = window.behaviorTracker?.session || {};
            const payload   = JSON.stringify({
                sessionId:   session.id,
                userAgent:   navigator.userAgent,
                platform:    /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                scrollDepth: session.scrollDepth || 0,
                duration:    Math.round((Date.now() - (session.startTime || Date.now())) / 1000),
                pages_visited: (session.pagesVisited || []).map(p => p.path || p),
                events: []
            });

            // sendBeacon is fire-and-forget — works even as page unloads
            navigator.sendBeacon('/api/v1/track', new Blob([payload], { type: 'application/json' }));
        });
    }

    /* ══════════════════════════════════════════════════════════
       RETRY QUEUED OFFLINE LEADS
    ══════════════════════════════════════════════════════════ */

    async _retryOfflineLeads() {
        const pending = JSON.parse(localStorage.getItem('mk_pending_leads') || '[]');
        if (!pending.length) return;

        const retry = [];
        for (const lead of pending) {
            try {
                const res = await fetch('/api/v1/leads', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(lead)
                });
                if (!res.ok) retry.push(lead);
            } catch (_) {
                retry.push(lead);
            }
        }

        localStorage.setItem('mk_pending_leads', JSON.stringify(retry));
        if (pending.length !== retry.length) {
            console.log(`✅ Synced ${pending.length - retry.length} offline leads`);
        }
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    window.backendBridge = new BackendBridge();

    // Retry any leads that failed while offline
    setTimeout(() => window.backendBridge._retryOfflineLeads(), 5000);
});
