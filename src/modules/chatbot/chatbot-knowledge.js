/**
 * chatbot-knowledge.js - Knowledge Base and Response Templates
 * Contains: Service definitions, FAQs, conversation templates, small talk
 */

export const KNOWLEDGE_BASE = {
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
        pricing: {
            keywords: ['price','cost','pricing','budget','affordable','cheap','expensive','how much','fee','charge','package','plan'],
            answer: `Our prices really depend on what you need—there's no one-size-fits-all here! But to give you a rough idea:\n\nIf you need a **website**, those start around ₹19,999.\nFor **SEO**, it's usually from ₹8,000 a month.\nAnd if you want us to handle your **Paid Ads**, our management fee starts at ₹5,000 a month (plus your ad spend).\n\nIf you want an exact number, I'd just need to hear a bit more about your project!`
        },
        timeline: {
            keywords: ['timeline','how long','when','duration','turnaround','deadline','fast','quick','urgent','rush'],
            answer: `It honestly depends on the project size, but here's a general idea:\n\n**Websites** usually take us 2 to 4 weeks.\n**SEO** starts showing some movement in 60 to 90 days, with the really good stuff happening around months 4 to 6.\n**App dev** takes anywhere from 6 to 14 weeks.\nAnd **Paid ads** can be up and running in just a few days!\n\nIf you're on a tight deadline, just let us know and we'll see what we can do.`
        },
        contact: {
            keywords: ['contact','reach','call','phone','email','whatsapp','speak','talk','meet','book','schedule','consultation','chat','connect'],
            answer: `You can definitely reach out! Here's how to get in touch:\n\n📞 **Give us a call or WhatsApp:** +91 72000 59453\n📧 **Shoot us an email:** mkshopzone2@gmail.com\n\nOr you can just fill out the short form at the bottom of the page, and the team will get back to you super fast. Want me to just scroll you down there?`
        },
        about: {
            keywords: ['who are you','about','mk shopzone','your team','experience','agency','background','founded','years','coimbatore'],
            answer: `MK Shopzone is a digital agency based right out of **Coimbatore, India**. We've been at this for over **10 years** and have worked with over **500 clients**!\n\nWe basically handle everything you need to grow online—SEO, Ads, Web Design, Apps, Social Media, you name it. What can I help you figure out today?`
        },
        results: {
            keywords: ['result','success','case study','proof','roi','growth','revenue','traffic increase','ranking improved','testimonial','client win'],
            answer: `We've had some really great wins! On average, our clients see:\n\n📊 **A 300% bump in organic traffic** within the first 6 months.\n💰 **A 3 to 5x return** on their paid ad spend.\n🏆 **Top 3 rankings** on Google for some really tough keywords.\n⭐ And we've partnered with over **500 brands** across tons of industries.\n\nWant to chat about what we could do for your specific business?`
        },
        location: {
            keywords: ['location','where','city','coimbatore','india','chennai','bangalore','office','based'],
            answer: `We're based right here in **Coimbatore, Tamil Nadu, India**, but we actually work with clients all over the place! Since everything is digital, location is never an issue. Did you have any other questions?`
        }
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

export const RESPONSE_TEMPLATES = {
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
        `That's really helpful to know, thanks for sharing!`,
        `Makes perfect sense. Here's what I'd suggest...`
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

/**
 * Get a random template from an array
 */
export function getRandomTemplate(templates) {
    return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Match user input against keyword list (case-insensitive)
 */
export function matchKeywords(userText, keywords) {
    if (!userText) return false;
    const lower = userText.toLowerCase().trim();
    return keywords.some(kw => lower.includes(kw.toLowerCase()));
}
