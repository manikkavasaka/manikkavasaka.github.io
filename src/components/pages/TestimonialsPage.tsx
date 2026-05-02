import { Star } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';

export default function TestimonialsPage() {
  const testimonials = enhancedDB.getTestimonials();

  return (
    <PageLayout title="Client Testimonials" description="See what 500+ business owners and marketing directors say about working with MK ShopZone.">
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full">{t.service}</span>
                  <span className="text-[10px] text-slate-400">{t.industry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
