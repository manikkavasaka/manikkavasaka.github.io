/**
 * User Behavior Tracking System
 * Comprehensive analytics for user engagement and personalization
 */

class BehaviorTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.sessionData = {
            sessionId: this.sessionId,
            startTime: Date.now(),
            pageViews: [],
            scrollDepth: 0,
            timeOnPage: 0,
            interactedServices: [],
            formInteractions: [],
            exitIntent: false,
            isReturning: false
        };
        this.batchSize = 10;
        this.uploadInterval = 30000; // 30 seconds
        this.init();
    }

    init() {
        this.checkReturningVisitor();
        this.attachEventListeners();
        this.trackPageView();
        this.trackScrollDepth();
        this.setupBatchUpload();
        this.trackExitIntent();
        this.trackTimeOnPage();
    }

    generateSessionId() {
        let sessionId = sessionStorage.getItem('mkshopzone_session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('mkshopzone_session', sessionId);
        }
        return sessionId;
    }

    checkReturningVisitor() {
        const lastVisit = localStorage.getItem('mkshopzone_last_visit');
        if (lastVisit) {
            this.sessionData.isReturning = true;
            this.sessionData.lastVisitDate = lastVisit;
        }
        localStorage.setItem('mkshopzone_last_visit', new Date().toISOString());
    }

    attachEventListeners() {
        // Track service card clicks
        document.addEventListener('click', (e) => {
            const serviceCard = e.target.closest('[data-service]');
            if (serviceCard) {
                const service = serviceCard.dataset.service;
                this.trackEvent('service_viewed', { service });
                this.sessionData.interactedServices.push(service);
            }

            // Track form interactions
            if (e.target.matches('input, select, textarea')) {
                this.trackEvent('form_interaction', {
                    field: e.target.name || e.target.id,
                    type: e.target.type
                });
                this.sessionData.formInteractions.push(e.target.name || e.target.id);
            }
        });

        // Track video watch
        document.addEventListener('play', (e) => {
            if (e.target.tagName === 'VIDEO') {
                this.trackEvent('video_started', {
                    src: e.target.src
                });
            }
        }, true);

        // Track form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contactForm' || e.target.id === 'auditForm') {
                this.trackEvent('form_submitted', {
                    formId: e.target.id,
                    fields: Array.from(e.target.elements)
                        .filter(el => el.name)
                        .map(el => el.name)
                });
            }
        });

        // Track link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                this.trackEvent('link_clicked', {
                    href: link.href,
                    text: link.textContent.slice(0, 100)
                });
            }
        });
    }

    trackPageView() {
        this.sessionData.pageViews.push({
            page: window.location.pathname,
            timestamp: Date.now(),
            referrer: document.referrer
        });
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.sessionData.scrollDepth = Math.round(maxScroll);

                // Track milestone scroll depths
                if ([25, 50, 75, 90].includes(Math.round(scrollPercent))) {
                    this.trackEvent('scroll_milestone', {
                        depth: Math.round(scrollPercent)
                    });
                }
            }
        }, { passive: true });
    }

    trackExitIntent() {
        document.addEventListener('mouseleave', () => {
            this.sessionData.exitIntent = true;
            this.trackEvent('exit_intent', { timestamp: Date.now() });
        });
    }

    trackTimeOnPage() {
        setInterval(() => {
            this.sessionData.timeOnPage += 1;
        }, 1000);
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: data,
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent.slice(0, 100)
        };

        this.events.push(event);

        // Send immediately if batch is full
        if (this.events.length >= this.batchSize) {
            this.uploadEvents();
        }

        // Also log to personalization engine
        if (window.personalizationEngine) {
            window.personalizationEngine.onBehaviorEvent(event);
        }
    }

    setupBatchUpload() {
        setInterval(() => {
            if (this.events.length > 0) {
                this.uploadEvents();
            }
        }, this.uploadInterval);

        // Upload on page unload
        window.addEventListener('beforeunload', () => {
            if (this.events.length > 0) {
                this.uploadEvents(true); // use sendBeacon for reliability
            }
        });
    }

    async uploadEvents(useBeacon = false) {
        if (this.events.length === 0) return;

        const payload = {
            sessionId: this.sessionId,
            sessionData: this.sessionData,
            events: this.events,
            timestamp: Date.now(),
            isReturning: this.sessionData.isReturning,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        try {
            if (useBeacon && navigator.sendBeacon) {
                navigator.sendBeacon('/api/track', JSON.stringify(payload));
            } else {
                // Send to backend or analytics service
                const response = await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => null);

                if (response?.ok) {
                    this.events = []; // Clear after successful upload
                }
            }
        } catch (error) {
            console.error('Failed to upload events:', error);
            // Events remain in memory for retry
        }
    }

    getSessionSummary() {
        return {
            sessionId: this.sessionId,
            duration: Math.round((Date.now() - this.sessionData.startTime) / 1000),
            scrollDepth: this.sessionData.scrollDepth,
            pageViews: this.sessionData.pageViews.length,
            services: this.sessionData.interactedServices,
            formInteractions: this.sessionData.formInteractions.length,
            exitIntent: this.sessionData.exitIntent,
            isReturning: this.sessionData.isReturning
        };
    }

    // Calculate engagement score (0-100)
    calculateEngagementScore() {
        let score = 0;

        // Time on site (max 30 points)
        score += Math.min(30, this.sessionData.timeOnPage / 10);

        // Scroll depth (max 25 points)
        score += (this.sessionData.scrollDepth / 100) * 25;

        // Service interactions (max 25 points)
        score += Math.min(25, this.sessionData.interactedServices.length * 5);

        // Form interactions (max 20 points)
        score += Math.min(20, this.sessionData.formInteractions.length * 5);

        return Math.round(score);
    }

    trackIdentity(userInfo) {
        this.sessionData.userInfo = userInfo;
        this.trackEvent('identity_set', userInfo);
    }

    getSuggestedService() {
        if (this.sessionData.interactedServices.length === 0) return null;

        // Return most frequently interacted service
        const serviceCount = {};
        this.sessionData.interactedServices.forEach(service => {
            serviceCount[service] = (serviceCount[service] || 0) + 1;
        });

        return Object.keys(serviceCount).reduce((a, b) =>
            serviceCount[a] > serviceCount[b] ? a : b
        );
    }
}

// Initialize tracker
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.behaviorTracker = new BehaviorTracker();
    });
} else {
    window.behaviorTracker = new BehaviorTracker();
}

