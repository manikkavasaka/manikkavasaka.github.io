import { useState } from 'react';
import { Headset, Send, Sparkles, MessageCircle } from 'lucide-react';

const quickReplies = [
  'Need SEO help',
  'Google Ads pricing',
  'Book a strategy call',
  'Website redesign quote',
];

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-28 right-4 z-[85] w-[92vw] max-w-sm animate-fade-in-up md:right-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  <Headset className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black">Live chat support</h4>
                  <p className="text-xs text-white/70">Usually replies in under 5 minutes</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                👋 Hi! I’m the MK ShopZone assistant. Tell us what you need help with and our team will follow up by WhatsApp or email.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => setMessage(reply)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  onClick={handleSend}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500"
                >
                  <Send className="h-4 w-4" /> Send message
                </button>
                {sent && (
                  <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                    Message queued. The MK ShopZone team will reply shortly.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-24 z-[84] inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-400/30 transition hover:scale-105 md:right-28"
        aria-label="Open live chat"
      >
        {open ? <Sparkles className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
