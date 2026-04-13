/**
 * Behavior Tracker v4.0 - Performance & Engagement Analytics
 * Analyzes real-time user behavior to fuel personalization and lead conversion.
 */

class BehaviorTracker {
    constructor() {
        this.session = {
            id: this._generateId(),
            startTime: Date.now(),
            pagesVisited: [],
            totalTime: 0,
            scrollDepth: 0,
            clicks: [],
            events: [],
            trafficSource: this._getTrafficSource(),
            intentScore: {
                seo: 0,
                ads: 0,
                social: 0,
                web: 0,
                app: 0,
                general: 0
            },
            buyingStage: 'Awareness' // Default
        };

        this.pageStartTime = Date.now();
        this._init();
    }

    _init() {
        this._trackPageView();
        this._bindEvents();
        this._startHeartbeat();
        this._syncWithPersonalization();
    }

    _trackPageView() {
        const path = window.location.pathname;
        const pageData = {
            path: path,
            startTime: Date.now(),
            timeSpent: 0
        };
        this.session.pagesVisited.push(pageData);
        this._calculateIntent(path);
        this._save();
    }

    _calculateIntent(path) {
        if (path.includes('seo')) this.session.intentScore.seo += 5;
        else if (path.includes('paid-ads')) this.session.intentScore.ads += 5;
        else if (path.includes('social-media')) this.session.intentScore.social += 5;
        else if (path.includes('website-design')) this.session.intentScore.web += 5;
        else if (path.includes('app')) this.session.intentScore.app += 5;
        else this.session.intentScore.general += 1;

        // Detect buying stage based on specific high-intent pages
        if (path.includes('contact') || path.includes('audit')) {
            this.session.buyingStage = 'Decision';
        } else if (this.session.pagesVisited.length > 3) {
            this.session.buyingStage = 'Consideration';
        }
    }

    _bindEvents() {
        // Track Clicks
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, a, .btn');
            if (btn) {
                const clickData = {
                    text: btn.innerText.trim().substring(0, 30),
                    id: btn.id || null,
                    tag: btn.tagName,
                    time: Date.now()
                };
                this.session.clicks.push(clickData);
                
                // High intent clicks
                if (btn.innerText.toLowerCase().includes('consult') || btn.innerText.toLowerCase().includes('audit') || btn.innerText.toLowerCase().includes('start')) {
                    this.session.buyingStage = 'Decision';
                }
                
                this._save();
            }
        });

        // Track Scroll
        window.addEventListener('scroll', () => {
            const h = document.documentElement, 
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
            if (percent > this.session.scrollDepth) {
                this.session.scrollDepth = Math.round(percent);
            }
        });

        // Track Visibility (End page time)
        window.addEventListener('beforeunload', () => {
            this._updateCurrentPageTime();
        });
    }

    _updateCurrentPageTime() {
        const lastPage = this.session.pagesVisited[this.session.pagesVisited.length - 1];
        if (lastPage) {
            lastPage.timeSpent = Math.round((Date.now() - lastPage.startTime) / 1000);
            this.session.totalTime = Math.round((Date.now() - this.session.startTime) / 1000);
        }
    }

    _startHeartbeat() {
        setInterval(() => {
            this._updateCurrentPageTime();
            this._analyzeIntent();
            this._reportToBackend();
            this._save();
        }, 10000); // 10s intervals for production stability
    }

    _analyzeIntent() {
        // Analyze click patterns
        this.session.clicks.forEach(c => {
            const t = c.text.toLowerCase();
            if (t.includes('seo')) this.session.intentScore.seo += 2;
            if (t.includes('ads') || t.includes('ppc')) this.session.intentScore.ads += 2;
            if (t.includes('web') || t.includes('design')) this.session.intentScore.web += 2;
        });

        // Analyze time spent
        this.session.pagesVisited.forEach(p => {
            if (p.timeSpent > 30) {
                if (p.path.includes('seo')) this.session.intentScore.seo += 3;
                if (p.path.includes('paid-ads')) this.session.intentScore.ads += 3;
            }
        });
    }

    _syncWithPersonalization() {
        setInterval(() => {
            if (window.personalizationEngine) {
                const analysis = this.getIntentAnalysis();
                window.personalizationEngine.applyDynamicContent(analysis);
            }
        }, 3000);
    }

    async _reportToBackend() {
        try {
            const data = {
                sessionId: this.session.id,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                events: this.session.clicks.map(c => ({
                    type: 'click',
                    target: c.text,
                    path: window.location.pathname,
                    metadata: c
                })),
                scrollDepth: this.session.scrollDepth,
                duration: this.session.totalTime
            };

            const response = await fetch('/api/v1/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.personalization && window.personalizationEngine) {
                    window.personalizationEngine.applyDynamicContent(result.personalization);
                }
            }
        } catch (e) {
            console.warn('Backend tracking sync failed (Offline/Dev Mode)');
        }
    }

    getIntentAnalysis() {
        const scores = this.session.intentScore;
        const maxScore = Math.max(...Object.values(scores));
        let intent = 'General Inquiry';
        
        if (maxScore > 0) {
            if (scores.seo === maxScore) intent = 'SEO Services';
            else if (scores.ads === maxScore) intent = 'Paid Ads';
            else if (scores.social === maxScore) intent = 'Social Media Marketing';
            else if (scores.web === maxScore) intent = 'Website Design';
            else if (scores.app === maxScore) intent = 'App Development';
        }

        const buyingStage = this.session.buyingStage;
        
        // Dynamic Personalization Logic
        const content = this._generatePersonalizedContent(intent, buyingStage);

        return {
            user_intent: intent,
            buying_stage: buyingStage,
            recommended_service: intent,
            ...content,
            popup_strategy: buyingStage === 'Decision' ? 'chatbot' : 'popup',
            whatsapp_message: this._generateWhatsApp(intent),
            email_message: this._generateEmail(intent, buyingStage),
            retargeting_ad: this._generateRetargeting(intent)
        };
    }

    /**
     * Public API for custom event tracking
     */
    trackEvent(name, metadata = {}) {
        const eventData = {
            type: name,
            timestamp: new Date().toISOString(),
            path: window.location.pathname,
            ...metadata
        };
        this.session.events.push(eventData);
        this._save();
        console.log(`📊 Lead System Event: ${name}`, metadata);
    }

    /**
     * Public API to get current engagement profile
     */
    getProfile() {
        const now = Date.now();
        const duration = now - this.session.startTime;
        
        return {
            sessionId: this.session.id,
            sessionDuration: duration, // millisecond timestamp used by main.js
            scrollDepth: this.session.scrollDepth,
            buyingStage: this.session.buyingStage,
            intentScore: this.session.intentScore,
            clicks: this.session.clicks.length,
            pagesVisited: this.session.pagesVisited.length,
            trafficSource: this.session.trafficSource
        };
    }

    _generatePersonalizedContent(intent, stage) {
        const data = {
            'SEO Services': {
                Awareness: { h: "Want to Rank #1 on Google?", s: "Discover how our clinical SEO strategies drive organic revenue.", c: "GET FREE SEO AUDIT" },
                Consideration: { h: "Outrank Your Competitors Today", s: "Our data-driven SEO framework is engineered for aggressive growth.", c: "VIEW OUR SUCCESS STORIES" },
                Decision: { h: "Ready to Dominate Search?", s: "Let's build your search authority. Claim your custom 90-day roadmap.", c: "START YOUR SEO JOURNEY" }
            },
            'Paid Ads': {
                Awareness: { h: "Stop Wasting Your Ad Budget", s: "We build laser-targeted campaigns that deliver 3-5x ROAS.", c: "GET FREE ADS AUDIT" },
                Decision: { h: "Scale Your Revenue with PPC", s: "Our media buyers manage ₹12M+ capital with surgical precision.", c: "START SCALING NOW" }
            },
            'Website Design': {
                Awareness: { h: "Build a Digital Empire", s: "Elite web engineering designed to convert visitors into advocates.", c: "SEE OUR WORK" },
                Decision: { h: "Your Site is Your Best Salesman", s: "Let's re-engineer your digital storefront for maximum performance.", c: "GET A CUSTOM QUOTE" }
            }
        };

        const fallback = { h: "Grow Your Business Online", s: "Clinical digital marketing and engineering for modern brands.", c: "GET A FREE CONSULTATION" };
        
        const intentData = data[intent] || data['SEO Services'];
        const content = intentData[stage] || intentData['Awareness'] || fallback;

        return {
            headline: content.h,
            subheading: content.s,
            cta: content.c
        };
    }

    _generateWhatsApp(intent) {
        return `Hi! I saw you were looking into our ${intent} at MK Shopzone. Would you like a quick 5-min strategy audit for your project?`;
    }

    _generateEmail(intent, stage) {
        return `Subject: Transform your ${intent} Strategy\n\nHi,\n\nI noticed you were exploring our ${intent} solutions. Most of our clients see a 300% growth in the first 6 months. Would you be open to a 10-minute strategy call this week?`;
    }

    _generateRetargeting(intent) {
        return `Angle: Efficiency & ROAS. Show case study of a client who achieved 5x ROAS using our ${intent} framework.`;
    }

    _getTrafficSource() {
        const ref = document.referrer;
        if (!ref) return 'Direct';
        if (ref.includes('google')) return 'Google Search';
        if (ref.includes('facebook')) return 'Facebook Ads';
        return 'Referral';
    }

    _generateId() { return 'sess_' + Math.random().toString(36).substr(2, 9); }
    _save() { localStorage.setItem('mk_behavior_session', JSON.stringify(this.session)); }
}

// Global Export
window.behaviorTracker = new BehaviorTracker();
