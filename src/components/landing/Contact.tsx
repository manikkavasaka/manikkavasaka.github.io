import { useState, useEffect } from 'react';
import { Mail, Phone, Building, MessageSquare, MapPin, Clock, ArrowRight } from 'lucide-react';
import { mockDB } from '../../db/mockDB';
import { enhancedDB } from '../../db/enhancedDB';
import { automationDB } from '../../db/automationDB';
import { Notification } from '../../db/automationDB';
import { postJson } from '../../utils/api';
import confetti from 'canvas-confetti';

interface ContactProps {
  selectedService: string;
  onNotificationsSent?: (notifications: Notification[]) => void;
}

export default function Contact({ selectedService, onNotificationsSent }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '',
    serviceInterested: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (selectedService) setFormData(prev => ({ ...prev, serviceInterested: selectedService }));
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceInterested) {
      setStatus('Please fill in all required fields (*)');
      return;
    }

    const newLead = mockDB.addLead(formData);
    enhancedDB.addContactSubmission({
      name: formData.name,
      email: formData.email,
      business: formData.company,
      phone: formData.phone,
      subject: formData.serviceInterested || 'Website Inquiry',
      message: formData.message || 'New contact form submission'
    });

    setSending(true);

    try {
      await postJson('/api/leads', {
        name: formData.name,
        email: formData.email,
        business: formData.company,
        phone: formData.phone,
        subject: formData.serviceInterested || 'Website Inquiry',
        service: formData.serviceInterested || 'Website Inquiry',
        message: formData.message || 'New contact form submission'
      });

      const notifications = automationDB.sendLeadNotifications(newLead);
      setSending(false);
      setStatus('Email delivered successfully.');
      if (onNotificationsSent && notifications.length > 0) onNotificationsSent(notifications);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', phone: '', serviceInterested: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (error) {
      setSending(false);
      const message = error instanceof Error ? error.message : 'Email sending failed';
      setStatus(message);
    }
  };

  const services = ['SEO Optimization', 'Social Media Marketing', 'Google Ads (PPC)', 'Website Development', 'Content Marketing', 'Brand Strategy', 'Starter Plan', 'Growth Plan', 'Enterprise Plan'];

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Let's Start Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Growth Journey</span>
          </h2>
          <p className="mt-6 text-lg text-slate-500">
            Fill out the form below and our team will get back to you within 24 hours with a custom strategy proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email Us', value: 'mkshopzone2@gmail.com', href: 'mailto:mkshopzone2@gmail.com', color: 'text-blue-600 bg-blue-50' },
                { icon: Phone, label: 'Call / WhatsApp', value: '+91 7200059453', href: 'https://wa.me/917200059453', color: 'text-emerald-600 bg-emerald-50' },
                { icon: MapPin, label: 'Visit Us', value: '123 Digital Ave, San Francisco', href: '#', color: 'text-violet-600 bg-violet-50' },
                { icon: Clock, label: 'Working Hours', value: 'Mon-Fri: 9AM - 6PM PST', href: '#', color: 'text-amber-600 bg-amber-50' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a key={idx} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group">
                    <div className={`h-11 w-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition">{item.value}</span>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Automation Active</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you submit this form, MK ShopZone automatically triggers notifications via WhatsApp, Email & SMS for faster response.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-slate-50 border border-slate-100 p-8 md:p-10 rounded-3xl shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 5" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Inquiry Submitted Successfully!</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">Our team has been notified via WhatsApp, Email & SMS. Expect a response from MK ShopZone within 24 hours.</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> WhatsApp ✓</span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700"><span className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> Email ✓</span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700"><span className="h-1.5 w-1.5 bg-amber-500 rounded-full" /> SMS ✓</span>
                  </div>
                </div>
              ) : sending ? (
                <div className="text-center py-16">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent" />
                  <p className="mt-6 text-slate-600 font-semibold">Saving lead & sending notifications...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work Email *</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="john@company.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                          className="block w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Acme Corp" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="block w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="+91 7200059453" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service of Interest *</label>
                    <select required value={formData.serviceInterested} onChange={e => setFormData({ ...formData, serviceInterested: e.target.value })}
                      className="block w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">-- Select a Service --</option>
                      {services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Message</label>
                    <div className="relative">
                      <MessageSquare className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                      <textarea rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="block w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Tell us about your goals and challenges..." />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full group btn-animate inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300">
                    Submit & Get Free Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  {status && <p className="text-center text-xs font-semibold text-slate-500">{status}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
