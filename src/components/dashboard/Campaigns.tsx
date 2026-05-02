import React, { useState } from 'react';
import { Campaign } from '../../types';
import { mockDB } from '../../db/mockDB';
import { Plus, Play, Pause, Trash2, LineChart, RefreshCw } from 'lucide-react';

interface CampaignsProps {
  campaigns: Campaign[];
  onRefresh: () => void;
}

export default function Campaigns({ campaigns, onRefresh }: CampaignsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Google' as Campaign['platform'],
    budget: 2000,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active' as Campaign['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    mockDB.addCampaign(formData);
    setShowAddModal(false);
    setFormData({
      name: '',
      platform: 'Google',
      budget: 2000,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    onRefresh();
  };

  const handleToggleStatus = (id: string, currentStatus: Campaign['status']) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    mockDB.updateCampaignStatus(id, newStatus);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    mockDB.deleteCampaign(id);
    onRefresh();
  };

  const handleSimulateTraffic = (id: string) => {
    // Generate random clicks, conversions, and spend
    const addedClicks = Math.floor(Math.random() * 50) + 10;
    const addedConversions = Math.max(Math.floor(addedClicks * (Math.random() * 0.1)), 1);
    const addedSpend = Math.floor(addedClicks * (Math.random() * 2 + 1)); // $1-$3 per click

    mockDB.updateCampaignStats(id, addedClicks, addedConversions, addedSpend);
    onRefresh();
  };

  const platformColors: Record<Campaign['platform'], string> = {
    Google: 'bg-red-500/10 text-red-400 border-red-500/20',
    Facebook: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    LinkedIn: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    TikTok: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Marketing Campaigns</h2>
          <p className="text-slate-400 text-sm">Deploy and iterate across paid acquisition avenues.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 self-start transition"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Spend</th>
                <th className="px-6 py-4">Conversions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No active campaigns. Deploy your first channel!
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => {
                  return (
                    <tr key={camp.id} className="hover:bg-slate-800/20">
                      <td className="px-6 py-4 font-semibold text-white">{camp.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${platformColors[camp.platform]}`}>
                          {camp.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${
                          camp.status === 'Active' ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          <span className={`h-2 w-2 rounded-full ${camp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">${camp.budget.toLocaleString()}</td>
                      <td className="px-6 py-4">${camp.spent.toLocaleString()}</td>
                      <td className="px-6 py-4">{camp.conversions}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        {camp.status === 'Active' && (
                          <button
                            onClick={() => handleSimulateTraffic(camp.id)}
                            title="Simulate Ad Clicks"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(camp.id, camp.status)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title={camp.status === 'Active' ? 'Pause' : 'Activate'}
                        >
                          {camp.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-emerald-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(camp.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md text-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="h-5 w-5 text-indigo-400" />
                Launch Campaign
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 TikTok Retargeting"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Advertising Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as Campaign['platform'] })}
                  className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Google">Google Search</option>
                  <option value="Facebook">Facebook Ads</option>
                  <option value="Instagram">Instagram Reach</option>
                  <option value="LinkedIn">LinkedIn B2B</option>
                  <option value="TikTok">TikTok Feed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Budget Target ($)</label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                  className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-md"
                >
                  Confirm Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
