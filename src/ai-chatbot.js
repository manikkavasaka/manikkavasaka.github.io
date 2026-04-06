/**
 * MK Shopzone – Conversational AI Assistant v3.0
 * Behaves like ChatGPT / Gemini: natural, intelligent, context-aware.
 */

class MKAssistant {
    constructor() {
        this.history = [];           // Full dialogue history
        this.userProfile = {};       // Accumulated user info
        this.stage = 'greeting';     // Conversation stage
        this.msgCount = 0;
        this.isTyping = false;
        this.pendingMessages = [];
        this.pageCtx = this._detectPage();
        this.sessionStarted = Date.now();

        /* ── Knowledge Base ────────────────────────────────── */
        this.KB = {
            services: {
                seo: {
                    label: 'Advanced SEO',
                    url: 'seo.html',
                    keywords: ['seo','ranking','google','organic','search','keywords','backlinks','traffic','visibility','serp','authority'],
                    pitch: 'We engineer long-term organic dominance on Google through technical SEO, content strategy, and high-authority link building.',
                    questions: [
                        'What industry are you in? That helps me tailor an SEO strategy for you.',
                        'Are you struggling more with rankings, traffic, or conversions from organic visitors?',
                        'Have you had an SEO audit done recently, or are you starting fresh?'
                    ]
                },
                ads: {
                    label: 'Paid Ads / PPC',
                    url: 'paid-ads.html',
                    keywords: ['ads','ppc','paid','google ads','facebook ads','meta ads','roi','roas','adwords','campaign','spend','cpc','cpa'],
                    pitch: 'We run laser-targeted Google & Meta ad campaigns with daily optimisation, delivering 3–5× ROAS on average.',
                    questions: [
                        'Are you currently running any paid campaigns, or is this a fresh start?',
                        'What\'s your approximate monthly ad budget? Even a rough range helps me propose the right strategy.',
                        'Which platform interests you more – Google Search, Meta (Facebook/Instagram), or both?'
                    ]
                },
                web: {
                    label: 'Elite Web Design',
                    url: 'website-design.html',
                    keywords: ['website','web','design','develop','responsive','mobile','redesign','site','landing','ux','ui','speed','performance'],
                    pitch: 'We build lightning-fast, conversion-optimised websites from scratch — no templates, 100/100 Lighthouse scores guaranteed.',
                    questions: [
                        'Are you looking to build something new, or redesign what you already have?',
                        'What\'s the main goal of the website — leads, e-commerce sales, portfolio, or something else?',
                        'Do you have a brand identity (logo, colours) already, or would you also need branding work?'
                    ]
                },
                app: {
                    label: 'App Development',
                    url: 'app.html',
                    keywords: ['app','android','ios','mobile app','application','apk','play store','flutter','react native'],
                    pitch: 'We build smooth, bug-free Android & iOS apps with API integrations and a premium UX that users love.',
                    questions: [
                        'Is this for Android, iOS, or both?',
                        'At what stage are you — idea, wireframes, or do you already have a spec?',
                        'Will the app need backend/API integration or any real-time features like chat or push notifications?'
                    ]
                },
                social: {
                    label: 'Social Media Marketing',
                    url: 'social-media.html',
                    keywords: ['social','instagram','facebook','linkedin','tiktok','reels','engagement','followers','content','posts','community'],
                    pitch: 'We create compelling social content, manage communities, and run targeted campaigns that build real brand equity.',
                    questions: [
                        'Which platform matters most to your audience — Instagram, LinkedIn, Facebook, or TikTok?',
                        'Are you focused on organic growth, paid social ads, or a combination of both?',
                        'Do you already have a content team, or do you need us to handle everything end-to-end?'
                    ]
                },
                email: {
                    label: 'Email Marketing',
                    url: 'email-marketing.html',
                    keywords: ['email','newsletter','automation','nurture','drip','mailchimp','klaviyo','subscribers','open rate','sequence'],
                    pitch: 'Email marketing delivers the highest ROI of any channel. We build automated sequences that sell while you sleep.',
                    questions: [
                        'Do you have an existing email list, or are we building it from zero?',
                        'What\'s the goal — onboarding new customers, re-engaging dormant ones, or nurturing prospects?',
                        'What platform do you use or prefer — Mailchimp, Klaviyo, HubSpot, or something else?'
                    ]
                },
                video: {
                    label: 'Video Production',
                    url: 'video-marketing.html',
                    keywords: ['video','production','youtube','reels','shorts','filming','editing','brand film','ad creative','testimonial'],
                    pitch: 'Cinematic brand videos and performance ad creatives that stop the scroll and drive action.',
                    questions: [
                        'What type of video — brand film, product demo, customer testimonials, or ad creatives?',
                        'Where will the videos be used — YouTube, Instagram Reels, website, or paid ads?',
                        'Do you have a script or concept ready, or do you need us to handle the full creative direction?'
                    ]
                },
                ecommerce: {
                    label: 'E-commerce',
                    url: 'ecommerce.html',
                    keywords: ['ecommerce','shopify','woocommerce','store','shop','products','cart','checkout','inventory','dropship'],
                    pitch: 'We turn product catalogues into high-converting revenue engines on Shopify and WooCommerce.',
                    questions: [
                        'Are you starting a new store or optimising an existing one?',
                        'Which platform are you on or considering — Shopify, WooCommerce, or another?',
                        'What\'s your biggest pain point — low traffic, poor conversions, or cart abandonment?'
                    ]
                }
            },
            industries: {
                healthcare: { label: 'Healthcare', url: 'healthcare.html', keywords: ['health','hospital','clinic','doctor','medical','pharma','dentist'] },
                realestate: { label: 'Real Estate', url: 'real-estate.html', keywords: ['real estate','property','housing','builder','broker','realtor'] },
                education: { label: 'Education', url: 'education.html', keywords: ['education','school','college','institute','course','edtech','learning'] },
                enterprise: { label: 'Enterprise', url: 'enterprise.html', keywords: ['enterprise','b2b','corporate','large','company','multinational'] }
            },
            faq: {
                pricing: { keywords: ['price','cost','pricing','budget','affordable','cheap','expensive','how much','fee','charge','package','plan'],
                    answer: `Our pricing is tailored to your goals and scope, so there's no one-size-fits-all number. That said, here's a rough idea:\n\n**Web Design** starts from ₹15,000\n**SEO packages** from ₹8,000/month\n**Paid Ads management** from ₹5,000/month + ad spend\n\nWant a custom quote? I just need to know a bit more about your project.` },
                timeline: { keywords: ['timeline','how long','when','duration','turnaround','deadline','fast','quick','urgent','rush'],
                    answer: 'Timelines depend on the scope, but here\'s what\'s typical:\n\n**Website** – 2 to 4 weeks\n**SEO results** – initial improvements in 60–90 days; strong results in 4–6 months\n**App development** – 6 to 14 weeks\n**Paid ads** – campaigns live within 3–5 business days\n\nNeed something on a tighter schedule? Let me know and we\'ll see what\'s possible.' },
                contact: { keywords: ['contact','reach','call','phone','email','whatsapp','speak','talk','meet','book','schedule','consultation','chat','connect'],
                    answer: 'You can reach us a few ways:\n\n📞 **Phone / WhatsApp:** +91 95007 04443\n📧 **Email:** strategy@mkshopzone.com\n\nOr simply fill in the form at the bottom of this page and our team will get back to you within an hour. Want me to scroll you there?' },
                about: { keywords: ['who are you','about','mk shopzone','your team','experience','agency','background','founded','years','coimbatore'],
                    answer: 'MK Shopzone is a full-service digital agency based in **Coimbatore, India**, with over **10 years of experience** and **500+ successful client engagements**.\n\nWe specialise in SEO, Paid Ads, Web Design, App Development, and Social Media — essentially the full growth stack for ambitious brands. What can I help you with today?' },
                results: { keywords: ['result','success','case study','proof','roi','growth','revenue','traffic increase','ranking improved','testimonial','client win'],
                    answer: 'Our clients\'s results speak for themselves:\n\n📊 **+300% average organic traffic growth** within 6 months\n💰 **3–5× ROAS** on paid campaigns\n🏆 **Top 3 Google Rankings** for competitive keywords\n⭐ **500+ brands served** across 12+ industries\n\nWant to see what\'s possible for your specific business?' },
                location: { keywords: ['location','where','city','coimbatore','india','chennai','bangalore','office','based'],
                    answer: 'We\'re headquartered in **Coimbatore, Tamil Nadu, India**, and we work with clients across India and globally. All services are delivered remotely with clear communication — geography is never a barrier. Anything else?' }
            },
            smallTalk: {
                greetings: ['hello','hi','hey','hiya','good morning','good afternoon','good evening','howdy','sup','what\'s up'],
                thanks: ['thank','thanks','thank you','appreciate','helpful','great help'],
                bye: ['bye','goodbye','see you','later','ciao','ttyl','farewell'],
                confused: ['i don\'t understand','confused','what do you mean','can you explain','clarify','unclear','not sure'],
                yes: ['yes','yeah','yep','yup','sure','absolutely','definitely','of course','certainly','correct','right','exactly','sounds good','perfect','ok','okay'],
                no: ['no','nope','nah','not really','don\'t think so','negative','pass']
            }
        };

        /* ── Conversation templates ────────────────────────── */
        this.templates = {
            greetings: [
                `👋 Hey! Welcome to MK Shopzone. I'm your AI assistant — think of me as your dedicated digital growth guide.\n\nI can help you understand our services, figure out the right strategy for your business, or just answer any questions you have. **What brings you here today?**`,
                `Hi there! 👋 I'm MK's AI assistant. Whether you're looking to dominate Google search, run high-ROI ads, build a stunning website, or grow on social media — I'm here to help you figure out exactly the right move.\n\n**What's your main goal right now?**`,
                `Hello! Great to have you here. 🙌 I'm MK Shopzone's AI assistant, built to be your guide through everything we offer — SEO, Paid Ads, Web Design, App Dev, Social Media, and more.\n\n**Tell me what's on your mind — no question is too big or small!**`
            ],
            fallback: [
                `That's an interesting one! I want to make sure I give you the most useful answer. Could you tell me a bit more about what you're trying to achieve? I'm all ears.`,
                `Got it. To point you in the right direction, could you share a little more context? What's the goal you're working toward?`,
                `I hear you. Let me think about the best way to help. Could you tell me more about your business and what challenge you're trying to solve?`,
                `Makes sense. I'd love to understand your situation better so I can give you genuinely useful guidance. What does your current digital presence look like?`
            ],
            acknowledgement: [
                `Got it, that makes a lot of sense.`,
                `I understand — that's actually a very common challenge.`,
                `Absolutely, many businesses run into exactly that.`,
                `That's really helpful context, thanks for sharing.`,
                `Makes perfect sense. Here's what I'd suggest...`
            ],
            closingCta: [
                `\n\nReady to take the next step? I can connect you with our strategy team — they'll give you a free, no-obligation audit of your current situation. **Want me to do that?**`,
                `\n\nThe easiest next step is a quick chat with one of our specialists. They'll review your situation and put together a clear game plan. **Shall I get that set up for you?**`,
                `\n\nTo move forward, the best thing is a free strategy call with our team. They'll audit your current digital presence and map out a personalised roadmap. **Interested?**`
            ],
            leadCapture: `Perfect! 🎯 Here's what I'll do — I'll have one of our senior strategists reach out to you directly. They'll do a **free audit** of your current situation and come back with a clear, actionable plan.\n\nTo make that happen, could you share:\n\n1. **Your name**\n2. **Email address**\n3. **Phone number**\n\nOr if you prefer, jump straight to our contact form below — it only takes 60 seconds. 👇`,
            leadConfirmation: `🎉 Brilliant! You're in good hands. Our team will reach out **within the next hour** (during business hours) with a personalised plan.\n\nIn the meantime, feel free to explore our work or ask me anything else!`,
            pageGreetings: {
                seo: `👋 Hi! I see you're exploring our SEO services. Great choice — organic search is one of the highest-ROI channels there is.\n\nI'm here to help you understand what's possible for your business. **What's your biggest SEO challenge right now?**`,
                ads: `💰 Hey! You're checking out our Paid Ads service. Smart move — our campaigns typically deliver 3–5× ROAS.\n\nI can walk you through our approach or help you figure out the right budget and strategy. **What would be most useful?**`,
                web: `🌐 Hi there! Looking to build or redesign your website? You're in the right place — we build high-performance, conversion-focused digital experiences.\n\n**What kind of website are you envisioning?**`,
                social: `📱 Welcome! Social media can be a massive growth lever when done right.\n\nI can help you figure out the best platforms, content strategy, and whether organic or paid social is the right starting point for you. **What's your current social media situation like?**`,
                email: `📧 Hey! Email marketing is still the highest ROI channel — and we're really good at it.\n\n**What's your current email marketing setup like?**`,
                video: `🎬 Hi! Great to see you exploring video production. Video content consistently outperforms static content in engagement and conversion.\n\n**What kind of video are you thinking about?**`,
                about: `👋 Curious about who we are? I love that.\n\nMK Shopzone has been helping ambitious brands grow for over 10 years — 500+ clients, 12+ industries. **What would you like to know about us?**`,
                contact: `Hey! You're on the contact page — which means you're ready to talk. 🙌\n\nI can answer any last-minute questions, or if you're ready, **just fill in the form above and our team will be in touch within the hour.**`
            }
        };

        this._init();
    }

    /* ═══════════════════════════════════════════════
       SETUP
    ═══════════════════════════════════════════════ */

    _detectPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('seo')) return 'seo';
        if (path.includes('paid-ads')) return 'ads';
        if (path.includes('website-design') || path.includes('app.html')) return 'web';
        if (path.includes('social-media')) return 'social';
        if (path.includes('email-marketing')) return 'email';
        if (path.includes('video-marketing')) return 'video';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        return 'general';
    }

    _init() {
        this._buildUI();
        this._bindEvents();
        this._scheduleGreeting();
    }

    /* ═══════════════════════════════════════════════
       UI CONSTRUCTION
    ═══════════════════════════════════════════════ */

    _buildUI() {
        if (document.getElementById('mk-assistant-widget')) return;

        const html = `
        <div id="mk-assistant-widget" class="mka-container" role="dialog" aria-label="MK Shopzone AI Assistant" aria-hidden="true">
            <div class="mka-header">
                <div class="mka-header-left">
                    <div class="mka-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div class="mka-header-info">
                        <span class="mka-name">MK Assistant</span>
                        <span class="mka-status"><span class="mka-dot"></span>Online · Typically replies instantly</span>
                    </div>
                </div>
                <div class="mka-header-right">
                    <button class="mka-clear-btn" id="mka-clear" title="Clear conversation" aria-label="Clear conversation">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.67"/></svg>
                    </button>
                    <button class="mka-close-btn" id="mka-close" aria-label="Close chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>

            <div class="mka-messages" id="mka-messages" role="log" aria-live="polite"></div>

            <div class="mka-suggestions" id="mka-suggestions">
                <button class="mka-chip" data-msg="I want to improve my Google rankings">📊 Improve SEO</button>
                <button class="mka-chip" data-msg="Tell me about your paid advertising services">💰 Run Paid Ads</button>
                <button class="mka-chip" data-msg="I need a new website built">🌐 Build a Website</button>
                <button class="mka-chip" data-msg="How much do your services cost?">💳 See Pricing</button>
            </div>

            <div class="mka-input-area">
                <form id="mka-form" class="mka-form" autocomplete="off">
                    <input
                        type="text"
                        id="mka-input"
                        class="mka-input"
                        placeholder="Ask me anything…"
                        maxlength="500"
                        aria-label="Type your message"
                    >
                    <button type="submit" class="mka-send" aria-label="Send message" id="mka-send-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </form>
                <p class="mka-footer-note">MK Shopzone AI · <a href="privacy-policy.html" target="_blank">Privacy</a></p>
            </div>
        </div>

        <button id="mka-toggle" class="mka-toggle-btn" aria-label="Open AI Assistant" title="Chat with MK Assistant">
            <span class="mka-toggle-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </span>
            <span class="mka-toggle-close" style="display:none;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
            <span class="mka-badge" id="mka-badge">1</span>
            <span class="mka-toggle-label">Ask AI</span>
        </button>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    /* ═══════════════════════════════════════════════
       EVENT BINDING
    ═══════════════════════════════════════════════ */

    _bindEvents() {
        document.getElementById('mka-toggle')?.addEventListener('click', () => this.toggle());
        document.getElementById('mka-close')?.addEventListener('click',  () => this.close());
        document.getElementById('mka-clear')?.addEventListener('click',  () => this._resetConversation());
        document.getElementById('mka-form')?.addEventListener('submit',  e => this._onSubmit(e));

        // Suggestion chips
        document.getElementById('mka-suggestions')?.addEventListener('click', e => {
            const chip = e.target.closest('.mka-chip');
            if (chip) {
                const msg = chip.dataset.msg;
                this._sendUserMessage(msg);
            }
        });

        // Hero inquiry box integration
        const heroBtn   = document.getElementById('smart-inquiry-btn');
        const heroInput = document.getElementById('smart-inquiry-input');
        heroBtn?.addEventListener('click', () => {
            const val = heroInput?.value?.trim();
            if (val) { this.open(); this._sendUserMessage(val); }
        });
        heroInput?.addEventListener('keypress', e => {
            if (e.key === 'Enter') heroBtn?.click();
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // WhatsApp co-existence
        document.querySelector('.whatsapp-float')?.addEventListener('click', e => {
            if (this.isOpen) {
                e.preventDefault();
                this.close();
                setTimeout(() => window.open('https://wa.me/917200059453', '_blank'), 300);
            }
        });
    }

    /* ═══════════════════════════════════════════════
       OPEN / CLOSE / TOGGLE
    ═══════════════════════════════════════════════ */

    toggle() { this.isOpen ? this.close() : this.open(); }

    open() {
        const widget  = document.getElementById('mk-assistant-widget');
        const toggle  = document.getElementById('mka-toggle');
        const wa      = document.querySelector('.whatsapp-float');

        widget?.classList.add('mka-open');
        widget?.setAttribute('aria-hidden', 'false');
        toggle?.classList.add('mka-toggle-active');

        const iconOpen  = toggle?.querySelector('.mka-toggle-icon');
        const iconClose = toggle?.querySelector('.mka-toggle-close');
        if (iconOpen)  iconOpen.style.display  = 'none';
        if (iconClose) iconClose.style.display  = '';

        if (wa) wa.style.opacity = '0';
        if (wa) wa.style.pointerEvents = 'none';

        this.isOpen = true;
        this._hideBadge();
        document.getElementById('mka-input')?.focus();

        window.behaviorTracker?.trackEvent('chat_opened', { ts: Date.now() });
    }

    close() {
        const widget  = document.getElementById('mk-assistant-widget');
        const toggle  = document.getElementById('mka-toggle');
        const wa      = document.querySelector('.whatsapp-float');

        widget?.classList.remove('mka-open');
        widget?.setAttribute('aria-hidden', 'true');
        toggle?.classList.remove('mka-toggle-active');

        const iconOpen  = toggle?.querySelector('.mka-toggle-icon');
        const iconClose = toggle?.querySelector('.mka-toggle-close');
        if (iconOpen)  iconOpen.style.display  = '';
        if (iconClose) iconClose.style.display  = 'none';

        if (wa) wa.style.opacity = '';
        if (wa) wa.style.pointerEvents = '';

        this.isOpen = false;
    }

    /* Expose as window method for other scripts */
    openChat() { this.open(); }

    /* ═══════════════════════════════════════════════
       MESSAGING FLOW
    ═══════════════════════════════════════════════ */

    async _onSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('mka-input');
        const msg   = input?.value?.trim();
        if (!msg || this.isTyping) return;
        input.value = '';
        await this._sendUserMessage(msg);
    }

    async _sendUserMessage(text) {
        this._hideChips();
        this._appendMessage(text, 'user');
        this.history.push({ role: 'user', content: text });
        this.msgCount++;

        window.behaviorTracker?.trackEvent('chat_message', { msg: text });

        // Show typing
        const typingId = this._showTyping();

        // Compute reply with realistic delay
        const delay   = 800 + Math.random() * 600;
        const reply   = await this._computeReply(text);

        await this._sleep(delay);
        this._removeTyping(typingId);
        await this._streamMessage(reply, 'bot');

        this.history.push({ role: 'bot', content: reply });
        this._maybeShowChips(reply, text);
        this._scrollToBottom();
    }

    /* ═══════════════════════════════════════════════
       INTELLIGENCE ENGINE
    ═══════════════════════════════════════════════ */

    async _computeReply(userMsg) {
        const lower = userMsg.toLowerCase();

        /* 1. Small talk detection */
        if (this._matchesAny(lower, this.KB.smallTalk.greetings)) {
            return this._rand(this.templates.greetings);
        }
        if (this._matchesAny(lower, this.KB.smallTalk.thanks)) {
            return `You're very welcome! 😊 Is there anything else I can help you with?\n\nWhether it's strategy, pricing, timelines — I've got you covered.`;
        }
        if (this._matchesAny(lower, this.KB.smallTalk.bye)) {
            return `It was great chatting! 👋 Feel free to come back any time — we're always here. Good luck with everything, and don't hesitate to reach out when you're ready to grow. 🚀`;
        }
        if (this._matchesAny(lower, this.KB.smallTalk.confused)) {
            return `No worries at all! Let me try to be clearer. What specifically were you hoping to understand? I'm happy to break it down step by step.`;
        }

        /* 2. FAQ matching */
        for (const [key, faq] of Object.entries(this.KB.faq)) {
            if (this._matchesAny(lower, faq.keywords)) {
                return `${faq.answer}${this._rand(this.templates.closingCta)}`;
            }
        }

        /* 3. Industry detection */
        for (const [key, ind] of Object.entries(this.KB.industries)) {
            if (this._matchesAny(lower, ind.keywords)) {
                this.userProfile.industry = ind.label;
                return `Great — ${ind.label} is a competitive space, and we've done some excellent work there.\n\nWe have a dedicated section for ${ind.label} businesses on our site. The most impactful services for your industry are usually **SEO**, **Paid Ads**, and **Web Design** working together.\n\nWhat's your primary goal right now — more leads, better visibility online, or a stronger website? That'll help me point you in the right direction.`;
            }
        }

        /* 4. Service detection (scored) */
        const detected = this._detectService(lower);
        if (detected) {
            const svc = this.KB.services[detected];
            this.userProfile.interestedService = detected;
            window.personalizationEngine?.updateProfile(this.userProfile);

            // Pick a follow-up question we haven't asked yet
            const asked = this.userProfile[`asked_${detected}`] || 0;
            const question = svc.questions[asked % svc.questions.length];
            this.userProfile[`asked_${detected}`] = asked + 1;

            const ack = this._rand(this.templates.acknowledgement);

            if (this.msgCount === 1) {
                // First message mentions a service — dive right in
                return `${ack} You're interested in **${svc.label}** — that's a great call.\n\n${svc.pitch}\n\n${question}`;
            }

            return `${ack} ${svc.pitch}\n\n**${question}**`;
        }

        /* 5. Affirmation — user says yes/sounds good */
        if (this._matchesAny(lower, this.KB.smallTalk.yes)) {
            const svc = this.userProfile.interestedService;
            if (this.stage === 'ready_for_lead') {
                this.stage = 'lead_sent';
                return this.templates.leadCapture;
            }
            if (svc) {
                const nextQ = this.KB.services[svc]?.questions?.[
                    (this.userProfile[`asked_${svc}`] || 0) % this.KB.services[svc].questions.length
                ] || '';
                this.userProfile[`asked_${svc}`] = (this.userProfile[`asked_${svc}`] || 0) + 1;
                return `${this._rand(this.templates.acknowledgement)} Let me ask another quick question so I can recommend the best approach:\n\n**${nextQ}**`;
            }
            return `${this._rand(this.templates.acknowledgement)} What aspect of your digital presence would you like to grow most — visibility, leads, or revenue?`;
        }

        /* 6. Negation — user says no */
        if (this._matchesAny(lower, this.KB.smallTalk.no)) {
            return `No problem at all! 👍 Is there a different area I can help with? Or if you'd rather explore on your own, our services page gives a great overview.`;
        }

        /* 7. Budget / pricing signals */
        if (/budget|afford|invest|spend|money|fund/i.test(lower)) {
            return `Budget is always an important consideration! Here's the honest answer:\n\nOur packages are scaled to business size, so whether you're a startup or an established brand, we have something that fits.\n\n**Rough starting points:**\n- 🌐 Website from ₹15,000\n- 📊 SEO from ₹8,000/month\n- 💰 PPC management from ₹5,000/month + ad spend\n\nThe more strategically you invest, the faster the return. **What's a rough range you have in mind?** That'll help me suggest the best-fit package.`;
        }

        /* 8. After enough conversation — nudge toward lead */
        if (this.history.length >= 8 && this.stage !== 'lead_sent') {
            this.stage = 'ready_for_lead';
            return `Based on everything you've shared, I have a really clear picture of what you need, and I'm confident we can deliver excellent results for you.\n\n**The best next step is a short, free strategy call with one of our senior specialists.** They'll do a proper audit and come back with a personalised roadmap — no fluff, no hard sell.\n\nWant me to arrange that? 👇`;
        }

        /* 9. Lead contact details detected in message */
        const emailMatch = userMsg.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = userMsg.match(/\b(?:\+91|0)?[6-9]\d{9}\b/);
        if (emailMatch || phoneMatch) {
            this.userProfile.email = emailMatch?.[0];
            this.userProfile.phone = phoneMatch?.[0];
            this.stage = 'lead_sent';
            window.leadCaptureSystem?.recordLead({ ...this.userProfile, source: 'chatbot' });
            return this.templates.leadConfirmation;
        }

        /* 10. Generic context-aware fallback */
        const contextHint = this.userProfile.interestedService
            ? `\n\nWe were discussing **${this.KB.services[this.userProfile.interestedService]?.label}** — would you like to go deeper on that?`
            : '';

        return `${this._rand(this.templates.fallback)}${contextHint}`;
    }

    /* ═══════════════════════════════════════════════
       NLP UTILITIES
    ═══════════════════════════════════════════════ */

    _detectService(lower) {
        let best = null, bestScore = 0;
        for (const [key, svc] of Object.entries(this.KB.services)) {
            const hits = svc.keywords.filter(kw => lower.includes(kw)).length;
            if (hits > bestScore) { bestScore = hits; best = key; }
        }
        return bestScore >= 1 ? best : null;
    }

    _matchesAny(text, keywords) {
        return keywords.some(kw => text.includes(kw));
    }

    _rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    /* ═══════════════════════════════════════════════
       MESSAGE RENDERING
    ═══════════════════════════════════════════════ */

    _appendMessage(text, role) {
        const container = document.getElementById('mka-messages');
        if (!container) return;

        const wrap = document.createElement('div');
        wrap.className = `mka-msg mka-msg-${role}`;

        if (role === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'mka-bot-avatar';
            avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
            wrap.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = 'mka-bubble';
        bubble.innerHTML = this._formatMarkdown(text);

        wrap.appendChild(bubble);
        container.appendChild(wrap);
        this._scrollToBottom();
        return bubble;
    }

    async _streamMessage(text, role) {
        const container = document.getElementById('mka-messages');
        if (!container) return;

        const wrap = document.createElement('div');
        wrap.className = `mka-msg mka-msg-${role} mka-msg-entering`;

        if (role === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'mka-bot-avatar';
            avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
            wrap.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = 'mka-bubble';
        wrap.appendChild(bubble);
        container.appendChild(wrap);

        // Simulate streaming word by word
        const words = text.split(' ');
        let rendered = '';
        this.isTyping = true;

        for (let i = 0; i < words.length; i++) {
            rendered += (i === 0 ? '' : ' ') + words[i];
            bubble.innerHTML = this._formatMarkdown(rendered);
            this._scrollToBottom();
            await this._sleep(18 + Math.random() * 12);
        }

        this.isTyping = false;
        wrap.classList.remove('mka-msg-entering');
    }

    _formatMarkdown(text) {
        if (!text) return '';
        text = text
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Newlines → line breaks (preserve double newlines as paragraph breaks)
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraph if needed
            ;
        return `<p>${text}</p>`;
    }

    /* ═══════════════════════════════════════════════
       TYPING INDICATOR
    ═══════════════════════════════════════════════ */

    _showTyping() {
        const container = document.getElementById('mka-messages');
        const id = `typing-${Date.now()}`;

        const wrap = document.createElement('div');
        wrap.className = 'mka-msg mka-msg-bot';
        wrap.id = id;

        const avatar = document.createElement('div');
        avatar.className = 'mka-bot-avatar';
        avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;

        const bubble = document.createElement('div');
        bubble.className = 'mka-bubble mka-typing-bubble';
        bubble.innerHTML = '<span></span><span></span><span></span>';

        wrap.appendChild(avatar);
        wrap.appendChild(bubble);
        container?.appendChild(wrap);
        this._scrollToBottom();
        return id;
    }

    _removeTyping(id) {
        document.getElementById(id)?.remove();
    }

    /* ═══════════════════════════════════════════════
       SMART SUGGESTION CHIPS
    ═══════════════════════════════════════════════ */

    _hideChips() {
        const c = document.getElementById('mka-suggestions');
        if (c) c.style.display = 'none';
    }

    _maybeShowChips(reply, userMsg) {
        const svc = this.userProfile.interestedService;
        if (!svc) return;

        const chips = {
            seo:      [{ label: '📈 See SEO Packages', msg: 'What SEO packages do you offer?' }, { label: '🕐 Timeline?', msg: 'How long does SEO take to show results?' }],
            ads:      [{ label: '💰 View Pricing', msg: 'How much does paid advertising cost?' }, { label: '📊 See Results', msg: 'Can you share some PPC case studies?' }],
            web:      [{ label: '🎨 See Portfolio', msg: 'Can I see some websites you have built?' }, { label: '⏱ Timeline?', msg: 'How long does it take to build a website?' }],
            social:   [{ label: '📱 View Packages', msg: 'What social media packages do you have?' }, { label: '📊 Results?', msg: 'What kind of growth can I expect from social media?' }],
            email:    [{ label: '✉ Email Pricing', msg: 'What does email marketing cost?' }, { label: '🤖 Automation?', msg: 'Do you set up email automation sequences?' }],
            video:    [{ label: '🎬 See Reel', msg: 'Do you have examples of your video work?' }, { label: '💰 Pricing?', msg: 'How much does video production cost?' }]
        };

        const set = chips[svc];
        if (!set) return;

        const c = document.getElementById('mka-suggestions');
        if (!c) return;

        c.innerHTML = set.map(ch =>
            `<button class="mka-chip" data-msg="${ch.msg}">${ch.label}</button>`
        ).join('');
        c.style.display = 'flex';
    }

    /* ═══════════════════════════════════════════════
       GREETINGS & RESET
    ═══════════════════════════════════════════════ */

    _scheduleGreeting() {
        setTimeout(() => {
            const greet = this.templates.pageGreetings[this.pageCtx]
                || this._rand(this.templates.greetings);
            this._streamMessage(greet, 'bot');
            this.history.push({ role: 'bot', content: greet });
            this.stage = 'greeting';

            if (this.pageCtx !== 'general') {
                this.userProfile.interestedService = this.pageCtx;
            }
        }, 1200);
    }

    _resetConversation() {
        const container = document.getElementById('mka-messages');
        if (container) container.innerHTML = '';
        const chips = document.getElementById('mka-suggestions');
        if (chips) {
            chips.innerHTML = `
                <button class="mka-chip" data-msg="I want to improve my Google rankings">📊 Improve SEO</button>
                <button class="mka-chip" data-msg="Tell me about your paid advertising services">💰 Run Paid Ads</button>
                <button class="mka-chip" data-msg="I need a new website built">🌐 Build a Website</button>
                <button class="mka-chip" data-msg="How much do your services cost?">💳 See Pricing</button>
            `;
            chips.style.display = 'flex';
        }
        this.history = [];
        this.userProfile = {};
        this.stage = 'greeting';
        this.msgCount = 0;
        this._scheduleGreeting();
    }

    /* ═══════════════════════════════════════════════
       HELPERS
    ═══════════════════════════════════════════════ */

    _scrollToBottom() {
        const c = document.getElementById('mka-messages');
        if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }

    _hideBadge() {
        const b = document.getElementById('mka-badge');
        if (b) b.style.display = 'none';
    }

    trackChatHistory() {} // compat stub
}

/* ── Bootstrap ─────────────────────────────────── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.aiChatbot = new MKAssistant(); });
} else {
    window.aiChatbot = new MKAssistant();
}
