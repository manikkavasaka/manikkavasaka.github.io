import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Search, RefreshCw } from 'lucide-react';
import { SEOReport } from '../../types';

export default function SEOAudit() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SEOReport | null>(null);

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 40) + 55;
      const generateMetric = (title: string): { title: string, score: number, description: string, status: 'good' | 'warning' | 'critical' } => {
        const score = Math.floor(Math.random() * 50) + 50;
        let status: 'good' | 'warning' | 'critical' = 'good';
        if (score < 65) status = 'critical';
        else if (score < 80) status = 'warning';
        const descriptions: Record<string, string[]> = {
          'Page Load Speed': ['Your images are uncompressed and slowing down SEO rankings.', 'Excellent page speed — Google Core Web Vitals passed.', 'Slow TTFB response affecting search rankings.'],
          'Mobile Optimization': ['Viewport issues detected — hurts mobile SEO.', 'Responsive design is optimized for mobile-first indexing.', 'Text is slightly too small on mobile for Google standards.'],
          'Meta Descriptions': ['Missing meta tags on 4 pages — critical for SEO.', 'All meta descriptions optimized for target keywords.', 'Descriptions are over 160 characters — truncating in SERPs.'],
          'SSL Certificate': ['Secure HTTPS connection — Google ranking factor.', 'SSL configured properly.', 'Invalid certificate — security warning for visitors.']
        };
        const descArray = descriptions[title] || ['No issues found.'];
        const description = descArray[status === 'critical' ? 0 : status === 'warning' ? 2 : 1];
        return { title, score, description, status };
      };

      const metrics = [
        generateMetric('Page Load Speed'),
        generateMetric('Mobile Optimization'),
        generateMetric('Meta Descriptions'),
        generateMetric('SSL Certificate')
      ];

      const recommendations = [
        'Compress primary assets and implement WebP format for images to improve Core Web Vitals and SEO rankings.',
        'Improve Largest Contentful Paint (LCP) by deferring off-screen resources — critical Google ranking factor.',
        'Update 4 core landing pages with high-intent keywords in H1 tags for better search engine visibility.'
      ];

      setReport({ score: mockScore, url, metrics, recommendations });
      setLoading(false);
    }, 2000);
  };

  return (
    <section id="seo-audit" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Video-like animated background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_20%_20%,#1e1b4b,transparent)]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] h-2 w-2 bg-indigo-400/30 rounded-full animate-orbit" />
        <div className="absolute top-[60%] right-[25%] h-3 w-3 bg-violet-400/20 rounded-full animate-orbit" style={{ animationDuration: '13s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-base font-semibold text-indigo-400 uppercase tracking-wide">Free SEO Audit Tool</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Check Your Website's SEO Score in 10 Seconds
          </p>
          <p className="mt-4 text-slate-400">
            Get a free SEO analysis of your website. Identify technical SEO errors, missing meta tags, page speed issues, and optimization opportunities to improve your Google rankings.
          </p>
        </div>

        {/* Audit Input Form */}
        <div className="max-w-2xl mx-auto bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-12">
          <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter your website URL (e.g., yoursite.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Run Free SEO Audit'}
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent align-[-0.125em]" />
            <p className="mt-4 text-slate-400 animate-pulse">Analyzing SEO factors: keywords, meta tags, page speed, mobile-friendliness...</p>
          </div>
        )}

        {/* Results */}
        {report && !loading && (
          <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Score header */}
            <div className="p-8 border-b border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Website SEO Audit</span>
                <p className="text-xl font-bold text-white mt-1">{report.url}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block uppercase">SEO Score</span>
                  <span className="text-sm font-medium text-slate-300">Targeting 90+</span>
                </div>
                <div className={`h-20 w-20 rounded-full flex items-center justify-center border-4 font-bold text-2xl animate-zoom-pulse ${
                  report.score >= 80 ? 'border-emerald-500 text-emerald-400' : report.score >= 65 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400'
                }`}>
                  {report.score}
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-700">
              {report.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-700/30">
                  {metric.status === 'good' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : metric.status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-white">{metric.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="p-8 bg-slate-900/60">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">SEO Recommendations</h4>
              <ul className="space-y-3">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="h-5 w-5 flex items-center justify-center rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                    {rec}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <p className="text-xs text-slate-400">Want professional SEO help implementing these changes? Contact our SEO experts today.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
