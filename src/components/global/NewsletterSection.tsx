import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { enhancedDB } from '../../db/enhancedDB';
import { postJson } from '../../utils/api';

interface NewsletterSectionProps {
  compact?: boolean;
}

export default function NewsletterSection({ compact = false }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await postJson('/api/subscribers', { email });
      enhancedDB.subscribeNewsletter(email);
      setSubscribed(true);
      setStatus('Welcome email sent successfully.');
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Newsletter signup failed';
      setStatus(message);
    }
  };

  return (
    <section className={compact ? '' : 'py-20 bg-slate-50'}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl ${compact ? 'p-6' : 'p-8 md:p-12'}`}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                <Mail className="h-3.5 w-3.5" /> Newsletter Signup
              </span>
              <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Get weekly SEO, ads, and growth tips in your inbox.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                Join founders and marketers getting our best playbooks on SEO, Google Ads, social media, CRO, and lead generation from MK ShopZone.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['SEO', 'Ads', 'Social Media', 'Tips'].map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              {subscribed ? (
                <div className="flex min-h-[140px] flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-slate-900">Subscribed successfully!</h4>
                  <p className="mt-1 text-sm text-slate-500">Your next MK ShopZone newsletter is on the way.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Business Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300"
                  >
                    Subscribe Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[11px] text-slate-400">No spam. Unsubscribe anytime. Weekly only.</p>
                  {status && <p className="text-xs font-semibold text-slate-500">{status}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
