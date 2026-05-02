import { Trophy, Users, Target, TrendingUp, Lightbulb, Rocket, Heart, CheckCircle2 } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';

export default function AboutPage() {
  const team = enhancedDB.getTeam();

  const values = [
    { icon: Lightbulb, title: 'Innovation', desc: 'We stay ahead of digital trends to deliver cutting-edge strategies.' },
    { icon: Rocket, title: 'Results', desc: 'Every campaign is measured by ROI, not vanity metrics.' },
    { icon: Heart, title: 'Partnership', desc: 'We treat your business like our own, with dedicated support.' },
    { icon: CheckCircle2, title: 'Integrity', desc: 'Transparent reporting, honest recommendations, no hidden fees.' },
  ];

  return (
    <PageLayout title="About Us" description="MK ShopZone is a top-rated digital marketing agency with 12+ years of experience, 500+ clients, and a team of 40+ marketing experts.">
      {/* Story Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 mb-6">
                We're Not Just Marketers. <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">We're Growth Partners.</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Founded in 2014, MK ShopZone started with a simple mission: help businesses grow through data-driven digital marketing. What began as a two-person SEO consultancy has evolved into a full-service agency with 40+ experts across SEO, PPC, social media, content, design, and development.
              </p>
              <p className="text-slate-500 leading-relaxed mb-4">
                We've helped 500+ businesses — from local startups to Fortune 500 companies — achieve extraordinary growth. Our clients see an average 340% ROI increase within the first 6 months of working with us.
              </p>
              <p className="text-slate-500 leading-relaxed">
                What makes us different? We don't do cookie-cutter. Every strategy is custom-built for your industry, audience, and goals. We measure our success by your revenue growth, not our awards.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-slate-900">12+</p>
                  <p className="text-xs text-slate-500 font-semibold">Years Experience</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <Users className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-slate-900">500+</p>
                  <p className="text-xs text-slate-500 font-semibold">Clients Served</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <Target className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-slate-900">1200+</p>
                  <p className="text-xs text-slate-500 font-semibold">Projects Done</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-3xl font-black text-slate-900">340%</p>
                  <p className="text-xs text-slate-500 font-semibold">Avg. ROI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Our Core Values</h2>
            <p className="mt-4 text-slate-500">The principles that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-lg transition">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Meet Our Team</h2>
            <p className="mt-4 text-slate-500">40+ digital marketing experts dedicated to your success.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-lg transition">
                <div className="text-5xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-indigo-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-slate-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
