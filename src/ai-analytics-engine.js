/**
 * AI Analytics & Lead Conversion Engine v3.0
 * Analyzes user behavior and generates intelligent, personalized lead conversion strategies
 * 
 * INPUTS:
 * - Pages visited
 * - Time spent on each page
 * - Click behavior
 * - Scroll depth
 * - Form interactions
 * 
 * OUTPUTS:
 * - User intent classification
 * - Buying stage detection
 * - Personalized content (headline, subheading, CTA)
 * - Service recommendations
 * - Lead conversion strategies
 * - Follow-up messages (WhatsApp + Email)
 * - Retargeting strategies
 */

class AIAnalyticsEngine {
    constructor() {
        this.intents = {
            seo: {
                keywords: ['seo', 'ranking', 'google', 'organic', 'search', 'keywords', 'backlinks', 'traffic', 'visibility', 'serp', 'authority', 'rank', 'position'],
                pages: ['seo.html', 'seo'],
                score: 0
            },
            ads: {
                keywords: ['ads', 'ppc', 'paid', 'google ads', 'facebook ads', 'meta ads', 'roi', 'roas', 'adwords', 'campaign', 'spend', 'cpc', 'cpa', 'conversion'],
                pages: ['paid-ads.html', 'ads'],
                score: 0
            },
            web: {
                keywords: ['website', 'web', 'design', 'develop', 'responsive', 'mobile', 'redesign', 'site', 'landing', 'ux', 'ui', 'speed', 'performance', 'custom', 'build'],
                pages: ['website-design.html', 'web'],
                score: 0
            },
            social: {
                keywords: ['social', 'instagram', 'facebook', 'linkedin', 'tiktok', 'reels', 'engagement', 'followers', 'content', 'posts', 'community', 'media'],
                pages: ['social-media.html', 'social'],
                score: 0
            },
            app: {
                keywords: ['app', 'android', 'ios', 'mobile app', 'application', 'apk', 'play store', 'flutter', 'react native', 'development'],
                pages: ['app.html'],
                score: 0
            },
            email: {
                keywords: ['email', 'newsletter', 'automation', 'nurture', 'drip', 'mailchimp', 'klaviyo', 'subscribers', 'open rate', 'sequence'],
                pages: ['email-marketing.html', 'email'],
                score: 0
            },
            video: {
                keywords: ['video', 'production', 'youtube', 'reels', 'shorts', 'filming', 'editing', 'brand film', 'ad creative', 'testimonial'],
                pages: ['video-marketing.html', 'video'],
                score: 0
            },
            ecommerce: {
                keywords: ['ecommerce', 'shopify', 'woocommerce', 'store', 'shop', 'products', 'cart', 'checkout', 'inventory', 'dropship'],
                pages: ['ecommerce.html'],
                score: 0
            }
        };

        this.buyingStages = {
            awareness: {
                signals: ['scroll_25', 'scroll_50', 'multiple_clicks'],
                timeThreshold: 30000, // 30 seconds
                clickThreshold: 2
            },
            consideration: {
                signals: ['scroll_75', 'form_input', 'multiple_pages'],
                timeThreshold: 120000, // 2 minutes
                clickThreshold: 5
            },
            decision: {
                signals: ['form_submit', 'scroll_100', 'contact_interest'],
                timeThreshold: 180000, // 3 minutes
                clickThreshold: 8
            }
        };

        this.serviceStrategies = {
            seo: {
                headlines: [
                    'Dominate Google Search. Get #1 Rankings in Your Industry.',
                    'Organic Traffic That Converts: SEO Done Right',
                    'Unstoppable SEO Growth. 300% More Visibility.',
                    'From Zero to Page 1 Google: Your SEO Roadmap'
                ],
                subheadings: [
                    'We engineer long-term organic dominance using proven strategies that consistently rank our clients #1 on Google.',
                    'Our SEO system delivers consistent, predictable organic traffic growth without risky tactics.',
                    'Tired of paying for clicks? Let us build your organic empire instead.',
                    'Strategic SEO + Premium Content = Organic Traffic That Never Stops.'
                ],
                ctas: [
                    '🚀 Start SEO Growth Today',
                    'Get Free SEO Audit →',
                    'See Your SEO Potential →',
                    'Boost Rankings Now →'
                ],
                offers: [
                    'Free SEO Audit ($5000 value)',
                    'Free 90-Day SEO Strategy',
                    'Free Competitor Analysis',
                    'Free Keyword Research Report'
                ],
                popupStrategy: 'Show after 2 minutes or 50% scroll',
                whatsappTemplates: [
                    'Hey! 👋 Saw you checking out our SEO services. Your competitors are already ranking #1. Want a quick strategy call? 📈',
                    'Quick question: where do you rank on Google for your main keywords? Let me show you the opportunity. 🎯',
                    'Most businesses we work with go from page 5 to page 1 in 90 days. Want to see how? 🚀'
                ],
                emailTemplates: [
                    'Subject: Your SEO Opportunity (We Found $XX,XXX in Lost Revenue)\n\nHi [Name],\n\nWe analyzed your site and found you\'re missing out on 3,421 monthly searches in your space. These are high-intent customers actively looking for what you offer.\n\nWant a free strategy call?\n\nBest,\nMK Shopzone Team',
                    'Subject: [Your Competitor] Just Beat You to #1\n\nHi [Name],\n\nYour main competitors are now ranking above you for your biggest keywords. But here\'s the good news: we have a proven system to reclaim the top spot.\n\nReady for your free audit?\n\nBest,\nMK Shopzone',
                    'Subject: Free 90-Day SEO Roadmap Inside\n\nHi [Name],\n\nWe created a custom 90-day SEO plan based on your industry and competitors. It shows exactly how to go from your current rankings to page 1.\n\nWant to see it?\n\nBest,\nMK Shopzone'
                ],
                retargetingAds: [
                    'Not ranking on Google? We put 47 clients in the top 3 this year. Free audit inside →',
                    'Your competitors are stealing your customers. We recovered $2.3M in lost revenue for similar businesses. See how →',
                    'Page 5 to Page 1 in 90 days. Our proven SEO system works for [Industry]. Book a call →'
                ]
            },
            ads: {
                headlines: [
                    'High-ROI Paid Ads That Convert. 3-5x ROAS Guaranteed.',
                    'Your Ad Spend is Wasted Without Proper Strategy.',
                    'Profitable Ads, Predictable Results. Scale Confidently.',
                    'Done-For-You Google & Meta Ads. Experts Only.'
                ],
                subheadings: [
                    'We run laser-targeted Google & Meta campaigns with daily optimization, delivering 3–5× ROAS consistently.',
                    'Stop wasting money on ads that don\'t convert. Our specialists manage every penny for maximum profit.',
                    'Proven playbooks for Facebook, Instagram, Google, and TikTok. Used by 150+ thriving businesses.',
                    'Your ads should make money, not drain your budget. Let our experts fix that today.'
                ],
                ctas: [
                    '💰 Get Free Ad Audit →',
                    'Fix Your Ad Spend →',
                    'See Your ROAS Potential →',
                    'Start Profitable Ads →'
                ],
                offers: [
                    'Free Ad Account Audit ($2000 value)',
                    'Free Campaign Strategy Session',
                    'Free Competitor Ad Analysis',
                    'Free 30-Day Performance Plan'
                ],
                popupStrategy: 'Show after 3 clicks on ads content',
                whatsappTemplates: [
                    'Hey! 👋 Quick question: what\'s your current ad ROAS? We helped similar businesses go from 0.5x to 3.5x. Want to see the strategy? 📊',
                    'Your ad budget is being wasted if you\'re not tracking properly. Let me audit your campaigns free. Sound good? 🔍',
                    'We just turned a $2000/month ad spend into $12,000 revenue for a client in your industry. Let\'s talk strategy! 💡'
                ],
                emailTemplates: [
                    'Subject: Your Ads Are Costing More Than They\'re Worth\n\nHi [Name],\n\nWe reviewed your ad accounts and found critical issues costing you thousands every month:\n- Poor audience targeting\n- Wrong optimization settings\n- Ineffective ad copy\n\nOur team can fix this in 30 days and get you 3-5x returns.\n\nFree audit?\n\nBest,\nMK Shopzone',
                    'Subject: Your Competitor Is Winning the Ad Game (Here\'s How to Win Back)\n\nHi [Name],\n\nYour competitor\'s ads are showing to YOUR customers. But we know their playbook, and we can beat them.\n\nWant our free analysis?\n\nBest,\nMK Shopzone',
                    'Subject: Guaranteed 2x ROAS or We Work Free (30 Days)\n\nHi [Name],\n\nWe\'re so confident in our ad strategy that we guarantee 2x ROAS improvement in 30 days, or we work free for another month.\n\nIn?\n\nBest,\nMK Shopzone'
                ],
                retargetingAds: [
                    'Wasting money on ads? We improved ROAS from 0.8x to 4.2x for similar businesses. Free audit here →',
                    'Your competitor is beating you in ads. Our strategy flips the script. See our playbook →',
                    'Every dollar spent on ads should return $3-5. If it\'s not happening, we can fix it. Talk to us →'
                ]
            },
            web: {
                headlines: [
                    'Your Website Should Be Your Best Sales Rep. Custom-Built & High-Converting.',
                    'Lightning-Fast Websites That Convert Visitors Into Customers.',
                    'Stop Using Templates. Get a Conversion-Engineered Site.',
                    'Elite Web Design. 100/100 Lighthouse Scores. Guaranteed Leads.'
                ],
                subheadings: [
                    'We build custom, mobile-optimized websites from scratch that are fast, beautiful, and convert like crazy.',
                    'Tired of generic templates that look like everyone else? We build unique, high-converting sites that reflect your brand.',
                    'Average website converts 1% of visitors. Ours convert 3-7%. That\'s how we transform your business.',
                    'Design isn\'t just pretty. It\'s psychology. We engineer every pixel to drive action.'
                ],
                ctas: [
                    '🌐 See Our Design Portfolio →',
                    'Get Free Website Audit →',
                    'Start Your Redesign →',
                    'Build Something Amazing →'
                ],
                offers: [
                    'Free Website Audit & Strategy',
                    'Free Conversion Optimization Plan',
                    'Free Competitor Website Analysis',
                    'Free Mobile Performance Report'
                ],
                popupStrategy: 'Show after visiting website page',
                whatsappTemplates: [
                    'Hey! 👋 Just saw you checking out our web design. How\'s your current website performing? Let me share a free optimization strategy. 🚀',
                    'Your website is either your best or worst employee. Want a quick audit? We found $50K in conversion opportunities for clients like you. 💡',
                    'Design matters. Your competitors have beautiful sites. Let\'s make sure yours converts better than theirs. 🎨'
                ],
                emailTemplates: [
                    'Subject: Your Website Is Costing You Sales\n\nHi [Name],\n\nWe analyzed your site and found:\n- 58% of visitors leave in under 3 seconds\n- Your CTA is buried on page 5\n- Mobile experience is poor\n\nWe can fix all this and triple your conversions.\n\nFree audit?\n\nBest,\nMK Shopzone',
                    'Subject: Your Website Redesign: Before & After\n\nHi [Name],\n\nWe just redesigned a competitor\'s site similar to yours. Their leads went from 2/week to 12/week.\n\nReady to experience the same transformation?\n\nBest,\nMK Shopzone',
                    'Subject: 90-Day Website Transformation Plan Inside\n\nHi [Name],\n\nWe created a custom plan to redesign your site, optimize for conversions, and launch in 12 weeks with minimal downtime.\n\nSounds good?\n\nBest,\nMK Shopzone'
                ],
                retargetingAds: [
                    'Your website is probably costing you more than it\'s making. We\'ll fix it. Free strategy inside →',
                    'We redesigned a site like yours and sales doubled in 90 days. See the transformation →',
                    'Beautiful design + strategic copy + technical optimization = 3-7x more leads. Let\'s build yours →'
                ]
            },
            social: {
                headlines: [
                    'Build a Loyal Community. Turn Followers Into Customers.',
                    'Social Media That Actually Sells. Strategic Growth & Engagement.',
                    'From Ghost Followers to Real Customers. Our Proven Social Playbook.',
                    'Content That Converts. Community That Buys.'
                ],
                subheadings: [
                    'We create compelling content, manage your community, and run targeted campaigns that build real brand equity and consistent leads.',
                    'Most social media is wasted time and money. We make it strategic, measurable, and profitable.',
                    'Stop posting randomly. We have a playbook to turn your social channels into your best sales tool.',
                    'Your audience is waiting. Let\'s build a community that doesn\'t just engage—they buy.'
                ],
                ctas: [
                    '📱 See Social Results →',
                    'Get Free Social Audit →',
                    'Build Your Community →',
                    'Start Social Growth →'
                ],
                offers: [
                    'Free Social Media Audit',
                    'Free Content Calendar (30 Days)',
                    'Free Competitor Analysis',
                    'Free Growth Strategy Session'
                ],
                popupStrategy: 'Show after visiting social page',
                whatsappTemplates: [
                    'Hey! 👋 Checking out our social media services? Most brands waste 90% of their social potential. Want a quick strategy? 📊',
                    'Your competitors are building communities on social while you\'re still posting randomly. Let\'s change that. 🚀',
                    'We grew a similar client from 5K to 50K followers in 6 months AND got them 20+ qualified leads monthly. Let\'s talk. 💡'
                ],
                emailTemplates: [
                    'Subject: Your Social Media Is a Missed Opportunity\n\nHi [Name],\n\nWe reviewed your social accounts and found:\n- Low engagement (under 1%)\n- No clear strategy\n- Followers aren\'t buying\n\nWe have a proven playbook to change this.\n\nFree consultation?\n\nBest,\nMK Shopzone',
                    'Subject: Your Competitor Just Hit 50K Followers\n\nHi [Name],\n\nThey\'re using a strategic content system we built. The good news? Their strategy works for you too.\n\nReady to learn?\n\nBest,\nMK Shopzone',
                    'Subject: Turn Your Social Followers Into Customers\n\nHi [Name],\n\nWe have a 3-part system:\n1. Grow followers organically\n2. Build real engagement\n3. Convert to paying customers\n\nWant to see it in action?\n\nBest,\nMK Shopzone'
                ],
                retargetingAds: [
                    'Your social followers aren\'t buying because you\'re not selling right. We know the system. Free consultation →',
                    'We turned a client\'s social following into 30+ monthly leads. Your competitor is next. See how →',
                    'Social isn\'t just for posting memes. It\'s your best sales channel. Let\'s activate it →'
                ]
            },
            app: {
                headlines: [
                    'Custom Mobile Apps That Users Love. Android & iOS Expertise.',
                    'From Idea to App Store: Premium Development & Launch Support.',
                    'Apps That Deliver Results. Smart Code. Perfect UX.',
                    'Building the App Your Users Will Actually Use.'
                ],
                subheadings: [
                    'We build smooth, bug-free Android & iOS apps with API integrations and a premium UX that users love from day one.',
                    'App development shouldn\'t be a black box. We keep you in the loop from concept to launch.',
                    'Your app needs to be fast, intuitive, and profitable. That\'s our specialty.',
                    'Ideas are common. Execution is rare. We handle the hard part.'
                ],
                ctas: [
                    '📲 See Our App Portfolio →',
                    'Start Your App Project →',
                    'Free App Consultation →',
                    'Build Your App Now →'
                ],
                offers: [
                    'Free App Strategy Session',
                    'Free UI/UX Consultation',
                    'Free Development Timeline',
                    'Free Technology Stack Review'
                ],
                popupStrategy: 'Show after viewing app page',
                whatsappTemplates: [
                    'Hey! 👋 Building an app? We\'ve launched 50+ successful apps on iOS & Android. Let\'s chat about yours! 📱',
                    'App development is complex, but we make it simple. Want to discuss your idea? 💡',
                    'Your app idea is solid. The execution matters most. That\'s where we shine. 🚀'
                ],
                emailTemplates: [
                    'Subject: Your App Idea Deserves Expert Execution\n\nHi [Name],\n\nWe\'ve built 50+ apps across Android and iOS. We know what works, what doesn\'t, and how to save you money.\n\nLet\'s build something great together.\n\nBest,\nMK Shopzone',
                    'Subject: Free App Development Strategy (Based on Your Idea)\n\nHi [Name],\n\nWe created a custom roadmap for your app idea including:\n- Technology recommendation\n- Timeline & milestones\n- Budget estimate\n- Launch strategy\n\nReady?\n\nBest,\nMK Shopzone',
                    'Subject: Why Your App Project Matters (And How We Make It Succeed)\n\nHi [Name],\n\nMost apps fail because of poor planning. We prevent that by being crystal clear from day 1.\n\nLet\'s talk?\n\nBest,\nMK Shopzone'
                ],
                retargetingAds: [
                    'Your app idea could be the next big thing. We\'ll build it right. Free consultation inside →',
                    'We turned 50+ app ideas into thriving businesses. Let\'s make yours #51 →',
                    'App development is too important to get wrong. Work with experts. Talk to us →'
                ]
            }
        };

        this.init();
    }

    init() {
        this._monitorBehavior();
    }

    /**
     * Analyze user behavior and return comprehensive insights
     */
    analyzeUserBehavior(behaviorData) {
        if (!behaviorData) return null;

        // 1. Identify User Intent
        const userIntent = this._classifyIntent(behaviorData);

        // 2. Detect Buying Stage
        const buyingStage = this._detectBuyingStage(behaviorData);

        // 3. Get Personalized Content
        const personalizedContent = this._generatePersonalizedContent(userIntent, buyingStage);

        // 4. Service Recommendation
        const recommendedService = this._recommendService(userIntent, behaviorData);

        // 5. Lead Conversion Strategy
        const conversionStrategy = this._generateConversionStrategy(userIntent, buyingStage, behaviorData);

        // 6. Generate Follow-Up Messages
        const followUpMessages = this._generateFollowUpMessages(userIntent, personalizedContent);

        // 7. Retargeting Strategy
        const retargetingStrategy = this._generateRetargetingStrategy(userIntent, buyingStage);

        // Compile comprehensive output
        const analysis = {
            user_intent: userIntent,
            buying_stage: buyingStage,
            recommended_service: recommendedService,
            headline: personalizedContent.headline,
            subheading: personalizedContent.subheading,
            cta: personalizedContent.cta,
            popup_strategy: conversionStrategy.popupStrategy,
            offer: conversionStrategy.offer,
            conversion_signals: conversionStrategy.signals,
            whatsapp_message: followUpMessages.whatsapp,
            email_subject: followUpMessages.emailSubject,
            email_message: followUpMessages.email,
            retargeting_ad: retargetingStrategy,
            confidence_score: this._calculateConfidence(behaviorData)
        };

        // Broadcast to personalization engine
        window.personalizationEngine?.updateProfile(analysis);
        
        return analysis;
    }

    /**
     * 1. Classify User Intent
     */
    _classifyIntent(behaviorData) {
        let topService = 'general';
        let topScore = 0;

        for (const [service, data] of Object.entries(this.intents)) {
            let score = 0;

            // Check visited pages
            if (Array.isArray(behaviorData.pagesVisited) && behaviorData.pagesVisited.length > 0) {
                data.pages.forEach(page => {
                    if (behaviorData.pagesVisited.some(p => p.includes(page))) {
                        score += 30;
                    }
                });
            }

            // Check clicked links
            if (behaviorData.topClicks) {
                data.keywords.forEach(kw => {
                    behaviorData.topClicks.forEach(click => {
                        if (click.text?.toLowerCase().includes(kw) || click.href?.toLowerCase().includes(kw)) {
                            score += 10;
                        }
                    });
                });
            }

            // Check current page
            if (behaviorData.currentPage) {
                if (data.pages.some(p => behaviorData.currentPage.includes(p))) {
                    score += 20;
                }
            }

            // Check scroll depth
            if (behaviorData.scrollDepth > 50) {
                score += 5;
            }

            if (score > topScore) {
                topScore = score;
                topService = service;
            }
        }

        return topService;
    }

    /**
     * 2. Detect Buying Stage
     */
    _detectBuyingStage(behaviorData) {
        const sessionDuration = behaviorData.sessionDuration || 0;
        const totalClicks = (behaviorData.topClicks || []).length;
        const scrollDepth = behaviorData.scrollDepth || 0;
        const pagesVisited = (behaviorData.pagesVisited || []).length;

        // Scoring system
        let score = 0;

        // Time scoring
        if (sessionDuration > 30000) score += 1;  // 30 sec = 1 point
        if (sessionDuration > 120000) score += 2; // 2 min = 2 more points
        if (sessionDuration > 300000) score += 2; // 5 min = 2 more points

        // Engagement scoring
        if (totalClicks > 0) score += Math.min(totalClicks / 3, 2);
        if (scrollDepth > 50) score += 1;
        if (scrollDepth > 75) score += 1;
        if (pagesVisited > 2) score += 2;
        if (pagesVisited > 4) score += 1;

        // Decision stage indicators
        if (behaviorData.sessionDuration > 5 * 60000) score += 3; // Over 5 minutes = strong indicator

        // Determine stage
        if (score >= 9) return 'Decision';
        if (score >= 5) return 'Consideration';
        return 'Awareness';
    }

    /**
     * 3. Generate Personalized Content
     */
    _generatePersonalizedContent(userIntent, buyingStage) {
        const strategy = this.serviceStrategies[userIntent] || this.serviceStrategies.web;

        // Select based on buying stage
        let headlineIdx, subheadingIdx, ctaIdx;

        if (buyingStage === 'Decision') {
            headlineIdx = 0; // Most aggressive headline
            subheadingIdx = 0;
            ctaIdx = 0;
        } else if (buyingStage === 'Consideration') {
            headlineIdx = 1;
            subheadingIdx = 1;
            ctaIdx = 1;
        } else {
            headlineIdx = Math.floor(Math.random() * strategy.headlines.length);
            subheadingIdx = Math.floor(Math.random() * strategy.subheadings.length);
            ctaIdx = Math.floor(Math.random() * strategy.ctas.length);
        }

        return {
            headline: strategy.headlines[headlineIdx],
            subheading: strategy.subheadings[subheadingIdx],
            cta: strategy.ctas[ctaIdx]
        };
    }

    /**
     * 4. Recommend Service
     */
    _recommendService(userIntent, behaviorData) {
        const serviceNames = {
            seo: 'Advanced SEO',
            ads: 'Paid Ads & PPC',
            web: 'Elite Web Design',
            social: 'Social Media Marketing',
            app: 'App Development',
            email: 'Email Marketing',
            video: 'Video Production',
            ecommerce: 'E-Commerce Solutions'
        };

        return serviceNames[userIntent] || 'Digital Marketing';
    }

    /**
     * 5. Generate Lead Conversion Strategy
     */
    _generateConversionStrategy(userIntent, buyingStage, behaviorData) {
        const strategy = this.serviceStrategies[userIntent] || this.serviceStrategies.web;

        let popupStrategy = strategy.popupStrategy;
        let offer = strategy.offers[0];
        let signals = [];

        if (buyingStage === 'Decision') {
            popupStrategy = 'Show immediately - strong conversion signal';
            offer = strategy.offers[0];
            signals = ['High engagement', 'Ready to convert', 'Decision stage detected'];
        } else if (buyingStage === 'Consideration') {
            offer = strategy.offers[Math.floor(Math.random() * strategy.offers.length)];
            signals = ['Comparing options', 'Deep research', 'Needs nurturing'];
        } else {
            signals = ['Exploring options', 'Early stage', 'Awareness mode'];
        }

        return {
            popupStrategy,
            offer,
            signals
        };
    }

    /**
     * 6. Generate Follow-Up Messages
     */
    _generateFollowUpMessages(userIntent, personalizedContent) {
        const strategy = this.serviceStrategies[userIntent] || this.serviceStrategies.web;

        const whatsappIdx = Math.floor(Math.random() * strategy.whatsappTemplates.length);
        const emailIdx = Math.floor(Math.random() * strategy.emailTemplates.length);

        const emailContent = strategy.emailTemplates[emailIdx];
        const [emailSubject, ...emailBody] = emailContent.split('\n\n');

        return {
            whatsapp: strategy.whatsappTemplates[whatsappIdx],
            emailSubject: emailSubject.replace('Subject: ', ''),
            email: emailBody.join('\n\n')
        };
    }

    /**
     * 7. Retargeting Strategy
     */
    _generateRetargetingStrategy(userIntent, buyingStage) {
        const strategy = this.serviceStrategies[userIntent] || this.serviceStrategies.web;
        return strategy.retargetingAds[Math.floor(Math.random() * strategy.retargetingAds.length)];
    }

    /**
     * Calculate confidence score (0-100)
     */
    _calculateConfidence(behaviorData) {
        let confidence = 50; // Base confidence

        if (behaviorData.sessionDuration > 300000) confidence += 20;
        if ((behaviorData.topClicks || []).length > 5) confidence += 15;
        if (behaviorData.scrollDepth > 75) confidence += 15;
        if ((behaviorData.pagesVisited || []).length > 3) confidence += 10;

        return Math.min(confidence, 100);
    }

    /**
     * Monitor behavior in real-time and trigger analysis
     */
    _monitorBehavior() {
        // Check every 5 seconds if we have enough data to analyze
        setInterval(() => {
            if (window.behaviorTracker) {
                const profile = window.behaviorTracker.getProfile();
                
                // Only analyze if we have meaningful engagement
                if (profile.sessionDuration > 15000 && 
                    (profile.totalClicks > 0 || profile.scrollDepth > 30)) {
                    
                    const analysis = this.analyzeUserBehavior(profile);
                    
                    // Store for later reference
                    window.lastAnalysis = analysis;
                }
            }
        }, 5000);
    }

    /**
     * Export analysis for use in reports and dashboards
     */
    exportAnalysis(behaviorData) {
        const analysis = this.analyzeUserBehavior(behaviorData);
        
        return {
            timestamp: new Date().toISOString(),
            analysis,
            behaviors: behaviorData,
            recommendations: this._generateRecommendations(analysis)
        };
    }

    /**
     * Generate actionable recommendations
     */
    _generateRecommendations(analysis) {
        const recommendations = [];

        if (analysis.buying_stage === 'Decision') {
            recommendations.push('🎯 HIGH PRIORITY: User is ready to convert. Show premium offer immediately.');
            recommendations.push('💬 Open chatbot with personalized consultation offer.');
            recommendations.push('📱 Push WhatsApp message within next 60 seconds.');
        }

        if (analysis.buying_stage === 'Consideration') {
            recommendations.push('⏳ User is comparing options. Build trust and provide proof.');
            recommendations.push('📊 Show case studies and results relevant to their service interest.');
            recommendations.push('📧 Send follow-up email with detailed information.');
        }

        if (analysis.buying_stage === 'Awareness') {
            recommendations.push('📚 Provide educational content about the service.');
            recommendations.push('📺 Show product demos or explainer videos.');
            recommendations.push('💡 Offer free audit or consultation to build interest.');
        }

        return recommendations;
    }
}

// Bootstrap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiAnalyticsEngine = new AIAnalyticsEngine();
    });
} else {
    window.aiAnalyticsEngine = new AIAnalyticsEngine();
}

