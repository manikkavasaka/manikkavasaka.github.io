import { Lead } from '../../types';
import { patchJson, deleteJson } from '../../utils/api';
import { automationDB } from '../../db/automationDB';
import { excelExport } from '../../utils/excelExport';
import { Mail, Phone, Trash2, CheckCircle, RefreshCw, Download, FileSpreadsheet, Send } from 'lucide-react';

interface LeadsProps {
  leads: Lead[];
  onRefresh: () => void;
}

export default function Leads({ leads, onRefresh }: LeadsProps) {
  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    const lead = leads.find(l => l.id === id);
    if (lead) {
      const oldStatus = lead.status;
      try {
        await patchJson(`/api/leads/${id}/status`, { status: newStatus });
        // Trigger status change notification
        automationDB.sendStatusChangeNotification(lead, oldStatus, newStatus);
        onRefresh();
      } catch (err) {
        console.error('Failed to update lead status:', err);
        alert('Failed to update lead status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteJson(`/api/leads/${id}`);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Failed to delete lead');
    }
  };

  const handleExportExcel = () => {
    excelExport.exportLeads(leads);
  };

  const handleResendNotification = (lead: Lead) => {
    automationDB.sendLeadNotifications(lead);
    onRefresh();
  };

  const statusStyles: Record<Lead['status'], string> = {
    New: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Converted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Lost: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  // Stats
  const totalBudget = leads.reduce((sum, l) => sum + (l.budget || 0), 0);
  const convertedCount = leads.filter(l => l.status === 'Converted').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">CRM Leads Manager</h2>
          <p className="text-slate-400 text-sm">Organize and advance incoming proposals through dynamic qualification stages.</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-600/20 transition"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Leads</span>
          <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Converted</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{convertedCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pipeline Value</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Conv. Rate</span>
          <p className="text-2xl font-bold text-violet-400 mt-1">{leads.length > 0 ? ((convertedCount / leads.length) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leads.length === 0 ? (
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900">
            <Download className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No active inquiries present. Leads will appear here after submission.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="border border-slate-800 bg-slate-900 rounded-2xl p-6 flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-700 transition"
            >
              {/* Left Segment: Contact Profile */}
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[lead.status]}`}>
                      {lead.status}
                    </span>
                    <span className="text-[11px] text-slate-500">Received {lead.date}</span>
                  </div>
                  <p className="text-sm font-medium text-indigo-400 mt-1">{lead.company || 'Private Business'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-indigo-400">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {lead.email}
                  </a>
                  {lead.phone && (
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400">
                      <Phone className="h-4 w-4 text-slate-500" />
                      {lead.phone}
                    </a>
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    Interest & Requirement
                  </span>
                  <span className="text-xs font-semibold text-slate-200 block mb-1">
                    Service: {lead.serviceInterested || 'General Digital Marketing'}
                  </span>
                  <p className="text-xs text-slate-400 italic">
                    "{lead.message || 'No direct notes provided.'}"
                  </p>
                </div>
              </div>

              {/* Right Segment: Lead Budget & Stage Ops */}
              <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Estimated Budget</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    ${lead.budget ? lead.budget.toLocaleString() : '0'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Resend notification */}
                  <button
                    onClick={() => handleResendNotification(lead)}
                    className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
                    title="Resend WhatsApp/Email/SMS"
                  >
                    <Send className="h-4 w-4" />
                  </button>

                  {/* Status update selector */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
                    <RefreshCw className="h-3 w-3 text-slate-500 mr-2 flex-shrink-0" />
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className="bg-transparent text-xs text-slate-300 font-semibold border-none focus:outline-none focus:ring-0 cursor-pointer p-0"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  {lead.status !== 'Converted' && (
                    <button
                      onClick={() => handleStatusChange(lead.id, 'Converted')}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      title="Mark Converted"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
