import { CreditCard, FileText, CheckCircle2, Clock3, XCircle, Mail, Phone } from 'lucide-react';
import { adminBackend } from '../../db/adminBackend';
import { enhancedDB } from '../../db/enhancedDB';

interface PaymentsHubProps {
  onRefresh: () => void;
}

export default function PaymentsHub({ onRefresh }: PaymentsHubProps) {
  const payments = adminBackend.getPayments();
  const subscribers = enhancedDB.getNewsletterSubscribers();
  const contacts = enhancedDB.getContactSubmissions();

  const statusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'pending': return <Clock3 className="h-4 w-4 text-amber-400" />;
      default: return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Payments, Subscribers & CRM</h2>
        <p className="text-slate-400 text-sm">Live data pulled from the current app database, plus payment tracking placeholders for Razorpay integration.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Payments</p>
          <p className="mt-2 text-3xl font-black text-white">{payments.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Newsletter Subscribers</p>
          <p className="mt-2 text-3xl font-black text-white">{subscribers.length}</p>
          <p className="mt-2 text-[11px] text-emerald-400">Connected to signup form</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Requests</p>
          <p className="mt-2 text-3xl font-black text-white">{contacts.length}</p>
          <p className="mt-2 text-[11px] text-emerald-400">Connected to contact form storage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white">Payment gateway tracking</h3>
          </div>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
            Razorpay live API is <strong>not connected</strong> inside this static frontend build. Current entries are placeholder payment records for UI testing only.
          </div>
          <div className="mt-5 space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">{payment.package_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{payment.gateway_ref} • {new Date(payment.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">₹{payment.amount.toLocaleString()}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      {statusIcon(payment.status)} {payment.status}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['pending', 'paid', 'failed', 'refunded'].map((status) => (
                    <button key={status} onClick={() => { adminBackend.updatePaymentStatus(payment.id, status as any); onRefresh(); }} className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-slate-800">
                      Mark {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-black text-white">Newsletter list</h3>
            </div>
            <div className="mt-5 space-y-2">
              {subscribers.length === 0 ? <p className="text-sm text-slate-500">No subscribers yet. The newsletter form is connected and new signups will appear here.</p> : subscribers.map((email) => (
                <div key={email} className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300">{email}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-black text-white">Latest contact submissions</h3>
            </div>
            <div className="mt-5 space-y-3">
              {contacts.length === 0 ? <p className="text-sm text-slate-500">No contact submissions yet. The website contact form is now connected to stored submissions.</p> : contacts.slice(0, 6).map((item: any) => (
                <div key={item.id} className="rounded-xl bg-slate-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email} {item.business ? `• ${item.business}` : ''}</p>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{item.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-black text-white">Current live config</h3>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <p>Admin email: <span className="font-semibold text-slate-200">mkshopzone2@gmail.com</span></p>
              <p>Admin WhatsApp: <span className="font-semibold text-slate-200">7200059453</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
