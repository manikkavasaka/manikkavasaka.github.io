import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, BadgeCheck, Star } from 'lucide-react';
import PageLayout from './PageLayout';
import { useRouter } from '../../router';
import { enhancedDB } from '../../db/enhancedDB';
import NewsletterSection from '../global/NewsletterSection';

const logos = ['Shopify', 'HubSpot', 'Notion', 'Slack', 'Stripe', 'Canva'];
const trustBadges = ['Google Partner', 'Meta Partner', 'Clutch Verified', 'Top Rated Agency'];

type ServiceConfig = {
  title: string;
  metaDescription: string;
  hero: string;
  subhero: string;
  whatIsIt: string;
  whatWeDo: string[];
  process: string[];
  highlightsTitle: string;
  highlights: string[];
  visualTitle: string;
  visualItems: string[];
  resultStory: string;
  stats: { label: string; value: string }[];
  pricing: { name: string; price: string; note: string }[];
  faq: { q: string; a: string }[];
  cta: string;
  image: string;
  accent: string;
  bgAccent: string;
  related: string[];
  testimonialKey: string;
  caseCategory: string;
};

const services: Record<string, ServiceConfig> = {
  seo: {
    title: 'SEO Optimization',
    metaDescription: 'Rank #1 on Google with SEO services covering on-page, off-page, technical SEO, local SEO, e-commerce SEO, Core Web Vitals, schema markup, and monthly reporting.',
    hero: 'Rank #1 on Google & Drive Organic Traffic',
    subhero: 'On-page SEO, Off-page SEO, Technical SEO, Local SEO, and E-commerce SEO campaigns built for long-term organic growth.',
    whatIsIt: 'SEO is the long-term growth engine that helps your business rank higher on Google, attract qualified traffic, and generate leads without paying for every click. We combine technical SEO, keyword strategy, content planning, local visibility, and authority building to improve rankings and revenue.',
    whatWeDo: [
      'On-page SEO optimization',
      'Off-page SEO and link building',
      'Technical SEO fixes',
      'Local SEO',
      'E-commerce SEO',
      'Core Web Vitals optimization',
      'Schema markup setup',
      'Competitor gap analysis',
      'Content gap reporting',
      'Google Business Profile optimization'
    ],
    process: ['Site Audit', 'Keyword Research', 'On-page Fix', 'Link Building', 'Monthly Reporting'],
    highlightsTitle: 'Tools used',
    highlights: ['Ahrefs', 'SEMrush', 'Screaming Frog', 'Google Search Console', 'Moz'],
    visualTitle: 'What you’ll see',
    visualItems: ['Keyword opportunity map', 'Core Web Vitals fixes', 'Competitor gap report', 'Monthly SEO growth dashboard'],
    resultStory: 'Organic traffic increased 3x in 6 months and the client achieved page 1 ranking for 50+ keywords after a structured SEO roadmap and technical cleanup.',
    stats: [{ label: 'Organic traffic', value: '3x' }, { label: 'Page 1 keywords', value: '50+' }, { label: 'Lead growth', value: '+210%' }],
    pricing: [
      { name: 'Basic', price: '$999/mo', note: 'Foundational SEO + local visibility' },
      { name: 'Growth', price: '$1,799/mo', note: 'Technical SEO + content + links' },
      { name: 'Dominate', price: '$3,499/mo', note: 'Aggressive organic growth system' }
    ],
    faq: [
      { q: 'How long does SEO take to show results?', a: 'Usually 3–6 months for meaningful movement depending on competition, website health, and content velocity.' },
      { q: 'Do you guarantee first page ranking?', a: 'No ethical agency can guarantee exact rankings. We guarantee execution quality, transparent reporting, and best-practice SEO work.' },
      { q: 'What is included in monthly reporting?', a: 'Keyword movement, traffic, technical fixes completed, authority growth, content performance, and next-step actions.' },
      { q: 'Will you work on our existing website?', a: 'Yes. We can optimize your current website, whether it is WordPress, Shopify, custom, or headless.' }
    ],
    cta: 'Get Free SEO Audit',
    image: '/images/seo-service.jpg',
    accent: 'text-blue-600',
    bgAccent: 'bg-blue-50',
    related: ['local-seo', 'content-marketing', 'web-dev'],
    testimonialKey: 'SEO',
    caseCategory: 'SEO'
  },
  'social-media': {
    title: 'Social Media Marketing',
    metaDescription: 'Grow followers, engagement, and brand love with Instagram, Facebook, LinkedIn, YouTube, X, Pinterest, and Threads content + strategy.',
    hero: 'Build a Brand That People Love & Follow',
    subhero: 'Instagram, Facebook, LinkedIn, YouTube, X, Pinterest, and Threads strategies with content creation, engagement, and analytics.',
    whatIsIt: 'Social media marketing helps your brand earn attention, trust, and community. We create platform-specific content and manage publishing, engagement, storytelling, and reporting to grow reach, relevance, and conversions.',
    whatWeDo: [
      'Reels, posts, stories, and carousel content creation',
      'Profile optimization',
      'Community management & engagement',
      'Hashtag research & strategy',
      'Influencer collaboration',
      'Monthly analytics reporting',
      'Story and highlight design',
      'Reel scripting & editing',
      'Platform-specific strategy',
      'Competitor benchmarking'
    ],
    process: ['Strategy', 'Content Planning', 'Creative Production', 'Publishing', 'Community Management', 'Analytics'],
    highlightsTitle: 'Platforms',
    highlights: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'X (Twitter)', 'Pinterest', 'Threads'],
    visualTitle: 'Show section',
    visualItems: ['Before/after engagement stats', 'Sample content calendar', 'Sample reel and post designs', 'Monthly post approvals'],
    resultStory: 'One client grew from 500 to 50,000 followers in 4 months while improving engagement rate from 1% to 8% using reels, content pillars, and audience-specific creative.',
    stats: [{ label: 'Follower growth', value: '500 → 50K' }, { label: 'Engagement rate', value: '1% → 8%' }, { label: 'Content assets', value: '30+/mo' }],
    pricing: [
      { name: 'Starter', price: '$899/mo', note: '12 posts per month' },
      { name: 'Growth', price: '$1,499/mo', note: '20 posts per month + reels' },
      { name: 'Premium', price: '$2,499/mo', note: '30+ assets + multi-platform management' }
    ],
    faq: [
      { q: 'How many posts per month?', a: 'Depending on the package, we create 12, 20, or 30+ monthly content assets.' },
      { q: 'Who creates the content?', a: 'Our in-house strategists, designers, editors, and copywriters handle the creative process.' },
      { q: 'Can we approve before publishing?', a: 'Yes. We share a structured content calendar and approval workflow before scheduling.' },
      { q: 'Do you manage comments and DMs?', a: 'Yes, community engagement and DM handling can be included based on your package.' }
    ],
    cta: 'Get Free Social Media Audit',
    image: '/images/social-media.jpg',
    accent: 'text-pink-600',
    bgAccent: 'bg-pink-50',
    related: ['influencer-marketing', 'video-marketing', 'branding'],
    testimonialKey: 'Social',
    caseCategory: 'Social'
  },
  ppc: {
    title: 'Google Ads / PPC Management',
    metaDescription: 'Drive measurable revenue through Search, Display, Shopping, YouTube, Remarketing, and Performance Max campaigns.',
    hero: 'Turn Every Rupee Into Measurable Revenue',
    subhero: 'Search Ads, Display Ads, Shopping Ads, YouTube Ads, Remarketing, and Performance Max campaigns with full-funnel reporting.',
    whatIsIt: 'PPC is the fastest way to generate traffic and conversions when your targeting, ad copy, tracking, and landing pages are aligned. We build performance campaigns around ROI, not just clicks.',
    whatWeDo: [
      'Keyword research & negative keyword setup',
      'Ad copywriting & creative direction',
      'Bid strategy & budget management',
      'Landing page optimization',
      'A/B split testing',
      'Weekly & monthly reporting',
      'Google Merchant Center setup',
      'Google Tag Manager & conversion tracking',
      'Competitor ad analysis',
      'Call tracking integration',
      'Custom Google Looker Studio dashboard'
    ],
    process: ['Audit', 'Structure', 'Launch', 'Testing', 'Optimization', 'Reporting'],
    highlightsTitle: 'Ad types',
    highlights: ['Search Ads', 'Display Ads', 'Shopping Ads', 'YouTube Ads', 'Remarketing', 'Performance Max'],
    visualTitle: 'Key metrics we track',
    visualItems: ['CTR', 'CPC', 'CPL', 'ROAS', 'Conversion Rate', 'Impression Share', 'Quality Score'],
    resultStory: 'Generated ₹2.5L revenue with ₹50K ad spend and reduced CPC by 40% in 3 months through better structure, landing page alignment, and negative keyword cleanup.',
    stats: [{ label: 'Revenue', value: '₹2.5L' }, { label: 'Ad spend', value: '₹50K' }, { label: 'CPC reduction', value: '-40%' }],
    pricing: [
      { name: 'Setup Fee', price: '$499 one-time', note: 'Tracking, structure, and launch setup' },
      { name: 'Monthly Management', price: '$1,250/mo', note: 'Optimization + reporting + testing' },
      { name: 'Scale Program', price: 'Custom', note: 'For higher spend / multi-campaign brands' }
    ],
    faq: [
      { q: 'What is the minimum ad budget?', a: 'A practical test budget usually starts at $1,000–$2,000/month depending on your industry and goals.' },
      { q: 'Who owns the ad account?', a: 'You own the ad account. We manage it with full transparency and reporting.' },
      { q: 'How do you track conversions?', a: 'We use GA4, Google Tag Manager, form tracking, calls, and purchase/conversion events.' },
      { q: 'Do you handle creatives too?', a: 'Yes. We support ad copy, creative direction, and creative testing recommendations.' }
    ],
    cta: 'Get Free Ads Account Audit',
    image: '/images/google-ads.jpg',
    accent: 'text-amber-600',
    bgAccent: 'bg-amber-50',
    related: ['seo', 'web-dev', 'email-marketing'],
    testimonialKey: 'Google Ads',
    caseCategory: 'Google Ads'
  },
  'web-dev': {
    title: 'Website Design & Development',
    metaDescription: 'Build fast, mobile-first, SEO-ready websites, e-commerce stores, landing pages, booking websites, and custom web apps.',
    hero: 'Websites That Look Great & Convert Visitors',
    subhero: 'Business websites, e-commerce stores, landing pages, portfolio sites, booking systems, membership sites, and custom web apps.',
    whatIsIt: 'A modern website is your digital sales engine. It should load fast, look great on mobile, rank on search, and convert visitors into leads or customers.',
    whatWeDo: [
      'Mobile-first responsive design',
      'SEO-ready site structure',
      'Fast loading optimization (under 3 seconds goal)',
      'CMS for easy content editing',
      'Contact forms & lead capture',
      'Google Analytics integration',
      '1 year free support',
      'Logo & branding add-on',
      'Copywriting for all pages',
      'Multilingual website support',
      'Ongoing maintenance plan'
    ],
    process: ['Discovery', 'Wireframe', 'Design', 'Development', 'Testing', 'Launch'],
    highlightsTitle: 'Tech stack',
    highlights: ['WordPress', 'Webflow', 'React', 'Next.js', 'Shopify', 'WooCommerce'],
    visualTitle: 'Portfolio proof',
    visualItems: ['Live portfolio screenshots & links', 'Before/after redesign examples', 'Performance score screenshots', 'Conversion-focused page structure'],
    resultStory: 'Landing pages can be delivered in 3–5 days, business sites in 1–2 weeks, and e-commerce in 2–4 weeks depending on scope and content readiness.',
    stats: [{ label: 'Landing Page', value: '3–5 days' }, { label: 'Business Site', value: '1–2 weeks' }, { label: 'E-commerce', value: '2–4 weeks' }],
    pricing: [
      { name: 'Landing Page', price: '$1,499', note: 'Lead-gen single page' },
      { name: 'Business Site', price: '$2,999', note: '5–10 pages + CMS' },
      { name: 'E-commerce', price: '$5,999+', note: 'Storefront + cart + checkout strategy' }
    ],
    faq: [
      { q: 'Is domain & hosting included?', a: 'Optional. We can set them up for you or work with your existing provider.' },
      { q: 'Can we edit content ourselves after delivery?', a: 'Yes. We build with editable CMS options where needed.' },
      { q: 'Do you redesign existing websites?', a: 'Yes. Redesign, migration, and performance improvement projects are supported.' },
      { q: 'What happens after 1 year support ends?', a: 'You can continue with a maintenance retainer or request support on demand.' }
    ],
    cta: 'Get Free Website Mockup',
    image: '/images/web-dev.jpg',
    accent: 'text-violet-600',
    bgAccent: 'bg-violet-50',
    related: ['seo', 'ppc', 'branding'],
    testimonialKey: 'Brand',
    caseCategory: 'Website'
  },
  'content-marketing': {
    title: 'Content Marketing',
    metaDescription: 'Create SEO blogs, infographics, email newsletters, case studies, scripts, white papers, and content calendars that drive traffic and leads.',
    hero: 'Content That Attracts, Engages & Converts',
    subhero: 'Blog articles, video scripts, infographics, email newsletters, case studies, white papers, LinkedIn articles, website copy, and more.',
    whatIsIt: 'Content marketing builds trust, improves search visibility, supports sales, and nurtures leads across every stage of the funnel. It turns expertise into a scalable traffic and demand engine.',
    whatWeDo: [
      'Content strategy & editorial calendar',
      'SEO keyword-driven writing',
      'Content distribution plan',
      'Repurposing content across platforms',
      'Performance tracking & optimization',
      'Pillar page & topic cluster strategy',
      'Internal linking strategy',
      'Content refresh for old posts',
      'Lead magnet creation (PDF, checklist)',
      'Video script writing'
    ],
    process: ['Research', 'Calendar', 'Creation', 'SEO Optimization', 'Distribution', 'Performance Review'],
    highlightsTitle: 'Content types',
    highlights: ['Blog Articles', 'Video Scripts', 'Infographics', 'Email Newsletters', 'Case Studies', 'White Papers', 'Website Copy', 'E-books'],
    visualTitle: 'Show section',
    visualItems: ['Sample blog post', 'Sample infographic', 'Content calendar template', 'Topic cluster plan'],
    resultStory: 'Blog traffic grew 5x in 3 months and email open rate improved to 42% through better content strategy, distribution, and optimization.',
    stats: [{ label: 'Traffic growth', value: '5x' }, { label: 'Open rate', value: '42%' }, { label: 'Content output', value: '4 / 8 / 12 articles' }],
    pricing: [
      { name: '4 Articles', price: '$799/mo', note: 'SEO blog starter package' },
      { name: '8 Articles', price: '$1,299/mo', note: 'Growth content engine' },
      { name: '12 Articles', price: '$1,999/mo', note: 'Aggressive authority + lead gen' }
    ],
    faq: [
      { q: 'Who writes the content?', a: 'Our in-house writers and strategists create the content based on your goals, tone, and industry.' },
      { q: 'Do you understand our industry?', a: 'Yes. We begin with research, interviews, and competitor analysis to match your market accurately.' },
      { q: 'Will content be SEO optimized?', a: 'Yes. Keyword targeting, structure, internal links, and search intent are baked in.' },
      { q: 'Can we request revisions?', a: 'Yes. Revision rounds are included in the workflow for quality and alignment.' }
    ],
    cta: 'Get Free Content Audit',
    image: '/images/content-marketing.jpg',
    accent: 'text-emerald-600',
    bgAccent: 'bg-emerald-50',
    related: ['seo', 'email-marketing', 'video-marketing'],
    testimonialKey: 'Content',
    caseCategory: 'Content'
  },
  branding: {
    title: 'Brand Strategy',
    metaDescription: 'Build a brand that stands out with logo design, positioning, competitor research, messaging frameworks, and full brand guideline delivery.',
    hero: 'Build a Brand That Stands Out & Sells',
    subhero: 'Brand identity, messaging, target audience clarity, competitor research, and full brand guidelines designed for business growth.',
    whatIsIt: 'Brand strategy is the foundation of how your market remembers, trusts, and chooses you. It aligns identity, positioning, messaging, tone, and visual consistency into one scalable system.',
    whatWeDo: [
      'Brand identity (logo, colors, fonts, imagery)',
      'Brand voice, tone & messaging framework',
      'Target audience & buyer persona creation',
      'Competitor & market research',
      'Brand positioning strategy',
      'Brand guidelines document (brand bible)',
      'Tagline & mission/vision creation',
      'Brand audit for existing businesses',
      'Rebranding strategy',
      'Pitch deck design',
      'Business card & stationery design',
      'Brand video / motion graphics'
    ],
    process: ['Discovery Call', 'Research & Analysis', 'Strategy Development', 'Design', 'Presentation', 'Revisions', 'Final Delivery'],
    highlightsTitle: 'Deliverables',
    highlights: ['Brand strategy document', 'Logo files (PNG, SVG, AI)', 'Color palette', 'Typography kit', 'Brand guidelines PDF', 'Social media kit'],
    visualTitle: 'Show section',
    visualItems: ['Before/after brand transformation', 'Sample brand guidelines document', 'Messaging architecture', 'Visual identity system'],
    resultStory: 'Strong brand systems improve trust, recall, conversion quality, and pricing power — especially when paired with a consistent website and social presence.',
    stats: [{ label: 'Brands built', value: '300+' }, { label: 'Recall uplift', value: '+250%' }, { label: 'Brand systems', value: '500+' }],
    pricing: [
      { name: 'Starter Brand', price: '$1,750', note: 'Identity basics + logo' },
      { name: 'Full Brand', price: '$3,250', note: 'Identity + positioning + guidelines' },
      { name: 'Brand + Website', price: '$5,999+', note: 'Full rollout package' }
    ],
    faq: [
      { q: 'How many logo concepts will you provide?', a: 'Usually 2–4 strategic logo routes are shared before selecting and refining the final direction.' },
      { q: 'How many revision rounds are included?', a: 'Structured revision rounds are included depending on the selected package scope.' },
      { q: 'How long does the branding process take?', a: 'Most branding projects take 2–4 weeks depending on revisions and deliverables.' },
      { q: 'Do you also handle printing?', a: 'We handle print-ready design files and can coordinate vendor-ready outputs where needed.' }
    ],
    cta: 'Book Free Brand Consultation',
    image: '/images/branding.jpg',
    accent: 'text-indigo-600',
    bgAccent: 'bg-indigo-50',
    related: ['web-dev', 'social-media', 'video-marketing'],
    testimonialKey: 'Brand',
    caseCategory: 'Branding'
  },
  'email-marketing': {
    title: 'Email Marketing',
    metaDescription: 'Plan, design, automate, and optimize email marketing campaigns using Mailchimp, Klaviyo, SendGrid, and Zoho Campaigns.',
    hero: 'Reach Your Audience Directly in Their Inbox',
    subhero: 'Email strategy, automation, segmentation, template design, testing, and monthly reporting for higher retention and revenue.',
    whatIsIt: 'Email marketing gives you direct access to your audience without depending entirely on ad platforms. It is one of the highest ROI channels for nurturing leads and increasing customer lifetime value.',
    whatWeDo: [
      'Email strategy & campaign planning',
      'Template design (mobile-friendly)',
      'List segmentation & management',
      'Automated drip sequences',
      'A/B subject line testing',
      'Deliverability optimization',
      'Monthly performance reporting',
      'Welcome sequence setup',
      'Abandoned cart emails',
      'Re-engagement campaigns',
      'Lead magnet + opt-in setup'
    ],
    process: ['Audit', 'List Strategy', 'Flow Planning', 'Design & Copy', 'Automation Setup', 'Optimization'],
    highlightsTitle: 'Tools',
    highlights: ['Mailchimp', 'Klaviyo', 'SendGrid', 'Zoho Campaigns'],
    visualTitle: 'Email outcomes',
    visualItems: ['Welcome sequence map', 'Abandoned cart workflow', 'Revenue attribution reporting', 'List growth strategy'],
    resultStory: '42% average open rate achieved and email contributed 30% of total revenue for one retention-focused client setup.',
    stats: [{ label: 'Open rate', value: '42%' }, { label: 'Revenue share', value: '30%' }, { label: 'Flows built', value: '700+' }],
    pricing: [
      { name: 'Starter', price: '$699/mo', note: 'Campaigns + one automation' },
      { name: 'Growth', price: '$1,199/mo', note: 'Lifecycle flows + segmentation' },
      { name: 'Enterprise', price: 'Custom', note: 'Advanced CRM + retention systems' }
    ],
    faq: [
      { q: 'How do we grow our email list?', a: 'Lead magnets, opt-in forms, popup offers, list segmentation, and better signup UX help grow quality subscribers.' },
      { q: 'What is a good open rate?', a: 'It depends on industry, but 25–40% is generally strong when segmentation and deliverability are healthy.' },
      { q: 'Can you migrate our existing list?', a: 'Yes. We can migrate and clean your list into the right ESP or CRM.' }
    ],
    cta: 'Get Free Email Audit',
    image: '/images/content-marketing.jpg',
    accent: 'text-sky-600',
    bgAccent: 'bg-sky-50',
    related: ['content-marketing', 'ppc', 'seo'],
    testimonialKey: 'Content',
    caseCategory: 'Content'
  },
  'video-marketing': {
    title: 'Video Marketing',
    metaDescription: 'Create explainer videos, product demos, reels, YouTube ads, testimonial videos, and repurposed short-form content.',
    hero: 'Tell Your Brand Story Through Powerful Video',
    subhero: 'Explainers, product demos, testimonial videos, YouTube ads, reels, animated videos, event coverage, and short-form content repurposing.',
    whatIsIt: 'Video marketing helps you communicate faster, hold attention longer, and convert better across ads, social media, YouTube, and landing pages.',
    whatWeDo: [
      'Script writing & storyboarding',
      'Shooting & direction (on-location)',
      'Video editing & color grading',
      'Subtitles & captions',
      'Thumbnail design',
      'YouTube channel optimization',
      'Video SEO',
      'Voice-over support',
      'Motion graphics & animation',
      'Video repurposing (1 long → 5 shorts)'
    ],
    process: ['Brief', 'Script', 'Production', 'Editing', 'Publishing', 'Optimization'],
    highlightsTitle: 'Tools',
    highlights: ['Premiere Pro', 'After Effects', 'CapCut', 'DaVinci'],
    visualTitle: 'Video formats',
    visualItems: ['Explainer videos', 'Product demos', 'Reels', 'YouTube ads', 'Corporate videos', 'Animated videos'],
    resultStory: 'A YouTube channel reached 100K views in 60 days through optimized thumbnails, scripts, editing, and distribution consistency.',
    stats: [{ label: 'YouTube views', value: '100K' }, { label: 'Delivery styles', value: '6+' }, { label: 'CTR gain', value: '+68%' }],
    pricing: [
      { name: 'Single Video', price: '$450+', note: 'One-off production or editing' },
      { name: 'Monthly Retainer', price: '$1,200/mo', note: 'Short-form or campaign content batch' },
      { name: 'Full Production', price: 'Custom', note: 'Multi-video and on-location production' }
    ],
    faq: [
      { q: 'Do you handle shooting or only editing?', a: 'We can do both depending on project scope, location, and format.' },
      { q: 'How long does production take?', a: 'Simple editing can take a few days. Larger production timelines depend on planning and review rounds.' },
      { q: 'Can you do animated explainer videos?', a: 'Yes. Motion graphics and animated explainer formats are available.' }
    ],
    cta: 'Get Free Video Consultation',
    image: '/images/content-marketing.jpg',
    accent: 'text-orange-600',
    bgAccent: 'bg-orange-50',
    related: ['social-media', 'content-marketing', 'ppc'],
    testimonialKey: 'Content',
    caseCategory: 'Content'
  },
  'influencer-marketing': {
    title: 'Influencer Marketing',
    metaDescription: 'Reach millions through trusted creators using influencer research, campaigns, UGC, ambassador programs, and tracking.',
    hero: 'Reach Millions Through Trusted Voices',
    subhero: 'Mega, macro, micro, and nano influencer campaigns across Instagram, YouTube, X, LinkedIn, and meme pages.',
    whatIsIt: 'Influencer marketing lets brands borrow trust and attention from creators who already have relevant audience credibility. It works especially well for awareness, social proof, and UGC generation.',
    whatWeDo: [
      'Influencer research & vetting',
      'Campaign strategy & brief creation',
      'Contract & negotiation handling',
      'Content review & approval',
      'Campaign tracking & reporting',
      'Long-term ambassador programs',
      'UGC campaigns',
      'Affiliate program setup',
      'Influencer gifting campaigns'
    ],
    process: ['Research', 'Vetting', 'Briefing', 'Launch', 'Tracking', 'Optimization'],
    highlightsTitle: 'Influencer types',
    highlights: ['Mega (1M+)', 'Macro (100K+)', 'Micro (10K–100K)', 'Nano (1K–10K)'],
    visualTitle: 'Platforms',
    visualItems: ['Instagram', 'YouTube', 'X', 'LinkedIn', 'Meme pages'],
    resultStory: 'Micro-influencer strategy delivered 500K reach and 3x ROAS through targeted creator selection and UGC amplification.',
    stats: [{ label: 'Campaign ROAS', value: '3x' }, { label: 'Reach', value: '500K+' }, { label: 'Creator network', value: '1,200+' }],
    pricing: [
      { name: 'One-time Campaign', price: '$1,500+', note: 'Influencer activation sprint' },
      { name: 'Monthly Retainer', price: '$2,900/mo', note: 'Always-on creator engine' },
      { name: 'UGC + Affiliate', price: 'Custom', note: 'Performance-focused creator system' }
    ],
    faq: [
      { q: 'How do you choose the right influencer?', a: 'Audience fit, engagement quality, brand alignment, platform strength, and campaign goals are all evaluated.' },
      { q: 'Do you guarantee results?', a: 'Guaranteed exact outcomes are not realistic, but we optimize creator fit, reporting, and campaign structure for strong performance.' },
      { q: 'Who owns the content after the campaign?', a: 'Usage rights depend on contract scope. We can negotiate licensing and whitelisting terms for paid usage.' }
    ],
    cta: 'Get Free Influencer Strategy Call',
    image: '/images/social-media.jpg',
    accent: 'text-rose-600',
    bgAccent: 'bg-rose-50',
    related: ['social-media', 'video-marketing', 'branding'],
    testimonialKey: 'Social',
    caseCategory: 'Social'
  },
  'local-seo': {
    title: 'Local SEO / Google Business Profile',
    metaDescription: 'Get more calls, direction requests, and walk-ins using Google Business Profile optimization, citations, local landing pages, and map ranking strategy.',
    hero: 'Dominate Local Search & Get More Walk-ins',
    subhero: 'Google Business Profile setup, maps optimization, local citations, review generation, local pages, and multi-location SEO management.',
    whatIsIt: 'Local SEO helps nearby customers discover your business on Google Search and Google Maps. It is essential for clinics, restaurants, agencies, shops, and any business that depends on local visibility.',
    whatWeDo: [
      'Google Business Profile setup & optimization',
      'Local keyword research',
      'NAP consistency',
      'Local citation building',
      'Review generation strategy',
      'Local link building',
      'Local landing page creation',
      'Google Maps ranking optimization',
      'Multi-location SEO management',
      'Review response management',
      'Competitor local analysis'
    ],
    process: ['Local Audit', 'GBP Optimization', 'Citation Cleanup', 'Landing Pages', 'Review Strategy', 'Ranking Tracking'],
    highlightsTitle: 'Local growth focus',
    highlights: ['Google Maps', 'GBP', 'Citations', 'Review generation', 'Multi-location support'],
    visualTitle: 'Result signals',
    visualItems: ['Direction requests', 'Maps ranking', 'Review velocity', 'Local pack impressions'],
    resultStory: 'One local business ranked #1 on Google Maps in 45 days and increased direction requests by 300% with GBP optimization and citation cleanup.',
    stats: [{ label: 'Maps rank', value: '#1' }, { label: 'Timeline', value: '45 days' }, { label: 'Direction requests', value: '+300%' }],
    pricing: [
      { name: 'One-time Setup', price: '$499', note: 'GBP setup + local foundation' },
      { name: 'Monthly Management', price: '$599/mo', note: 'Rank growth + reviews + optimization' },
      { name: 'Multi-location', price: 'Custom', note: 'For brands with several locations' }
    ],
    faq: [
      { q: 'How long to rank on Google Maps?', a: 'Results vary by competition, location, and GBP strength, but many businesses see strong local movement within 30–90 days.' },
      { q: 'Do we need a physical address?', a: 'For strongest local maps visibility, a legitimate business address or service-area setup is important.' },
      { q: 'Can you manage multiple locations?', a: 'Yes. Multi-location local SEO and profile management are supported.' }
    ],
    cta: 'Get Free Local SEO Audit',
    image: '/images/seo-service.jpg',
    accent: 'text-lime-600',
    bgAccent: 'bg-lime-50',
    related: ['seo', 'web-dev', 'social-media'],
    testimonialKey: 'Local',
    caseCategory: 'SEO'
  }
};

const serviceLabelMap: Record<string, string> = {
  seo: 'SEO Optimization',
  ppc: 'Google Ads / PPC',
  'social-media': 'Social Media Marketing',
  'content-marketing': 'Content Marketing',
  'email-marketing': 'Email Marketing',
  'web-dev': 'Website Design & Development',
  'influencer-marketing': 'Influencer Marketing',
  'video-marketing': 'Video Marketing',
  'local-seo': 'Local SEO / Google Business Profile',
  branding: 'Brand Strategy'
};

export default function ServiceDetailPage() {
  const { page, navigate } = useRouter();
  const service = services[page];
  const testimonials = enhancedDB
    .getTestimonials()
    .filter((item) => item.service.toLowerCase().includes(service?.testimonialKey.toLowerCase() || ''))
    .slice(0, 2);
  const caseStudies = enhancedDB
    .getCaseStudies()
    .filter((item) => item.category.toLowerCase().includes(service?.caseCategory.toLowerCase() || ''))
    .slice(0, 1);

  useEffect(() => {
    if (!service) return;

    const previous = document.getElementById('faq-schema-jsonld');
    if (previous) previous.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.id = 'faq-schema-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const current = document.getElementById('faq-schema-jsonld');
      if (current) current.remove();
    };
  }, [service]);

  if (!service) {
    return (
      <PageLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
          <button onClick={() => navigate('services')} className="mt-4 text-indigo-600 font-semibold">
            View all services
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={service.title} description={service.metaDescription}>
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('services')}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </button>

          {/* Hero */}
          <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full ${service.bgAccent} px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${service.accent}`}>
                <Sparkles className="h-3.5 w-3.5" /> {serviceLabelMap[page]}
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{service.hero}</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-500">{service.subhero}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500"
                >
                  {service.cta} <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('portfolio')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  View results
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
                    <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" /> {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img src={service.image} alt={service.title} className="h-[420px] w-full object-cover" />
            </div>
          </section>

          {/* Client logo strip */}
          <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Client social proof</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo) => (
                <div key={logo} className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-500">
                  {logo}
                </div>
              ))}
            </div>
          </section>

          {/* What is it */}
          <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-black text-slate-900">What is it</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{service.whatIsIt}</p>
            </div>
            <div className={`rounded-3xl ${service.bgAccent} p-6`}>
              <h3 className={`text-sm font-black uppercase tracking-wider ${service.accent}`}>{service.highlightsTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.highlights.map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* What we do */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">What we do</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.whatWeDo.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <CheckCircle2 className={`h-5 w-5 ${service.accent}`} />
                  <p className="mt-3 text-sm font-semibold text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">Process</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {service.process.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${service.bgAccent} text-sm font-black ${service.accent}`}>
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-base font-black text-slate-900">{step}</h3>
                  <p className="mt-1 text-xs text-slate-500">Execution step with measurable outputs and reporting.</p>
                </div>
              ))}
            </div>
          </section>

          {/* Results / Stats */}
          <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Results / Stats</h2>
              <div className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-950 p-6 text-white shadow-xl">
                <p className="text-sm leading-relaxed text-slate-200">{service.resultStory}</p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {service.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6">
                <h3 className="text-lg font-black text-slate-900">{service.visualTitle}</h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.visualItems.map((item) => (
                    <div key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Relevant case study</h3>
              {caseStudies.length > 0 ? (
                caseStudies.map((entry) => (
                  <div key={entry.id} className="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                    <img src={entry.image} alt={entry.title} className="h-48 w-full object-cover" />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{entry.category}</p>
                      <h4 className="mt-2 text-lg font-black text-slate-900">{entry.title}</h4>
                      <p className="mt-2 text-sm text-slate-500">{entry.challenge}</p>
                      <button onClick={() => navigate('case-study', { slug: entry.slug })} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                        View full case study <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
                  Relevant case study preview available in the portfolio section.
                </div>
              )}
            </div>
          </section>

          {/* Pricing */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">Pricing</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {service.pricing.map((pkg) => (
                <div key={pkg.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900">{pkg.name}</h3>
                  <p className="mt-3 text-3xl font-black text-slate-900">{pkg.price.replace(/\$/g, '₹')}</p>
                  <p className="mt-2 text-sm text-slate-500">{pkg.note}</p>
                  <button onClick={() => navigate('contact')} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
                    Get a Quote
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">Google / Clutch Reviews</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.length > 0 ? (
                testimonials.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">“{item.text}”</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl">{item.avatar}</div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.role}, {item.company}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
                  Testimonial preview available from our client review library.
                </div>
              )}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">FAQ</h2>
            <div className="mt-6 space-y-4">
              {service.faq.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm open:border-indigo-200 open:bg-indigo-50/40">
                  <summary className="cursor-pointer list-none text-sm font-black text-slate-900">{item.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related services */}
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-900">Related Services</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {service.related.map((key) => (
                <button key={key} onClick={() => navigate(key as any)} className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Cross-sell</p>
                  <h3 className="mt-2 text-lg font-black text-slate-900">{serviceLabelMap[key]}</h3>
                  <p className="mt-2 text-sm text-slate-500">Explore how this service complements your current growth strategy.</p>
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white shadow-2xl">
            <BadgeCheck className="mx-auto h-10 w-10" />
            <h2 className="mt-4 text-3xl font-black">{service.cta}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-indigo-100">
              Ready to grow? We’ll share a practical roadmap, pricing guidance, and quick wins for your business.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('contact')} className="rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50">
                Book Free Consultation
              </button>
              <button onClick={() => navigate('portfolio')} className="rounded-2xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">
                See More Results
              </button>
            </div>
          </section>
        </div>
      </div>
      <NewsletterSection compact />
    </PageLayout>
  );
}
