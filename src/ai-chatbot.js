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
                    pitch: 'We engineer long-term organic dominance on Google. Our proven SEO strategies boost visibility, drive organic traffic, and convert visitors into qualified leads.',
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
                    answer: `Our prices really depend on what you need—there's no one-size-fits-all here! But to give you a rough idea:\n\nIf you need a **website**, those start around ₹19,999.\nFor **SEO**, it's usually from ₹8,000 a month.\nAnd if you want us to handle your **Paid Ads**, our management fee starts at ₹5,000 a month (plus your ad spend).\n\nIf you want an exact number, I'd just need to hear a bit more about your project!` },
                timeline: { keywords: ['timeline','how long','when','duration','turnaround','deadline','fast','quick','urgent','rush'],
                    answer: `It honestly depends on the project size, but here's a general idea:\n\n**Websites** usually take us 2 to 4 weeks.\n**SEO** starts showing some movement in 60 to 90 days, with the really good stuff happening around months 4 to 6.\n**App dev** takes anywhere from 6 to 14 weeks.\nAnd **Paid ads** can be up and running in just a few days!\n\nIf you're on a tight deadline, just let us know and we'll see what we can do.` },
                contact: { keywords: ['contact','reach','call','phone','email','whatsapp','speak','talk','meet','book','schedule','consultation','chat','connect'],
                    answer: `You can definitely reach out! Here's how to get in touch:\n\n📞 **Give us a call or WhatsApp:** +91 72000 59453\n📧 **Shoot us an email:** mkshopzone2@gmail.com\n\nOr you can just fill out the short form at the bottom of the page, and the team will get back to you super fast. Want me to just scroll you down there?` },
                about: { keywords: ['who are you','about','mk shopzone','your team','experience','agency','background','founded','years','coimbatore'],
                    answer: `MK Shopzone is a digital agency based right out of **Coimbatore, India**. We've been at this for over **10 years** and have worked with over **500 clients**!\n\nWe basically handle everything you need to grow online—SEO, Ads, Web Design, Apps, Social Media, you name it. What can I help you figure out today?` },
                results: { keywords: ['result','success','case study','proof','roi','growth','revenue','traffic increase','ranking improved','testimonial','client win'],
                    answer: `We've had some really great wins! On average, our clients see:\n\n📊 **A 300% bump in organic traffic** within the first 6 months.\n💰 **A 3 to 5x return** on their paid ad spend.\n🏆 **Top 3 rankings** on Google for some really tough keywords.\n⭐ And we've partnered with over **500 brands** across tons of industries.\n\nWant to chat about what we could do for your specific business?` },
                location: { keywords: ['location','where','city','coimbatore','india','chennai','bangalore','office','based'],
                    answer: `We're based right here in **Coimbatore, Tamil Nadu, India**, but we actually work with clients all over the place! Since everything is digital, location is never an issue. Did you have any other questions?` }
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
                `👋 Hey there! Welcome to MK Shopzone. I'm the AI assistant around here. What brings you to our site today? Just looking around, or is there a specific project you're working on?`,
                `Hi! 👋 I'm here to help you figure out exactly what you need, whether that's getting more eyes on your business with SEO or turning your website into a lead machine. What's the main goal you're trying to hit right now?`,
                `Hey! So glad you stopped by. 🙌 I'm the MK Shopzone AI guide. I'm here to chat about anything you need—from paid ads to a whole new website. What's on your mind today?`
            ],
            fallback: [
                `That's an interesting one! Could you tell me a little bit more about what you're trying to achieve? I really want to make sure I give you the best advice.`,
                `Got it! To help me point you in the right direction, could you share a bit more? Like, what's the big goal you're working toward?`,
                `I hear that. Let me think about how best to help. Could you tell me a little more about your business and the main problem you're trying to solve right now?`,
                `Makes sense. I'd love to understand your situation a bit better so I can actually be helpful. What does your digital setup look like currently?`
            ],
            acknowledgement: [
                `Got it, that makes total sense.`,
                `I hear you—that's a super common challenge actually.`,
                `For sure, a lot of businesses run into the exact same thing.`,
                `That’s really helpful to know, thanks for sharing!`,
                `Makes perfect sense. Here’s what I’d suggest...`
            ],
            closingCta: [
                `\n\nSound good? If you're ready to take the next step, I can connect you with our strategy team for a quick, free chat. **Want me to set that up?**`,
                `\n\nHonestly, the best next step is just a quick chat with one of our specialists so they can map out a plan for you. **Should I get them in touch with you?**`,
                `\n\nTo move forward, I highly recommend a free strategy call with our team. They'll look at what you're doing now and give you a solid roadmap. **Sound like a plan?**`
            ],
            leadCapture: `Awesome! 🎯 Here's the plan—I'll have one of our senior strategists reach out to you directly. They'll do a **free audit** of where you're at and come back with some clear next steps.\n\nTo get that rolling, could you just share:\n\n1. **Your name**\n2. **Email address**\n3. **Phone number**\n\nOr if it's easier, you can just fill out the quick form at the bottom of the page. 👇`,
            leadConfirmation: `🎉 Perfect, you're in great hands! Our team will reach out **within the next hour** (as long as we're open!) with a game plan just for you.\n\nWhile you wait, feel free to poke around the site or ask me anything else!`,
            pageGreetings: {
                seo: `👋 Hi! Checking out our SEO stuff? Honestly, organic search is one of the best ways to get reliable, long-term growth.\n\nI'm here to answer any questions you have. **What's the biggest SEO hurdle you're dealing with right now?**`,
                ads: `💰 Hey! Exploring our Paid Ads? Good call—our campaigns usually bring back 3 to 5 times what you spend.\n\nI can walk you through how we do it, or help you figure out a good budget. **What sounds best for you?**`,
                web: `🌐 Hey there! Thinking about a new website or a redesign? You're in the right spot—we love building sites that actually get results.\n\n**What kind of vibe are you dreaming of for your site?**`,
                social: `📱 Welcome! Social media can be a massive game changer when it's done right.\n\nI can help you figure out the best platforms, content ideas, and if organic or paid social makes more sense for you. **What's your social media looking like these days?**`,
                email: `📧 Hey! Email marketing is truly the gift that keeps on giving—and we're pretty great at it.\n\n**What's your current email setup look like?**`,
                video: `🎬 Hi! Love that you're checking out video production. Video is honestly unbeatable for getting people's attention right now.\n\n**What kind of video are you picturing?**`,
                about: `👋 Curious about who we are? I love that!\n\nMK Shopzone has been partnering with ambitious brands for over 10 years now—over 500 clients across basically every industry. **What would you like to know about the team?**`,
                contact: `Hey! You made it to the contact page, which usually means you're ready to chat! 🙌\n\nI can answer any last-minute questions you have, or if you're good to go, **just fill in that form up above and we'll be in touch within the hour!**`
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

            <div class="mka-lead-form-container" id="mka-lead-form-container">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: #fff;">Get Started</h3>
                    <p style="font-size: 0.85rem; color: var(--mka-text-muted);">Fill in your details for a personalized strategy.</p>
                </div>
                <form id="mka-prechat-form" class="mka-prechat-form">
                    <div class="mka-fc"><input type="text" id="mka-form-name" placeholder="Name" required></div>
                    <div class="mka-fc"><input type="email" id="mka-form-email" placeholder="Email Address" required></div>
                    <div class="mka-fc mka-phone-row">
                        <div class="mka-form-country">
                            <div class="mka-flag-icon"></div>
                        </div>
                        <div class="mka-phone-input">
                            <span class="mka-phone-code">+91</span>
                            <input type="tel" id="mka-form-phone" placeholder="Phone Number" required>
                        </div>
                    </div>
                    <div class="mka-fc"><input type="text" id="mka-form-business" placeholder="Company Name"></div>
                    <div class="mka-fc"><textarea id="mka-form-message" placeholder="How can we help you grow?"></textarea></div>
                    
                    <div class="mka-form-submit-row">
                        <button type="submit" id="mka-form-submit-btn" class="mka-form-submit-btn">
                            Launch Consultation
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div class="mka-messages" id="mka-messages" role="log" aria-live="polite" style="display: none;"></div>

            <div class="mka-suggestions" id="mka-suggestions" style="display: none;">
                <button class="mka-chip" data-msg="I want to improve my Google rankings">📊 Improve SEO</button>
                <button class="mka-chip" data-msg="Tell me about your paid advertising services">💰 Run Paid Ads</button>
                <button class="mka-chip" data-msg="I need a new website built">🌐 Build a Website</button>
                <button class="mka-chip" data-msg="How much do your services cost?">💳 See Pricing</button>
            </div>

            <div class="mka-input-area" id="mka-input-area" style="display: none;">
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

        // Pre-chat form
        document.getElementById('mka-prechat-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('mka-form-submit-btn');
            btn.innerHTML = 'Starting...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            const leadData = {
                name: document.getElementById('mka-form-name').value,
                email: document.getElementById('mka-form-email').value,
                phone: '+91' + document.getElementById('mka-form-phone').value,
                business: document.getElementById('mka-form-business').value,
                message: document.getElementById('mka-form-message').value,
                source: 'AI Chatbot Pre-form'
            };

            this.userProfile.name = leadData.name;
            this.userProfile.email = leadData.email;
            this.userProfile.phone = leadData.phone;
            this.userProfile.business = leadData.business;

            if (window.leadCaptureSystem) {
                window.leadCaptureSystem.recordLead(leadData);
            }

            this.stage = 'lead_sent'; 

            setTimeout(() => {
                document.getElementById('mka-lead-form-container').style.display = 'none';
                document.getElementById('mka-messages').style.display = 'flex';
                document.getElementById('mka-suggestions').style.display = 'flex';
                document.getElementById('mka-input-area').style.display = 'block';

                const targetName = this.userProfile.name.split(' ')[0];
                const customGreeting = `Hi ${targetName}! 👋 Thanks for reaching out. How can I help you with ${this.userProfile.business ? 'your business (' + this.userProfile.business + ')' : 'your project'} today?`;
                this._appendMessage(customGreeting, 'bot');

                if(leadData.message) {
                    this._sendUserMessage(leadData.message);
                }
            }, 800);
        });

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

        if (wa) {
            wa.style.opacity = '0';
            wa.style.pointerEvents = 'none';
            wa.style.visibility = 'hidden';
        }

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

        if (wa) {
            wa.style.opacity = '';
            wa.style.pointerEvents = '';
            wa.style.visibility = '';
        }

        this.isOpen = false;
    }

    /* Expose as window method for other scripts */
    openChat() { this.open(); }

    /**
     * Programmatically send a message as the bot or user
     */
    async sendMessage(text, role = 'bot') {
        if (!this.isOpen) this.open();
        
        if (role === 'bot') {
            await this._streamMessage(text, 'bot');
            this.history.push({ role: 'bot', content: text });
        } else {
            await this._sendUserMessage(text);
        }
    }

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
            return `You're so welcome! 😊 Is there anything else on your mind?\n\nHappy to chat about strategy, pricing, timelines, or anything else you need.`;
        }
        if (this._matchesAny(lower, this.KB.smallTalk.bye)) {
            return `It was so great chatting with you! 👋 Feel free to swing by anytime. Good luck with everything, and definitely reach out whenever you're ready to make some moves! 🚀`;
        }
        if (this._matchesAny(lower, this.KB.smallTalk.confused)) {
            return `Oh, my bad! Let me try to clear that up. What part specifically were you wondering about? I'm more than happy to break it down for you.`;
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
                return `Oh nice, **${ind.label}** is a super competitive space, but we've actually done some excellent work there!\n\nWe even have a dedicated section on our site for it. Usually, the best bang for your buck in your industry comes from combining **SEO**, **Paid Ads**, and a killer **Web Design**.\n\nWhat's your main focus right now? Do you want more leads, better visibility, or a shiny new website? Let me know so I can point you the right way!`;
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
                return `${ack} Thinking about **${svc.label}**? That's a really solid call.\n\n${svc.pitch}\n\n${question}`;
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
                return `${this._rand(this.templates.acknowledgement)} Just so I can give you the best advice, let me ask one more quick thing:\n\n**${nextQ}**`;
            }
            return `${this._rand(this.templates.acknowledgement)} What part of your digital presence do you want to upgrade the most right now—getting more visible, driving leads, or bumping up that revenue?`;
        }

        /* 6. Negation — user says no */
        if (this._matchesAny(lower, this.KB.smallTalk.no)) {
            return `Totally fine! 👍 Is there anything else you'd like to chat about? Otherwise, feel free to just poke around the site!`;
        }

        /* 7. Budget / pricing signals */
        if (/budget|afford|invest|spend|money|fund/i.test(lower)) {
            return `Budget is always a huge factor, I totally get it! So here's the honest answer:\n\nOur prices scale based on what you actually need, so whether you're just starting out or you're a massive brand, we can usually make it work.\n\n**To give you a rough idea:**\n- 🌐 Websites start around ₹19,999\n- 📊 SEO kicks off at ₹8,000/month\n- 💰 PPC management begins at ₹5,000/month (plus your ad spend)\n\nThe better you invest, the faster you see returns. **Did you have a rough budget range in mind?** It really helps me suggest the perfect package for you.`;
        }

        /* 8. After enough conversation — nudge toward lead */
        if (this.history.length >= 8 && this.stage !== 'lead_sent') {
            this.stage = 'ready_for_lead';
            return `Based on everything you've told me, I feel like I've got a really good grasp on what you need, and I'm super confident we can help out.\n\n**Honestly, the best next step is just a quick, free strategy call with one of our senior folks.** They'll take a look at your setup and give you a real, customized plan—no pressure, I promise.\n\nWant me to get that set up for you? 👇`;
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
            ? `\n\nSince we were talking about **${this.KB.services[this.userProfile.interestedService]?.label}**, did you want to dive a bit deeper into that?`
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

    /**
     * Extract lead information from conversation for CRM
     */
    extractLeadInfo() {
        const info = {
            name: this.userProfile.name || null,
            email: this.userProfile.email || null,
            phone: this.userProfile.phone || null,
            business: this.userProfile.business || null,
            service: this.userProfile.interestedService || null,
            industry: this.userProfile.industry || null,
            conversationHistory: this.history,
            stage: this.stage
        };
        return info;
    }

    /**
     * Update user profile from analytics
     */
    updateProfile(analyticsData) {
        if (!analyticsData) return;

        this.userProfile.interestedService = analyticsData.user_intent;
        this.userProfile.buyingStage = analyticsData.buying_stage;

        // Auto-trigger relevant follow-up
        if (analyticsData.buying_stage === 'Decision' && !this.decisionOffered) {
            this.decisionOffered = true;
            setTimeout(() => {
                if (this.isOpen) {
                    this._sendUserMessage(`I'm seriously interested. What's next?`);
                }
            }, 3000);
        }
    }
}

/* ── Bootstrap ─────────────────────────────────── */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.aiChatbot = new MKAssistant(); });
} else {
    window.aiChatbot = new MKAssistant();
}
