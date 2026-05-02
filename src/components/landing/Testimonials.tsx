import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO',
    company: 'Apex Tech Solutions',
    avatar: '👩‍💼',
    text: 'MK ShopZone completely transformed our online presence with their SEO optimization services. Our organic traffic increased by 340% in just 6 months, and our cost per lead dropped by 62%. They are the best digital marketing agency we\'ve ever worked with.',
    rating: 5,
    service: 'SEO Optimization'
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'UrbanFit Apparel',
    avatar: '👨‍💻',
    text: 'The ROI we\'ve seen from MK ShopZone\'s Google Ads management is incredible. They took our e-commerce revenue from $20K/month to over $100K/month. Their data-driven PPC approach sets them apart from every other digital advertising agency.',
    rating: 5,
    service: 'Google Ads Management'
  },
  {
    name: 'Eleanor Vance',
    role: 'Founder',
    company: 'BrightGlow Skincare',
    avatar: '👩‍🔬',
    text: 'Our social media following grew from 2K to 50K in just 6 months with MK ShopZone\'s social media marketing strategy. The engagement rate is consistently above 10%, and our influencer campaigns generate real sales. Best SMM agency!',
    rating: 5,
    service: 'Social Media Marketing'
  },
  {
    name: 'David Park',
    role: 'VP Sales',
    company: 'CloudSync Technologies',
    avatar: '👨‍💼',
    text: 'MK ShopZone generated 450+ qualified enterprise leads for us in just 90 days through LinkedIn marketing and content marketing strategy. The pipeline value exceeded $2.4M. Absolutely phenomenal B2B digital marketing results.',
    rating: 5,
    service: 'Content Marketing & LinkedIn'
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Owner',
    company: 'FlavorTown Restaurants',
    avatar: '👩‍🍳',
    text: 'Foot traffic across all 12 locations increased by 200% after MK ShopZone took over our social media marketing and local SEO. Their Google My Business optimization put us on the first page for every major food keyword in our city.',
    rating: 5,
    service: 'Local SEO & Social Media'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Client Testimonials & Reviews</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Why 500+ Businesses{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Trust MK ShopZone</span>
          </h2>
          <p className="mt-6 text-lg text-slate-500">
            See what CEOs, marketing directors, and business owners say about our SEO services, Google Ads management, social media marketing, and digital marketing strategies.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />
            <Quote className="absolute top-8 right-8 h-12 w-12 text-indigo-100" />

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
                {testimonials[currentIndex].service}
              </span>

              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400 animate-wave" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>

              <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl animate-zoom-pulse">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-slate-500">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={prev} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition text-slate-600 hover:text-indigo-600">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={next} className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition text-white shadow-md">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2.5 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`} />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mx-auto">
            <span className="font-semibold text-slate-500">Trusted by businesses for:</span> SEO agency reviews • Google Ads management testimonials • Social media marketing results • Content marketing case studies • Website development portfolio • Digital marketing ROI • Best marketing agency near me • Affordable SEO services • Professional PPC management • E-commerce marketing experts • B2B lead generation agency • Local SEO company reviews • Instagram marketing agency • Facebook ads management reviews
          </p>
        </div>
      </div>
    </section>
  );
}
