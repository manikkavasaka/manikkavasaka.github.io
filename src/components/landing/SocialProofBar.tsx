import { ShieldCheck, BadgeCheck, TrendingUp, Radio, Building2 } from 'lucide-react';
import { enhancedDB } from '../../db/enhancedDB';

export default function SocialProofBar() {
  const analytics = enhancedDB.getAnalytics();
  const liveProjects = 42 + (analytics.totalViews % 17);
  const logos = ['Shopify', 'HubSpot', 'Notion', 'Airbnb', 'Slack', 'Stripe'];

  return (
    <section className="border-y border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 lg:text-left">
              Trusted by growth-focused brands
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo) => (
                <div key={logo} className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-500 shadow-sm">
                  {logo}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: TrendingUp, label: 'Avg. ROAS', value: '8.2x', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { icon: Building2, label: 'Clients', value: '500+', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
              { icon: Radio, label: 'Live Projects', value: `${liveProjects}`, color: 'text-violet-600 bg-violet-50 border-violet-100' },
              { icon: ShieldCheck, label: 'Partner Badges', value: '12', color: 'text-amber-600 bg-amber-50 border-amber-100' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`rounded-2xl border p-4 text-center ${item.color}`}>
                  <Icon className="mx-auto h-5 w-5" />
                  <p className="mt-2 text-xl font-black">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-5 lg:justify-start">
          {[
            'Google Partner',
            'Meta Business Partner',
            'Clutch Top Agency',
            'Forbes Mentioned',
            'HubSpot Certified',
          ].map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
              <BadgeCheck className="h-3.5 w-3.5 text-indigo-500" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
