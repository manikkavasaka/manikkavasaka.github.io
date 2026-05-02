

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readTime: string;
  views: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: { linkedin?: string; twitter?: string };
}

export interface CaseStudyDetail {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  image: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; before?: string }[];
  testimonial: { name: string; role: string; text: string };
  tags: string[];
}

export interface TestimonialDetail {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  service: string;
  industry: string;
}

export interface PageView {
  page: string;
  timestamp: string;
  sessionId: string;
}

const STORAGE_KEYS = {
  BLOGS: 'gl_blogs',
  TEAM: 'gl_team',
  CASE_STUDIES: 'gl_case_studies',
  TESTIMONIALS: 'gl_testimonials',
  PAGE_VIEWS: 'gl_page_views',
  CONTACT_SUBMISSIONS: 'gl_contact_submissions',
  NEWSLETTER: 'gl_newsletter',
};

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b1', slug: 'seo-trends-2026',
    title: 'Top 10 SEO Trends for 2026: What Every Business Needs to Know',
    excerpt: 'Google\'s algorithm is evolving rapidly. Discover the SEO strategies that will dominate search rankings in 2026.',
    content: `Search engine optimization continues to evolve at a rapid pace. In 2026, businesses need to focus on AI-driven content, Core Web Vitals, and semantic search. Google's SGE (Search Generative Experience) is changing how users interact with search results.\n\nKey trends include:\n1. AI-optimized content that matches search intent\n2. Voice search optimization for smart speakers\n3. Video SEO for YouTube and TikTok\n4. E-E-A-T signals for YMYL content\n5. Local SEO with Google Business Profile optimization\n6. Core Web Vitals as a primary ranking factor\n7. Zero-click searches and featured snippets\n8. Mobile-first indexing completion\n9. Schema markup for rich results\n10. Sustainable SEO practices`,
    author: 'Sarah Jenkins', authorAvatar: '👩‍💼',
    category: 'SEO', tags: ['SEO', 'Google', 'Trends', '2026'],
    image: '/images/seo-service.jpg', date: '2026-01-15', readTime: '8 min', views: 1240
  },
  {
    id: 'b2', slug: 'google-ads-roas-guide',
    title: 'How to Achieve 8x ROAS with Google Ads: A Complete Guide',
    excerpt: 'Learn the exact strategies we use to generate 8x return on ad spend for our e-commerce clients using Google Ads.',
    content: `Achieving a high ROAS with Google Ads requires a combination of smart bidding strategies, audience targeting, and landing page optimization.\n\nOur proven framework:\n1. Structure campaigns by intent (brand, generic, competitor)\n2. Use Performance Max for omnichannel reach\n3. Implement conversion value rules\n4. Leverage first-party data for audience signals\n5. Optimize product feeds for Shopping campaigns\n6. Use responsive search ads with 15 headlines\n7. Implement negative keyword lists aggressively\n8. Set up enhanced conversions for better tracking`,
    author: 'Michael Chen', authorAvatar: '👨‍💻',
    category: 'Ads', tags: ['Google Ads', 'ROAS', 'PPC', 'E-commerce'],
    image: '/images/google-ads.jpg', date: '2026-01-10', readTime: '12 min', views: 980
  },
  {
    id: 'b3', slug: 'social-media-viral-content',
    title: 'The Science of Viral Content: Social Media Marketing Secrets',
    excerpt: 'What makes content go viral? We analyzed 10,000 viral posts to uncover the patterns behind social media success.',
    content: `Viral content isn't luck — it's science. Our analysis of 10,000 viral posts across Instagram, TikTok, and Facebook reveals clear patterns.\n\nThe viral formula:\n1. Hook within 3 seconds (pattern interrupt)\n2. Emotional triggers (curiosity, surprise, joy)\n3. Shareable format (carousel, reel, story)\n4. Optimal posting times by platform\n5. Hashtag strategy (3-5 niche tags)\n6. User-generated content amplification\n7. Influencer collaboration frameworks\n8. Community-driven content loops`,
    author: 'Eleanor Vance', authorAvatar: '👩‍🔬',
    category: 'Social Media', tags: ['Social Media', 'Viral', 'Instagram', 'TikTok'],
    image: '/images/social-media.jpg', date: '2026-01-05', readTime: '10 min', views: 2150
  },
  {
    id: 'b4', slug: 'website-speed-conversion',
    title: 'How Website Speed Impacts Conversion Rates (With Data)',
    excerpt: 'A 1-second delay in page load time can reduce conversions by 7%. Here\'s how to fix your site speed.',
    content: `Website speed is directly correlated with conversion rates. Our data shows that every 100ms improvement in load time increases conversions by 1%.\n\nSpeed optimization checklist:\n1. Compress images using WebP format\n2. Implement lazy loading for below-fold content\n3. Use a CDN for global content delivery\n4. Minify CSS, JavaScript, and HTML\n5. Enable browser caching\n6. Reduce server response time (TTFB)\n7. Eliminate render-blocking resources\n8. Use font-display: swap for web fonts`,
    author: 'David Park', authorAvatar: '👨‍💼',
    category: 'Tips', tags: ['Web Dev', 'Speed', 'Conversion', 'Performance'],
    image: '/images/web-dev.jpg', date: '2025-12-28', readTime: '7 min', views: 1560
  },
  {
    id: 'b5', slug: 'content-marketing-roi',
    title: 'Content Marketing ROI: Measuring What Actually Matters',
    excerpt: 'Stop vanity metrics. Learn how to measure the true ROI of your content marketing efforts.',
    content: `Most businesses measure content marketing wrong. Pageviews and social shares don't pay the bills.\n\nThe metrics that matter:\n1. Customer Acquisition Cost (CAC) from content\n2. Lifetime Value (LTV) of content-generated leads\n3. Content-assisted conversion rate\n4. Organic traffic value (equivalent ad spend)\n5. Email list growth rate\n6. Content-to-demo conversion rate\n7. Brand search volume growth\n8. Backlink acquisition rate`,
    author: 'Lisa Rodriguez', authorAvatar: '👩‍🍳',
    category: 'Tips', tags: ['Content', 'ROI', 'Analytics', 'Strategy'],
    image: '/images/content-marketing.jpg', date: '2025-12-20', readTime: '9 min', views: 890
  },
  {
    id: 'b6', slug: 'branding-digital-age',
    title: 'Building a Brand That Stands Out in the Digital Age',
    excerpt: 'In a sea of sameness, how do you create a brand identity that customers actually remember and love?',
    content: `Brand building in 2026 requires more than a logo and color palette. It's about creating emotional connections at every digital touchpoint.\n\nOur brand framework:\n1. Define your brand purpose (beyond profit)\n2. Create a distinctive visual identity system\n3. Develop a consistent brand voice\n4. Map the customer journey\n5. Design memorable unboxing experiences\n6. Build community around shared values\n7. Use storytelling in all communications\n8. Measure brand sentiment and awareness`,
    author: 'Sarah Jenkins', authorAvatar: '👩‍💼',
    category: 'Tips', tags: ['Branding', 'Identity', 'Design', 'Strategy'],
    image: '/images/branding.jpg', date: '2025-12-15', readTime: '11 min', views: 1120
  }
];

const INITIAL_TEAM: TeamMember[] = [
  { id: 't1', name: 'Sarah Jenkins', role: 'CEO & Founder', bio: '12+ years in digital marketing. Former Google strategist. Led 500+ campaigns.', avatar: '👩‍💼', social: { linkedin: '#', twitter: '#' } },
  { id: 't2', name: 'Michael Chen', role: 'Head of PPC', bio: 'Google Ads certified expert. Managed $50M+ in ad spend. 8.5x average ROAS.', avatar: '👨‍💻', social: { linkedin: '#', twitter: '#' } },
  { id: 't3', name: 'Eleanor Vance', role: 'Head of Social Media', bio: 'Built viral campaigns for 100+ brands. 2M+ followers grown for clients.', avatar: '👩‍🔬', social: { linkedin: '#', twitter: '#' } },
  { id: 't4', name: 'David Park', role: 'Head of SEO', bio: 'Technical SEO specialist. Ranked 10,000+ keywords on page 1 of Google.', avatar: '👨‍💼', social: { linkedin: '#', twitter: '#' } },
  { id: 't5', name: 'Lisa Rodriguez', role: 'Head of Content', bio: 'Award-winning content strategist. 1M+ words published. 50+ viral campaigns.', avatar: '👩‍🍳', social: { linkedin: '#', twitter: '#' } },
  { id: 't6', name: 'James Wilson', role: 'Head of Web Development', bio: 'Full-stack developer. Built 200+ high-converting websites and web apps.', avatar: '👨‍🔧', social: { linkedin: '#', twitter: '#' } }
];

const INITIAL_CASE_STUDIES: CaseStudyDetail[] = [
  {
    id: 'cs1', slug: 'urbanfit-ecommerce-growth',
    title: 'How UrbanFit Achieved 5x Revenue Growth with Digital Marketing',
    client: 'UrbanFit Apparel', industry: 'E-Commerce / Fashion', category: 'Google Ads + SEO',
    image: '/images/portfolio-ecommerce.jpg',
    challenge: 'UrbanFit was struggling with low online visibility and high customer acquisition costs. Their e-commerce store was generating only $20K/month with a 2.1x ROAS.',
    solution: 'We implemented a comprehensive digital marketing strategy including Google Shopping campaigns, SEO optimization for 200+ product keywords, retargeting funnels, and email automation sequences.',
    results: [
      { label: 'Monthly Revenue', value: '$100K', before: '$20K' },
      { label: 'ROAS', value: '8.2x', before: '2.1x' },
      { label: 'Organic Traffic', value: '+340%', before: 'Baseline' },
      { label: 'Cost Per Acquisition', value: '-45%', before: '$42' }
    ],
    testimonial: { name: 'Michael Chen', role: 'Marketing Director', text: 'MK ShopZone completely transformed our digital marketing. The results speak for themselves.' },
    tags: ['E-commerce', 'Google Ads', 'SEO', 'Fashion']
  },
  {
    id: 'cs2', slug: 'cloudsync-b2b-leads',
    title: 'CloudSync Generated 450+ Enterprise Leads in 90 Days',
    client: 'CloudSync Technologies', industry: 'B2B SaaS', category: 'LinkedIn + Content Marketing',
    image: '/images/portfolio-saas.jpg',
    challenge: 'CloudSync needed to generate qualified enterprise leads for their cloud infrastructure platform. Traditional outbound was expensive and ineffective.',
    solution: 'We built a LinkedIn thought leadership campaign, created gated whitepapers, launched targeted LinkedIn ads, and implemented an ABM strategy for Fortune 500 companies.',
    results: [
      { label: 'Qualified Leads', value: '450+', before: '35/mo' },
      { label: 'Cost Per Lead', value: '$28', before: '$74' },
      { label: 'Pipeline Value', value: '$2.4M', before: '$200K' },
      { label: 'Demo Bookings', value: '+280%', before: 'Baseline' }
    ],
    testimonial: { name: 'David Park', role: 'VP Sales', text: 'The quality of leads from MK ShopZone\'s campaigns exceeded our expectations. Best B2B marketing investment we\'ve made.' },
    tags: ['B2B', 'SaaS', 'LinkedIn', 'Lead Generation']
  },
  {
    id: 'cs3', slug: 'flavortown-social-media',
    title: 'FlavorTown Restaurants: 200% Foot Traffic Increase via Social Media',
    client: 'FlavorTown Restaurants', industry: 'Food & Beverage', category: 'Social Media + Branding',
    image: '/images/portfolio-restaurant.jpg',
    challenge: 'A 12-location restaurant chain struggling with low social media engagement and declining foot traffic post-pandemic.',
    solution: 'We created a viral social media strategy with food photography, influencer partnerships, local SEO optimization, and geofenced Facebook/Instagram ads.',
    results: [
      { label: 'Social Followers', value: '50K+', before: '2K' },
      { label: 'Foot Traffic', value: '+200%', before: 'Declining' },
      { label: 'Engagement Rate', value: '12.4%', before: '1.2%' },
      { label: 'Review Rating', value: '4.8★', before: '3.9★' }
    ],
    testimonial: { name: 'Lisa Rodriguez', role: 'Owner', text: 'Our restaurants went from empty tables to waitlists. Social media marketing changed everything for us.' },
    tags: ['Restaurant', 'Social Media', 'Local SEO', 'Influencer']
  },
  {
    id: 'cs4', slug: 'medcare-healthcare-seo',
    title: 'MedCare Clinics: #1 Rankings for 85+ Healthcare Keywords',
    client: 'MedCare Clinics', industry: 'Healthcare', category: 'SEO + Website Development',
    image: '/images/seo-service.jpg',
    challenge: 'MedCare needed to improve their online visibility to compete with larger hospital networks and attract more patients.',
    solution: 'We rebuilt their website with medical SEO best practices, optimized for local search, created health content, and implemented schema markup for medical practices.',
    results: [
      { label: '#1 Rankings', value: '85+', before: '3' },
      { label: 'Patient Bookings', value: '+300%', before: 'Stagnant' },
      { label: 'Domain Authority', value: '58', before: '24' },
      { label: 'Local Pack Appearances', value: '92%', before: '15%' }
    ],
    testimonial: { name: 'Dr. Sarah Jenkins', role: 'Medical Director', text: 'Our appointment calendar is now fully booked. The SEO work MK ShopZone did was nothing short of remarkable.' },
    tags: ['Healthcare', 'SEO', 'Local SEO', 'Medical']
  }
];

const INITIAL_TESTIMONIALS: TestimonialDetail[] = [
  { id: 'tm1', name: 'Sarah Jenkins', role: 'CEO', company: 'Apex Tech Solutions', avatar: '👩‍💼', text: 'MK ShopZone completely transformed our online presence with their SEO optimization services. Our organic traffic increased by 340% in just 6 months.', rating: 5, service: 'SEO Optimization', industry: 'Technology' },
  { id: 'tm2', name: 'Michael Chen', role: 'Marketing Director', company: 'UrbanFit Apparel', avatar: '👨‍💻', text: 'The ROI from MK ShopZone\'s Google Ads management is incredible. They took our e-commerce revenue from $20K/month to over $100K/month.', rating: 5, service: 'Google Ads', industry: 'E-Commerce' },
  { id: 'tm3', name: 'Eleanor Vance', role: 'Founder', company: 'BrightGlow Skincare', avatar: '👩‍🔬', text: 'Our social media following grew from 2K to 50K in just 6 months. The engagement rate is consistently above 10%.', rating: 5, service: 'Social Media Marketing', industry: 'Beauty' },
  { id: 'tm4', name: 'David Park', role: 'VP Sales', company: 'CloudSync Technologies', avatar: '👨‍💼', text: 'MK ShopZone generated 450+ qualified enterprise leads for us in just 90 days through LinkedIn and content marketing.', rating: 5, service: 'Content Marketing', industry: 'SaaS' },
  { id: 'tm5', name: 'Lisa Rodriguez', role: 'Owner', company: 'FlavorTown Restaurants', avatar: '👩‍🍳', text: 'Foot traffic across all 12 locations increased by 200% after MK ShopZone took over our social media and local SEO.', rating: 5, service: 'Local SEO & Social', industry: 'Restaurant' },
  { id: 'tm6', name: 'Dr. James Wilson', role: 'Medical Director', company: 'MedCare Clinics', avatar: '👨‍⚕️', text: 'Our appointment bookings increased by 300% after MK ShopZone optimized our healthcare website for Google search.', rating: 5, service: 'Healthcare SEO', industry: 'Healthcare' },
  { id: 'tm7', name: 'Amanda Foster', role: 'CMO', company: 'TechStart Inc.', avatar: '👩‍💻', text: 'MK ShopZone built our entire brand identity from scratch. The logo, website, and marketing collateral are world-class.', rating: 5, service: 'Brand Strategy', industry: 'Startup' },
  { id: 'tm8', name: 'Robert Kim', role: 'Founder', company: 'EduLearn Platform', avatar: '👨‍🏫', text: 'The content marketing strategy MK ShopZone created drives 10,000+ organic visitors to our education platform every month.', rating: 5, service: 'Content Marketing', industry: 'Education' }
];

export const enhancedDB = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.BLOGS)) localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(INITIAL_BLOGS));
    if (!localStorage.getItem(STORAGE_KEYS.TEAM)) localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
    if (!localStorage.getItem(STORAGE_KEYS.CASE_STUDIES)) localStorage.setItem(STORAGE_KEYS.CASE_STUDIES, JSON.stringify(INITIAL_CASE_STUDIES));
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
  },

  getBlogs: (): BlogPost[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOGS) || '[]'),
  getBlogBySlug: (slug: string): BlogPost | undefined => enhancedDB.getBlogs().find(b => b.slug === slug),
  incrementBlogViews: (slug: string) => {
    const blogs = enhancedDB.getBlogs();
    const updated = blogs.map(b => b.slug === slug ? { ...b, views: b.views + 1 } : b);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  },

  getTeam: (): TeamMember[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM) || '[]'),

  getCaseStudies: (): CaseStudyDetail[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CASE_STUDIES) || '[]'),
  getCaseStudyBySlug: (slug: string): CaseStudyDetail | undefined => enhancedDB.getCaseStudies().find(c => c.slug === slug),

  getTestimonials: (): TestimonialDetail[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]'),

  trackPageView: (page: string) => {
    const views: PageView[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || '[]');
    views.push({ page, timestamp: new Date().toISOString(), sessionId: 'session_' + Math.random().toString(36).substr(2, 9) });
    localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, JSON.stringify(views.slice(-1000)));
  },
  getPageViews: (): PageView[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || '[]'),
  getAnalytics: () => {
    const views = enhancedDB.getPageViews();
    const pageCounts: Record<string, number> = {};
    views.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1; });
    return { totalViews: views.length, pageCounts };
  },

  subscribeNewsletter: (email: string) => {
    const subs: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER) || '[]');
    if (!subs.includes(email)) subs.push(email);
    localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(subs));
  },
  getNewsletterSubscribers: (): string[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER) || '[]'),

  addContactSubmission: (data: { name: string; email: string; subject?: string; message: string; business?: string; phone?: string; budget?: string }) => {
    const subs: Array<typeof data & { id: string; date: string }> = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_SUBMISSIONS) || '[]');
    subs.unshift({ ...data, id: 'cs_' + Math.random().toString(36).substr(2, 9), date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.CONTACT_SUBMISSIONS, JSON.stringify(subs));
  },
  getContactSubmissions: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_SUBMISSIONS) || '[]'),
};
