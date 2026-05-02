import { useState } from 'react';
import { Mail, Phone, Building, MessageSquare, MapPin, Clock, Send, BadgeCheck } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';
import { postJson } from '../../utils/api';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.subject) {
      setStatus('Please fill in all required fields (*)');
      return;
    }

    try {
      await postJson('/api/leads', { ...form, service: form.subject });
      enhancedDB.addContactSubmission(form);
      setSubmitted(true);
      setStatus('Email sent successfully.');
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ name: '', email: '', business: '', phone: '', subject: '', message: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Contact form failed';
      setStatus(message);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Call, email, WhatsApp, or send a quote request. Our team usually replies within 2 business hours and always within 24 hours."
    >
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              {[
                { icon: Mail, label: 'Email', value: 'mkshopzone2@gmail.com', href: 'mailto:mkshopzone2@gmail.com' },
                { icon: Phone, label: 'Phone', value: '+91 7200059453', href: 'tel:+917200059453' },
                { icon: BadgeCheck, label: 'WhatsApp', value: 'Chat instantly with our team', href: 'https://wa.me/917200059453?text=Hi%20MK%20ShopZone!%20I%20need%20a%20digital%20marketing%20quote.' },
                { icon: MapPin, label: 'Address', value: '123 Digital Avenue, Suite 400, San Francisco, CA 94102', href: '#' },
                { icon: Clock, label: 'Response time', value: 'Usually within 2 business hours', href: '#' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-700">{item.value}</span>
                    </div>
                  </a>
                );
              })}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <iframe
                  title="MK ShopZone Google Map"
                  src="https://www.google.com/maps?q=San%20Francisco%20CA&z=12&output=embed"
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm">
                {submitted ? (
                  <div className="py-14 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 5" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Request received!</h3>
                    <p className="mt-2 text-slate-600">Thanks for reaching out to MK ShopZone. Our team will respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Email *</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="john@company.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Business</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="Your business name" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Phone / WhatsApp *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="+91 7200059453" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Subject / Service *</label>
                        <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="What do you need help with?" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Message</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500" placeholder="Tell us about your goals, current challenges, and timeline..." />
                      </div>
                    </div>

                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 btn-animate">
                      <Send className="h-4 w-4" /> Send request
                    </button>
                    {status && <p className="text-center text-xs font-semibold text-slate-500">{status}</p>}
                    <p className="text-center text-[11px] text-slate-400">Prefer instant support? Use the WhatsApp button or live chat widget.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
