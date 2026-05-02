import {
  ArrowRight,
  Search,
  Share2,
  Target,
  Code2,
  FileText,
  Mail,
  Users,
  Clapperboard,
  MapPinned,
} from 'lucide-react';
import PageLayout from './PageLayout';
import { useRouter } from '../../router';

const services = [
  {
    icon: Search,
    title: 'SEO Optimization',
    page: 'seo',
    price: 'Starting at $999/mo',
    description: 'Rank higher on Google with technical SEO, keyword strategy, on-page optimization, local SEO, e-commerce SEO, and long-term organic growth.',
    includes: ['On-page SEO', 'Technical SEO', 'Off-page SEO', 'Local SEO'],
    image: '/images/seo-service.jpg',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Share2,
    title: 'Social Media Marketing',
    page: 'social-media',
    price: 'Starting at $899/mo',
    description: 'Build a brand people love with platform-first content, community management, reels, stories, and measurable engagement growth.',
    includes: ['Reels & posts', 'Community management', 'Hashtag strategy', 'Monthly reporting'],
    image: '/images/social-media.jpg',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Target,
    title: 'Google Ads / PPC',
    page: 'ppc',
    price: 'Starting at $1,250/mo',
    description: 'Turn every rupee into measurable revenue using search, shopping, remarketing, YouTube ads, and conversion tracking.',
    includes: ['Search ads', 'Remarketing', 'A/B testing', 'ROAS reporting'],
    image: '/images/google-ads.jpg',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Code2,
    title: 'Website Design & Development',
    page: 'web-dev',
    price: 'Starting at $2,499/project',
    description: 'Fast, beautiful, mobile-first websites built to convert visitors into leads, bookings, and sales.',
    includes: ['Responsive design', 'SEO-ready structure', 'CMS support', '1 year support'],
    image: '/images/web-dev.jpg',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: FileText,
    title: 'Content Marketing',
    page: 'content-marketing',
    price: 'Starting at $799/mo',
    description: 'Content that attracts, engages, and converts across blogs, newsletters, white papers, scripts, and website copy.',
    includes: ['Editorial calendar', 'SEO content', 'Distribution plan', 'Content tracking'],
    image: '/images/content-marketing.jpg',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    page: 'email-marketing',
    price: 'Starting at $699/mo',
    description: 'Reach your audience directly with welcome sequences, drip campaigns, segmented newsletters, and automation.',
    includes: ['Template design', 'Segmentation', 'Automation', 'Deliverability'],
    image: '/images/content-marketing.jpg',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Users,
    title: 'Influencer Marketing',
    page: 'influencer-marketing',
    price: 'Starting at $1,500/campaign',
    description: 'Reach millions through trusted creators with influencer strategy, vetting, brief creation, and campaign reporting.',
    includes: ['Influencer research', 'Brief creation', 'Negotiation', 'Campaign reporting'],
    image: '/images/social-media.jpg',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Clapperboard,
    title: 'Video Marketing',
    page: 'video-marketing',
    price: 'Starting at $1,200/mo',
    description: 'Tell your brand story through reels, explainer videos, ads, demos, subtitles, and video SEO optimization.',
    includes: ['Script writing', 'Editing', 'Subtitles', 'Video SEO'],
    image: '/images/content-marketing.jpg',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: MapPinned,
    title: 'Local SEO / Google Business Profile',
    page: 'local-seo',
    price: 'Starting at $599/mo',
    description: 'Dominate local search and Google Maps with GBP optimization, review strategy, local citations, and map ranking growth.',
    includes: ['GBP optimization', 'Map rankings', 'Citation building', 'Review strategy'],
    image: '/images/seo-service.jpg',
    color: 'bg-lime-50 text-lime-600',
  },
  {
    icon: Users,
    title: 'Brand Strategy',
    page: 'branding',
    price: 'Starting at $1,750/project',
    description: 'Create an unforgettable brand with positioning, logo systems, messaging, audience personas, and brand guidelines.',
    includes: ['Logo system', 'Brand voice', 'Positioning', 'Brand guideline PDF'],
    image: '/images/branding.jpg',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

export default function ServicesPage() {
  const { navigate } = useRouter();

  return (
    <PageLayout
      title="Services"
      description="Explore our complete digital marketing services: SEO, social media, PPC, web development, content, email, influencer, video, local SEO, and brand strategy."
    >
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row"
                >
                  <div className="h-44 overflow-hidden rounded-2xl sm:h-auto sm:w-52 sm:flex-shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${service.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-black text-slate-900">{service.title}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                        {service.price.replace(/\$/g, '₹')}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{service.description}</p>
                    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => navigate(service.page as any)}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-all group-hover:gap-3"
                    >
                      More details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
