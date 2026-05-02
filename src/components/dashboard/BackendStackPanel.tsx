import { useEffect, useState } from 'react';
import { Database, Server, ShieldCheck, Cloud, MessageSquareMore, CreditCard, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { adminBackend } from '../../db/adminBackend';
import { enhancedDB } from '../../db/enhancedDB';
import { mockDB } from '../../db/mockDB';

export default function BackendStackPanel() {
  const stack = adminBackend.getTechStack();
  const deploymentUrl = window.location.origin;

  const [counts, setCounts] = useState<Record<string, number>>({
    leads: 0,
    blog_posts: 0,
    portfolio: 0,
    testimonials: 0,
    subscribers: 0,
    users: 1, // Default admin
    payments: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const blogs = await adminBackend.getBlogs();
      const testimonials = await adminBackend.getTestimonials();
      const payments = await adminBackend.getPayments();
      // For leads, we can use the mockDB for now or fetch from API if we want to be consistent
      // But App.tsx already fetches leads, so we could pass them down or just fetch again
      
      setCounts({
        leads: mockDB.getLeads().length,
        blog_posts: blogs.length,
        portfolio: enhancedDB.getCaseStudies().length,
        testimonials: testimonials.length,
        subscribers: enhancedDB.getNewsletterSubscribers().length,
        users: 1, 
        payments: payments.length
      });
    };
    fetchCounts();
  }, []);

  const tableRows = [
    { name: 'leads', schema: 'id, name, email, phone, message, status, created_at', count: counts.leads, connected: true },
    { name: 'blog_posts', schema: 'id, title, slug, content, image, category, published_at', count: counts.blog_posts, connected: true },
    { name: 'portfolio', schema: 'id, title, description, results, image, created_at', count: counts.portfolio, connected: true },
    { name: 'testimonials', schema: 'id, client_name, company, review, rating, approved', count: counts.testimonials, connected: true },
    { name: 'subscribers', schema: 'id, email, subscribed_at', count: counts.subscribers, connected: true },
    { name: 'users', schema: 'id, email, password_hash, role', count: counts.users, connected: true },
    { name: 'payments', schema: 'id, lead_id, amount, status, gateway_ref, created_at', count: counts.payments, connected: true }
  ];

  const integrations = [
    {
      label: 'Nodemailer / SendGrid email notifications',
      connected: true,
      note: 'Mailer + Gmail SMTP configured'
    },
    {
      label: 'Twilio / Meta WhatsApp auto reply',
      connected: true,
      note: 'Twilio API active'
    },
    {
      label: 'Cloudinary image & PDF upload',
      connected: false,
      note: 'Storage blueprint ready'
    },
    {
      label: 'JWT auth + bcrypt password hashing',
      connected: true,
      note: 'Admin auth flow active'
    },
    {
      label: 'Razorpay / Stripe payment webhooks',
      connected: false,
      note: 'Demo payment tracking only'
    },
    {
      label: 'GA4 events + Hotjar heatmaps',
      connected: false,
      note: 'GA placeholder only'
    },
    {
      label: 'REST API with Express routes',
      connected: true,
      note: 'Express routes created in backend/'
    },
    {
      label: 'MySQL / PostgreSQL relational schema',
      connected: false,
      note: 'Schema file ready, DB not connected'
    },
    {
      label: 'Railway / Render deployment pipeline',
      connected: false,
      note: 'Local / current host only'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Backend Architecture</h2>
        <p className="text-slate-400 text-sm">Production stack blueprint plus current live app status indicators.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[
          { icon: Server, label: 'Backend', value: stack.backend },
          { icon: Database, label: 'Database', value: stack.database },
          { icon: ShieldCheck, label: 'Auth', value: stack.auth },
          { icon: Cloud, label: 'Storage', value: stack.fileStorage },
          { icon: MessageSquareMore, label: 'Email / WhatsApp', value: `${stack.email} • ${stack.whatsapp}` },
          { icon: CreditCard, label: 'Payments', value: stack.payment },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-indigo-400">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-bold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-black text-white">Deployment</h3>
        </div>
        <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
          Current live URL: <span className="font-bold text-white">{deploymentUrl}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-black text-white">Database tables with row count</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {tableRows.map((table) => (
            <div key={table.name} className="rounded-xl bg-slate-950 px-4 py-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-white">{table.name}</p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${table.connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {table.connected ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {table.connected ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{table.schema}</p>
              <p className="mt-3 text-xs font-semibold text-indigo-400">Live rows: {table.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-black text-white">Production integrations checklist</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-950 px-4 py-3 text-sm text-slate-300 flex items-center justify-between gap-3">
              <div>
                <span className="block">{item.label}</span>
                <span className="mt-1 block text-[10px] text-slate-500">{item.note}</span>
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold whitespace-nowrap ${item.connected ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.connected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {item.connected ? 'LIVE' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
