import { ExternalLink } from 'lucide-react';

const caseStudies = [
  {
    title: 'E-Commerce Revenue 5x Growth',
    client: 'UrbanFit Apparel',
    category: 'Google Ads + SEO',
    description: 'Transformed UrbanFit\'s digital presence from $20K/mo to $100K/mo through integrated PPC and organic search strategy.',
    metrics: [
      { label: 'Revenue', value: '5x' },
      { label: 'ROAS', value: '8.2x' },
      { label: 'Traffic', value: '+340%' }
    ],
    gradient: 'from-indigo-500 to-blue-500',
    image: '/images/portfolio-ecommerce.jpg'
  },
  {
    title: 'B2B SaaS Lead Generation',
    client: 'CloudSync Technologies',
    category: 'LinkedIn + Content',
    description: 'Generated 450+ qualified enterprise leads in 90 days through targeted LinkedIn campaigns and thought leadership content.',
    metrics: [
      { label: 'Leads', value: '450+' },
      { label: 'CPL', value: '-62%' },
      { label: 'Pipeline', value: '$2.4M' }
    ],
    gradient: 'from-violet-500 to-purple-500',
    image: '/images/portfolio-saas.jpg'
  },
  {
    title: 'Restaurant Social Media Success',
    client: 'FlavorTown Restaurants',
    category: 'Social Media + Branding',
    description: 'Built viral social presence across 12 locations, driving 200% increase in foot traffic and 50K+ new followers.',
    metrics: [
      { label: 'Followers', value: '50K+' },
      { label: 'Traffic', value: '+200%' },
      { label: 'Engagement', value: '12.4%' }
    ],
    gradient: 'from-pink-500 to-rose-500',
    image: '/images/portfolio-restaurant.jpg'
  },
  {
    title: 'Healthcare SEO Domination',
    client: 'MedCare Clinics',
    category: 'SEO + Web Dev',
    description: 'Achieved #1 rankings for 85+ local healthcare keywords, resulting in 300% increase in patient bookings.',
    metrics: [
      { label: '#1 Ranks', value: '85+' },
      { label: 'Bookings', value: '+300%' },
      { label: 'DA Score', value: '58' }
    ],
    gradient: 'from-emerald-500 to-teal-500',
    image: '/images/seo-service.jpg'
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Our Work</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Case Studies That{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Prove Results</span>
          </h2>
          <p className="mt-6 text-lg text-slate-500">
            Real businesses. Real results. See how our strategies helped clients achieve extraordinary growth.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${study.gradient} opacity-50`} />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {study.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{study.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{study.client}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{study.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {study.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="text-center p-3 bg-slate-50 rounded-xl">
                      <p className="text-xl font-black text-slate-900">{metric.value}</p>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">{metric.label}</span>
                    </div>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:gap-3 transition-all">
                  View Case Study <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
