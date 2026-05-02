import { ExternalLink } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';
import { useRouter } from '../../router';

export default function PortfolioPage() {
  const { navigate } = useRouter();
  const caseStudies = enhancedDB.getCaseStudies();

  return (
    <PageLayout title="Our Portfolio" description="Real case studies showing how our digital marketing strategies helped businesses achieve extraordinary growth.">
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <div key={study.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-indigo-600 px-3 py-1.5 rounded-full">{study.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{study.title}</h3>
                    <p className="text-sm text-white/80">{study.client} — {study.industry}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-4">{study.challenge}</p>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {study.results.map((r, i) => (
                      <div key={i} className="text-center p-2 bg-slate-50 rounded-lg">
                        <p className="text-lg font-black text-slate-900">{r.value}</p>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase">{r.label}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('case-study', { slug: study.slug })}
                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:gap-3 transition-all">
                    Read Full Case Study <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
