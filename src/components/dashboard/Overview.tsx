import { Lead, Campaign } from '../../types';
import { ArrowUpRight, CheckCircle, TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';

interface OverviewProps {
  leads: Lead[];
  campaigns: Campaign[];
}

export default function Overview({ leads, campaigns }: OverviewProps) {
  const campaignsWithData = campaigns.filter(
    (camp) => camp.clicks > 0 || camp.spent > 0 || camp.impressions > 0 || camp.conversions > 0
  );

  const ctrEligibleCampaigns = campaigns.filter((camp) => camp.impressions > 0 && camp.clicks > 0);

  const totalAdSpend = campaignsWithData.reduce((sum, camp) => sum + camp.spent, 0);
  const totalConversions = campaignsWithData.reduce((sum, camp) => sum + camp.conversions, 0);
  const totalClicks = campaignsWithData.reduce((sum, camp) => sum + camp.clicks, 0);
  const totalImpressions = ctrEligibleCampaigns.reduce((sum, camp) => sum + camp.impressions, 0);

  const avgCPA = totalConversions > 0 ? (totalAdSpend / totalConversions).toFixed(2) : '0.00';
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const funnel = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
    lost: leads.filter((l) => l.status === 'Lost').length,
  };

  const kpis = [
    {
      label: 'Overall Budget Spent',
      value: `₹${totalAdSpend.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/40 border-indigo-800/40'
    },
    {
      label: 'CRM Leads Captured',
      value: leads.length.toString(),
      icon: Users,
      color: 'text-violet-400',
      bg: 'bg-violet-950/40 border-violet-800/40'
    },
    {
      label: 'PPC Ad Conversions',
      value: totalConversions.toLocaleString(),
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/40'
    },
    {
      label: 'Avg. Acquisition Cost',
      value: `₹${avgCPA}`,
      icon: TrendingUp,
      color: 'text-pink-400',
      bg: 'bg-pink-950/40 border-pink-800/40'
    }
  ];

  const maxClicks = Math.max(...campaignsWithData.map((c) => c.clicks), 1);
  const noDataCampaigns = campaigns.filter((camp) => !(camp.clicks > 0 || camp.spent > 0 || camp.impressions > 0 || camp.conversions > 0));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Database Overview</h2>
        <p className="text-slate-400 text-sm">Real-time breakdown of internal lead acquisition and marketing KPIs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`border rounded-2xl p-6 flex items-center justify-between shadow-sm ${kpi.bg}`}>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{kpi.label}</span>
                <span className="text-2xl font-bold text-white mt-1 block">{kpi.value}</span>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-700/50 ${kpi.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Campaign Comparison</h3>
              <p className="text-slate-400 text-xs">Clicks vs. conversions from campaigns with actual delivery data.</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
              Live CTR: {avgCTR}% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>

          <div className="space-y-4 mt-6">
            {campaignsWithData.map((camp) => {
              const clickWidth = Math.max((camp.clicks / maxClicks) * 100, 5);
              return (
                <div key={camp.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{camp.name} ({camp.platform})</span>
                    <span className="text-slate-400">{camp.clicks} Clicks</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden">
                    <div style={{ width: `${clickWidth}%` }} className="bg-indigo-600 h-full rounded-l-full transition-all duration-500" />
                    <div className="bg-indigo-400/40 h-full rounded-r-full" style={{ width: `${Math.min(camp.conversions, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Spent: ₹{camp.spent.toLocaleString()}</span>
                    <span>Conversions: {camp.conversions}</span>
                  </div>
                </div>
              );
            })}

            {noDataCampaigns.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">No data yet</p>
                {noDataCampaigns.map((camp) => (
                  <div key={camp.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm">
                    <span className="text-slate-300">{camp.name} ({camp.platform})</span>
                    <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" /> No data yet
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white mb-2">Lead Qualification Funnel</h3>
              <p className="text-slate-400 text-xs">All lead stages pulled from the same CRM data source.</p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300">
              Total Leads: {funnel.total}
            </span>
          </div>

          <div className="space-y-4 my-6">
            <div className="w-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-xl p-3 text-sm font-semibold flex items-center justify-between">
              <span>1. New Leads</span>
              <span className="bg-indigo-900/80 px-2.5 py-0.5 rounded-md text-xs">{funnel.new}</span>
            </div>
            <div className="w-full bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-xl p-3 text-sm font-semibold flex items-center justify-between">
              <span>2. Contacted</span>
              <span className="bg-violet-950/80 px-2.5 py-0.5 rounded-md text-xs">{funnel.contacted}</span>
            </div>
            <div className="w-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-sm font-semibold flex items-center justify-between">
              <span>3. Converted</span>
              <span className="bg-emerald-950/80 px-2.5 py-0.5 rounded-md text-xs">{funnel.converted}</span>
            </div>
            <div className="w-full bg-slate-700/40 border border-slate-600/50 text-slate-300 rounded-xl p-3 text-sm font-semibold flex items-center justify-between">
              <span>4. Lost</span>
              <span className="bg-slate-950 px-2.5 py-0.5 rounded-md text-xs">{funnel.lost}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Funnel total now matches CRM lead count by using the same lead status source everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
