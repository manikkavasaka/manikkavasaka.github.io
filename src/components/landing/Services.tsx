import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (name: string) => void;
}

const servicesData = [
  {
    image: '/images/seo-service.jpg',
    title: 'SEO Optimization',
    subtitle: 'Search Engine Optimization',
    description: 'Dominate Google search rankings with proven SEO strategies. We optimize your website for high-intent keywords, build quality backlinks, and drive organic traffic that converts.',
    features: ['Keyword Research & Strategy', 'On-Page & Technical SEO', 'Link Building & Authority', 'Local SEO & Google Maps'],
    color: 'from-blue-500 to-cyan-500',
    text: 'text-blue-600'
  },
  {
    image: '/images/social-media.jpg',
    title: 'Social Media Marketing',
    subtitle: 'SMM & Paid Social',
    description: 'Build a powerful social presence across Facebook, Instagram, LinkedIn, TikTok, and YouTube with viral content strategies that engage and convert.',
    features: ['Content Strategy & Creation', 'Community Management', 'Paid Social Campaigns', 'Influencer Partnerships'],
    color: 'from-pink-500 to-rose-500',
    text: 'text-pink-600'
  },
  {
    image: '/images/google-ads.jpg',
    title: 'Google Ads (PPC)',
    subtitle: 'Pay-Per-Click Advertising',
    description: 'Maximize ROI with precision-targeted Google Ads campaigns. We manage every dollar to deliver measurable results and lower your cost per acquisition.',
    features: ['Search & Display Ads', 'Shopping Campaigns', 'Remarketing & Retargeting', 'Conversion Tracking'],
    color: 'from-amber-500 to-orange-500',
    text: 'text-amber-600'
  },
  {
    image: '/images/web-dev.jpg',
    title: 'Website Development',
    subtitle: 'Web Design & Development',
    description: 'Custom, high-performance websites built for conversions. From landing pages to full e-commerce platforms, we create responsive digital experiences that sell.',
    features: ['Custom Web Design', 'E-Commerce Solutions', 'Landing Page Optimization', 'CMS Development'],
    color: 'from-violet-500 to-purple-500',
    text: 'text-violet-600'
  },
  {
    image: '/images/content-marketing.jpg',
    title: 'Content Marketing',
    subtitle: 'Content Creation & Strategy',
    description: 'Compelling content that attracts, engages, and converts. Blog posts, videos, infographics, and whitepapers that position you as an industry leader.',
    features: ['Blog & Article Writing', 'Video Production', 'Email Newsletters', 'Whitepapers & E-books'],
    color: 'from-emerald-500 to-teal-500',
    text: 'text-emerald-600'
  },
  {
    image: '/images/branding.jpg',
    title: 'Brand Strategy',
    subtitle: 'Branding & Identity Design',
    description: 'Build a memorable brand identity that resonates. From logo design to complete brand guidelines, we make your business unforgettable in the digital landscape.',
    features: ['Logo & Identity Design', 'Brand Guidelines', 'Visual Storytelling', 'Brand Positioning'],
    color: 'from-indigo-500 to-blue-500',
    text: 'text-indigo-600'
  }
];

export default function Services({ onSelectService }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Our Services</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Full-Service Digital Marketing{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Solutions</span>
          </h2>
          <p className="mt-6 text-lg text-slate-500">
            From SEO and Google Ads to social media and web development — we offer end-to-end digital marketing services tailored to your business goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => (
            <div
              key={idx}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectService(service.title)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-40`} />
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {service.subtitle}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.description}</p>

                <ul className="space-y-1.5 mb-5">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.color} flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`inline-flex items-center gap-1.5 text-sm font-bold ${service.text} group-hover:gap-2.5 transition-all`}>
                  Learn More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
