import { ArrowLeft, TrendingUp } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';
import { useRouter } from '../../router';

export default function CaseStudyPage() {
  const { params, navigate } = useRouter();
  const slug = params.slug;
  const study = slug ? enhancedDB.getCaseStudyBySlug(slug) : undefined;

  if (!study) {
    return (
      <PageLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Case study not found</h2>
          <button onClick={() => navigate('portfolio')} className="mt-4 text-indigo-600 font-semibold">Back to Portfolio</button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={study.title}>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('portfolio')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </button>

          {/* Hero Image */}
          <div className="relative h-72 md:h-[400px] rounded-2xl overflow-hidden mb-10">
            <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-indigo-600 px-3 py-1 rounded-full">{study.category}</span>
              <h1 className="text-2xl md:text-4xl font-black text-white mt-3">{study.title}</h1>
              <p className="text-white/80 mt-1">{study.client} — {study.industry}</p>
            </div>
          </div>

          {/* Results Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {study.results.map((r, i) => (
              <div key={i} className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 text-center">
                <TrendingUp className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{r.value}</p>
                {r.before && <p className="text-xs text-slate-400 line-through">{r.before}</p>}
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">{r.label}</p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">The Challenge</h2>
                <p className="text-slate-500 leading-relaxed">{study.challenge}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Our Solution</h2>
                <p className="text-slate-500 leading-relaxed">{study.solution}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Client Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Client</span><span className="font-semibold text-slate-900">{study.client}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Industry</span><span className="font-semibold text-slate-900">{study.industry}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Services</span><span className="font-semibold text-slate-900">{study.category}</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Client Testimonial</h3>
                <p className="text-sm italic leading-relaxed mb-4">"{study.testimonial.text}"</p>
                <p className="text-xs font-semibold">— {study.testimonial.name}, {study.testimonial.role}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
