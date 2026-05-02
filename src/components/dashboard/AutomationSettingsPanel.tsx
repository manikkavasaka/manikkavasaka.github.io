import { useState } from 'react';
import { Settings, MessageCircle, Mail, MessageSquare, Save, Bell, FileText } from 'lucide-react';
import { automationDB, AutomationSettings } from '../../db/automationDB';

interface AutomationSettingsProps {
  onRefresh: () => void;
}

export default function AutomationSettingsPanel({ onRefresh }: AutomationSettingsProps) {
  const [settings, setSettings] = useState<AutomationSettings>(automationDB.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    automationDB.saveSettings(settings);
    setSaved(true);
    onRefresh();
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings className="h-6 w-6 text-indigo-400" />
            Automation Settings
          </h2>
          <p className="text-slate-400 text-sm mt-1">Configure WhatsApp, Email & SMS notifications for lead management.</p>
        </div>
        {saved && (
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full animate-pulse">
            ✓ Settings Saved!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">WhatsApp</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.whatsappEnabled} onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin WhatsApp Number</label>
            <input type="tel" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl" placeholder="+91 98765 43210" />
          </div>
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/30 rounded-xl">
            <p className="text-[11px] text-emerald-400/80">💬 Sends welcome message to lead + internal alert to admin on new lead submission.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white">Email</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.emailEnabled} onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email Address</label>
            <input type="email" value={settings.emailRecipient} onChange={(e) => setSettings({ ...settings, emailRecipient: e.target.value })} className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl" placeholder="mkshopzone2@gmail.com" />
          </div>
          <div className="p-3 bg-blue-950/30 border border-blue-800/30 rounded-xl">
            <p className="text-[11px] text-blue-400/80">📧 Sends detailed lead report to admin + welcome email to the lead automatically.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white">SMS</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.smsEnabled} onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin SMS Number</label>
            <input type="tel" value={settings.smsNumber} onChange={(e) => setSettings({ ...settings, smsNumber: e.target.value })} className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl" placeholder="+91 98765 43210" />
          </div>
          <div className="p-3 bg-amber-950/30 border border-amber-800/30 rounded-xl">
            <p className="text-[11px] text-amber-400/80">📱 Sends instant SMS alert to admin when a new lead is captured.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-bold text-white">Notification Triggers</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-sm text-slate-300 font-medium">Notify on New Lead</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.notifyOnNewLead} onChange={(e) => setSettings({ ...settings, notifyOnNewLead: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-violet-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-sm text-slate-300 font-medium">Notify on Status Change</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.notifyOnStatusChange} onChange={(e) => setSettings({ ...settings, notifyOnStatusChange: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-violet-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-5 w-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Message Templates</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Welcome Message</label>
            <textarea rows={4} value={settings.welcomeMessageTemplate} onChange={(e) => setSettings({ ...settings, welcomeMessageTemplate: e.target.value })} className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl font-mono" />
            <p className="text-[10px] text-slate-500 mt-1">Variables: {'{name}'}, {'{service}'}, {'{company}'}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Internal Alert</label>
            <textarea rows={4} value={settings.internalAlertTemplate} onChange={(e) => setSettings({ ...settings, internalAlertTemplate: e.target.value })} className="block w-full px-4 py-3 border border-slate-800 bg-slate-950 text-sm text-white rounded-xl font-mono" />
            <p className="text-[10px] text-slate-500 mt-1">Variables: {'{name}'}, {'{company}'}, {'{service}'}, {'{budget}'}, {'{email}'}, {'{phone}'}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/40 hover:scale-[1.02] transition-all">
          <Save className="h-4 w-4" /> Save Automation Settings
        </button>
      </div>
    </div>
  );
}
