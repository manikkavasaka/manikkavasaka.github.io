import { useMemo, useState } from 'react';
import { Check, X, CreditCard, Download } from 'lucide-react';
import PageLayout from './PageLayout';
import { useRouter } from '../../router';
import { adminBackend } from '../../db/adminBackend';

const plans = [
  {
    name: 'Basic',
    price: '$999',
    amount: 999,
    description: 'Perfect for small businesses starting their digital journey.',
    features: [
      { text: 'SEO Optimization (15 Keywords)', included: true },
      { text: 'Monthly Blog Content (4 Posts)', included: true },
      { text: 'Google My Business Setup', included: true },
      { text: 'Monthly Performance Report', included: true },
      { text: 'Social Media (2 Platforms)', included: true },
      { text: 'Google Ads Management', included: false },
      { text: 'Dedicated Account Manager', included: false },
      { text: 'Custom Landing Pages', included: false }
    ],
    popular: false
  },
  {
    name: 'Growth',
    price: '$2,499',
    amount: 2499,
    description: 'For growing businesses ready to scale their digital presence.',
    features: [
      { text: 'SEO Optimization (50 Keywords)', included: true },
      { text: 'Bi-Weekly Blog Content (8 Posts)', included: true },
      { text: 'Google Ads Management ($5K Budget)', included: true },
      { text: 'Social Media (4 Platforms)', included: true },
      { text: 'Email Marketing Campaigns', included: true },
      { text: 'Dedicated Account Manager', included: true },
      { text: 'Custom Landing Pages (2/mo)', included: true },
      { text: 'A/B Testing & CRO', included: false }
    ],
    popular: true
  },
  {
    name: 'Premium',
    price: '$4,999',
    amount: 4999,
    description: 'Full-service solution for businesses demanding maximum growth.',
    features: [
      { text: 'Unlimited SEO Keywords', included: true },
      { text: 'Daily Content Production', included: true },
      { text: 'Multi-Channel Ads (Unlimited Budget)', included: true },
      { text: 'All Social Media Platforms', included: true },
      { text: 'Advanced Email Automation', included: true },
      { text: 'Senior Marketing Director', included: true },
      { text: 'Unlimited Landing Pages', included: true },
      { text: 'A/B Testing & CRO Suite', included: true }
    ],
    popular: false
  }
];

export default function PricingPage() {
  const { navigate } = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<{ packageName: string; amount: number; ref: string } | null>(null);

  const invoiceText = useMemo(() => {
    if (!selectedPayment) return '';
    return `MK ShopZone Invoice\n====================\nPackage: ${selectedPayment.packageName}\nAmount: ₹${selectedPayment.amount}\nReference: ${selectedPayment.ref}\nStatus: PAID\nDate: ${new Date().toLocaleString()}\n\nThank you for choosing MK ShopZone.`;
  }, [selectedPayment]);

  const handlePayNow = (plan: (typeof plans)[number]) => {
    const payment = adminBackend.createPayment(`${plan.name} Package`, plan.amount);
    adminBackend.updatePaymentStatus(payment.id, 'paid');
    setSelectedPayment({ packageName: payment.package_name, amount: payment.amount, ref: payment.gateway_ref });
  };

  return (
    <PageLayout title="Pricing Plans" description="Transparent digital marketing pricing. Choose Basic, Growth, or Premium, or request a custom quote.">
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedPayment && (
            <div className="mb-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-xl font-black text-emerald-900">Payment successful</h3>
              <p className="mt-2 text-sm text-emerald-700">Your package has been recorded and invoice data is ready.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(invoiceText)}`}
                  download={`mk-shopzone-invoice-${selectedPayment.ref}.txt`}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
                >
                  <Download className="h-4 w-4" /> Download invoice
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
            {plans.map((plan, idx) => (
              <div key={idx} className={`relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'scale-[1.02] bg-white shadow-2xl ring-2 ring-indigo-600' : 'border border-slate-100 bg-white shadow-lg'}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-2 text-center text-xs font-bold uppercase tracking-wider text-white">
                    ⭐ Most Popular
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? '' : ''}`}>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-sm font-medium text-slate-500">/month</span>
                  </div>
                  <ul className="mt-6 mb-8 space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm ${f.included ? 'text-slate-700' : 'text-slate-400'}`}>
                        {f.included ? (
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100"><Check className="h-3 w-3 text-emerald-600" /></div>
                        ) : (
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100"><X className="h-3 w-3 text-slate-400" /></div>
                        )}
                        <span className={f.included ? '' : 'line-through'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <button onClick={() => handlePayNow(plan)} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-indigo-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                      <CreditCard className="h-4 w-4" /> Pay for {plan.name}
                    </button>
                    <button onClick={() => navigate('contact')} className="w-full rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                      Talk to sales
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h3 className="text-xl font-black text-slate-900">Need a custom quote?</h3>
            <p className="mt-2 text-sm text-slate-500">For multi-channel growth, enterprise reporting, or white-label support, we can build a custom retainer around your goals.</p>
            <button onClick={() => navigate('contact')} className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Request Custom Quote
            </button>
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            🛡️ <span className="font-semibold text-slate-700">30-Day Money-Back Guarantee</span> — Not satisfied? We'll refund your investment.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
