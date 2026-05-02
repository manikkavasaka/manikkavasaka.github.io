import { useEffect, useState } from 'react';
import { X, Send, Download, Gift } from 'lucide-react';

interface LeadPopupProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export default function WhatsAppAndPopup({ onSubmit }: LeadPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const stored = sessionStorage.getItem('gl_exit_popup_dismissed');
    if (stored) {
      setDismissed(true);
      return;
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 8) setShowPopup(true);
    };

    const fallbackTimer = window.setTimeout(() => setShowPopup(true), 12000);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    setDismissed(true);
    sessionStorage.setItem('gl_exit_popup_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    onSubmit(formData);
    setSubmitted(true);
  };

  return (
    <>
      {!dismissed && showPopup && (
        <div className="fixed inset-0 z-[92] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-bounce-in">
            <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
              <button onClick={closePopup} className="absolute right-4 top-4 rounded-full bg-white/15 p-2 hover:bg-white/25">
                <X className="h-4 w-4" />
              </button>
              <div className="mb-3 inline-flex rounded-full bg-white/10 p-3">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black">போகமுன்னாடி free consultation பண்ணுங்க</h3>
              <p className="mt-2 text-sm text-indigo-100">
                <strong>2026 Digital Growth Checklist</strong> free-a download pannunga. Unga business-ku MK ShopZone side-la free strategy follow-up-um கிடைக்கும்.
              </p>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Download className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Download ready ✅</h4>
                  <p className="text-sm text-slate-500">Thanks! Unga lead magnet ready. Namma MK ShopZone team WhatsApp / email-la follow up pannuvanga.</p>
                  <a
                    href="/resources/mk-shopzone-growth-checklist.txt"
                    download
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" /> Download checklist
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" placeholder="Ungal peyar" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone / WhatsApp *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" placeholder="+91..." />
                  </div>
                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300">
                    <Send className="h-4 w-4" /> Free consultation unlock pannunga
                  </button>
                  <p className="text-center text-[11px] text-slate-400">No spam. Instant download. Free strategy callback.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
