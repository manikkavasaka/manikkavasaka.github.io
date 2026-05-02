import { useEffect, useState } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gl_cookie_consent');
    if (!saved) setOpen(true);
  }, []);

  const handleConsent = (value: 'accepted' | 'essential') => {
    localStorage.setItem('gl_cookie_consent', value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] md:left-6 md:right-auto md:max-w-md animate-fade-in-up">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/40">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-900">Cookie consent</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  We use cookies for analytics, chat, and marketing performance. You can accept all or keep only essential cookies.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => handleConsent('accepted')} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
                Accept all
              </button>
              <button onClick={() => handleConsent('essential')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                Essential only
              </button>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" /> GDPR-friendly consent banner enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
