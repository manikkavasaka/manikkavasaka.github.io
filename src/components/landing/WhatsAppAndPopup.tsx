import { useEffect, useState } from 'react';
import { Send, Gift, CheckCircle, Mail } from 'lucide-react';

interface LeadPopupProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onRegistered: () => void; // called when gate is cleared (already registered or just submitted)
}

export default function WhatsAppAndPopup({ onSubmit, onRegistered }: LeadPopupProps) {
  const [showGate, setShowGate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    // Already registered? Skip the gate immediately
    const alreadyRegistered = localStorage.getItem('mks_registered');
    if (alreadyRegistered) {
      onRegistered(); // let App know the gate is cleared
    } else {
      setShowGate(true); // block the website until form is filled
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
    setSubmitted(true);
    localStorage.setItem('mks_registered', 'true');
  };

  const handleEnterSite = () => {
    setShowGate(false);
    onRegistered();
  };

  if (!showGate) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-900/95 to-violet-900/95 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white text-center">
          <div className="mb-3 mx-auto inline-flex rounded-full bg-white/15 p-3">
            <Gift className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black leading-tight">
            போகமுன்னாடி free consultation பண்ணுங்க
          </h2>
          <p className="mt-2 text-sm text-indigo-100">
            <strong>2026 Digital Growth Checklist</strong> free-a download pannunga.
            Unga business-ku MK ShopZone side-la free strategy follow-up-um கிடைக்கும்.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            /* ─── SUCCESS STATE ─── */
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                🎉 Thank you, {formData.name}!
              </h3>
              <p className="text-sm text-slate-500">
                We just sent a welcome email to{' '}
                <span className="font-semibold text-indigo-600">{formData.email}</span>.
                Please check your inbox!
              </p>
              <div className="flex items-center gap-2 justify-center rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 text-left">
                  Check <strong>{formData.email}</strong> for your welcome email &amp; WhatsApp confirmation on <strong>{formData.phone}</strong>
                </p>
              </div>
              <button
                onClick={handleEnterSite}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
              >
                Website-ஐ பார்க்க Enter பண்ணுங்க →
              </button>
            </div>
          ) : (
            /* ─── FORM STATE ─── */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ungal peyar"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="+91..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:opacity-90 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending...' : 'Free consultation unlock pannunga'}
              </button>
              <p className="text-center text-[11px] text-slate-400">
                No spam. Instant download. Free strategy callback.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
