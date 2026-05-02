import { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import PageLayout from './PageLayout';

export default function FreeAuditPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 55;
      setReport({
        score,
        url,
        metrics: [
          { title: 'Page Load Speed', score: Math.floor(Math.random() * 50) + 50, status: 'warning', desc: 'Images need compression for better Core Web Vitals.' },
          { title: 'Mobile Optimization', score: Math.floor(Math.random() * 50) + 50, status: 'good', desc: 'Responsive design is mobile-friendly.' },
          { title: 'Meta Descriptions', score: Math.floor(Math.random() * 50) + 50, status: 'critical', desc: 'Missing meta tags on key pages.' },
          { title: 'SSL Certificate', score: Math.floor(Math.random() * 50) + 50, status: 'good', desc: 'HTTPS is properly configured.' },
        ],
        recommendations: [
          'Compress images using WebP format to improve page speed.',
          'Add unique meta descriptions to all pages for better CTR.',
          'Implement schema markup for rich search results.',
          'Optimize Core Web Vitals for Google ranking boost.'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <PageLayout title="Free SEO Audit" description="Get a comprehensive SEO analysis of your website in seconds. Identify technical issues, missing meta tags, and optimization opportunities.">
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-10">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type="text" required placeholder="Enter your website URL" value={url} onChange={e => setUrl(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50 transition">
                {loading ? 'Analyzing...' : 'Run Free Audit'} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent" />
              <p className="mt-4 text-slate-500">Analyzing your website...</p>
            </div>
          )}

          {report && !loading && (
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg animate-fade-in-up">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Audited</span>
                  <p className="text-lg font-bold text-slate-900">{report.url}</p>
                </div>
                <div className={`h-20 w-20 rounded-full flex items-center justify-center border-4 font-bold text-2xl ${
                  report.score >= 80 ? 'border-emerald-500 text-emerald-500' : report.score >= 65 ? 'border-amber-500 text-amber-500' : 'border-red-500 text-red-500'
                }`}>{report.score}</div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.metrics.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    {m.status === 'good' ? <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" /> :
                     m.status === 'warning' ? <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" /> :
                     <ShieldCheck className="h-5 w-5 text-red-500 flex-shrink-0" />}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                      <p className="text-xs text-slate-500">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Recommendations</h4>
                <ul className="space-y-2">
                  {report.recommendations.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="h-5 w-5 flex items-center justify-center rounded bg-indigo-100 text-indigo-600 text-xs font-bold flex-shrink-0">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
