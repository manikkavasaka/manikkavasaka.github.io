import { Check, X } from 'lucide-react';

interface PricingProps {
  onSelectTier: (tierName: string) => void;
}

const plans = [
  {
    name: 'Starter',
    price: '$999',
    description: 'Affordable digital marketing package for small businesses starting their SEO and online journey.',
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
    gradient: 'from-slate-600 to-slate-700',
    popular: false
  },
  {
    name: 'Growth',
    price: '$2,499',
    description: 'Complete digital marketing package with SEO, Google Ads, social media marketing for growing businesses.',
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
    gradient: 'from-indigo-600 to-violet-600',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$4,999',
    description: 'Full-service digital marketing solution with unlimited SEO, PPC, social media, and content marketing.',
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
    gradient: 'from-slate-800 to-slate-900',
    popular: false
  }
];

export default function Pricing({ onSelectTier }: PricingProps) {
  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with SEO Keywords */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Digital Marketing Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Affordable SEO & Digital Marketing{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Packages That Pay for Themselves</span>
          </h2>
          <p className="mt-6 text-lg text-slate-500">
            Transparent digital marketing pricing with no hidden fees. Every SEO, Google Ads, and social media marketing plan is designed to deliver measurable ROI from month one.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-white shadow-2xl shadow-indigo-200/50 ring-2 ring-indigo-600 scale-[1.02]'
                  : 'bg-white shadow-lg shadow-slate-200/50 border border-slate-100'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center text-xs font-bold uppercase tracking-wider py-2 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }}>
                  ⭐ Most Popular — Best SEO & Marketing Value
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name} Digital Marketing</h3>
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">{plan.price.replace(/\$/g, '₹')}</span>
                    <span className="text-slate-500 text-sm font-medium">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className={`flex items-center gap-3 text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                      {feature.included ? (
                        <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <X className="h-3 w-3 text-slate-400" />
                        </div>
                      )}
                      <span className={feature.included ? '' : 'line-through'}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onSelectTier(`${plan.name} Plan`)}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Get {plan.name} SEO & Marketing Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">
            🛡️ <span className="font-semibold text-slate-700">30-Day Money-Back Guarantee</span> — If you're not satisfied with our SEO and digital marketing results in the first 30 days, we'll refund your investment. No questions asked.
          </p>
        </div>

        {/* SEO Keywords for Pricing */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mx-auto">
            <span className="font-semibold text-slate-500">Popular Searches:</span> affordable SEO packages • digital marketing pricing • Google Ads management cost • social media marketing packages • small business SEO pricing • PPC management fees • content marketing pricing • website development cost • best digital marketing agency pricing • SEO services cost per month • cheap SEO packages • enterprise digital marketing • marketing agency retainer pricing
          </p>
        </div>
      </div>
    </section>
  );
}
