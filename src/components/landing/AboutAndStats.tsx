import { useEffect, useRef, useState } from 'react';
import { Trophy, Users, Target, TrendingUp, CheckCircle2, Lightbulb, Rocket, Heart } from 'lucide-react';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function AboutAndStats() {
  const stats = [
    { icon: Users, value: 500, suffix: '+', label: 'Clients Served Worldwide', color: 'text-indigo-400' },
    { icon: Target, value: 1200, suffix: '+', label: 'Digital Marketing Projects', color: 'text-violet-400' },
    { icon: TrendingUp, value: 340, suffix: '%', label: 'Average ROI for Clients', color: 'text-emerald-400' },
    { icon: Trophy, value: 98, suffix: '%', label: 'Client Retention Rate', color: 'text-amber-400' }
  ];

  const whyChooseUs = [
    { icon: Lightbulb, title: 'Data-Driven SEO & Marketing Strategy', desc: 'Every decision backed by analytics, A/B testing, keyword research, and real-time performance data from Google Analytics and SEMrush.' },
    { icon: Rocket, title: 'Fast Campaign Deployment', desc: 'Rapid Google Ads, Facebook Ads, and SEO campaign deployment with agile methodology and weekly progress reports.' },
    { icon: Heart, title: 'Dedicated Account Manager', desc: 'Personal digital marketing strategist available via Slack, email, and phone 7 days a week for your business growth.' },
    { icon: CheckCircle2, title: 'Proven ROI Results', desc: 'Consistently delivering 3x+ ROI for our clients across SEO, PPC, social media marketing, and content marketing campaigns.' }
  ];

  return (
    <section id="about" className="relative overflow-hidden">
      {/* Stats Section with Video-like Background */}
      <div className="relative py-20 overflow-hidden">
        {/* Video-like animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] h-2 w-2 bg-indigo-400/30 rounded-full animate-orbit" />
          <div className="absolute top-[70%] right-[15%] h-3 w-3 bg-violet-400/20 rounded-full animate-orbit" style={{ animationDuration: '14s' }} />
          <div className="absolute top-[30%] right-[30%] h-1.5 w-1.5 bg-pink-400/30 rounded-full animate-orbit" style={{ animationDuration: '11s' }} />
        </div>

        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Digital Marketing Results</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Our SEO & Marketing Numbers{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Speak For Themselves</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition group-hover:scale-110 transform duration-300">
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section with SEO Keywords */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div>
              <span className="inline-block text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">About MK ShopZone</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
                We're a Full-Service{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Digital Marketing Agency</span>
                {' '}That Delivers ROI
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Founded in 2014, MK ShopZone is a <strong className="text-slate-700">top-rated digital marketing agency</strong> specializing in <strong className="text-slate-700">SEO optimization</strong>, <strong className="text-slate-700">Google Ads management</strong>, <strong className="text-slate-700">social media marketing</strong>, <strong className="text-slate-700">website development</strong>, and <strong className="text-slate-700">content marketing</strong>. Our team of 40+ digital marketing experts has helped 500+ businesses — from startups to Fortune 500 companies — achieve extraordinary online growth.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                What sets us apart from other digital marketing agencies? We don't believe in one-size-fits-all. Every SEO strategy, PPC campaign, and social media plan is custom-built for your business goals, industry, and budget. We measure our success by your revenue growth.
              </p>

              {/* Why Choose Us Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Visual with Video-like Animation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl p-8 relative overflow-hidden">
                {/* Animated background shimmer */}
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />

                {/* Team Dashboard with video-like motion */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="text-xs text-slate-400 ml-2 font-mono">mkshopzone_team.dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-indigo-50 rounded-xl p-4 text-center group hover:bg-indigo-100 transition">
                      <p className="text-2xl font-black text-indigo-600 animate-zoom-pulse">40+</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Marketing Experts</span>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-4 text-center group hover:bg-violet-100 transition">
                      <p className="text-2xl font-black text-violet-600">6</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Countries Served</span>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center group hover:bg-emerald-100 transition">
                      <p className="text-2xl font-black text-emerald-600">12</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Years of Excellence</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Satisfaction Score</span>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full animate-gradient-shift" style={{ width: '98%', backgroundSize: '200% 100%' }} />
                    </div>
                    <span className="text-sm font-black text-slate-900">98%</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="h-5 w-5 text-amber-400 animate-wave" style={{ animationDelay: `${s * 0.1}s` }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">4.9/5 — Google Reviews</span>
                  </div>
                </div>

                {/* Floating badges with animation */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl px-4 py-2 shadow-lg text-xs font-bold animate-float z-20">
                  🏆 Top Rated Digital Agency
                </div>
                <div className="absolute -bottom-3 -left-3 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-xl px-4 py-2 shadow-lg text-xs font-bold animate-float delay-2000 z-20">
                  ⭐ Google Premier Partner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

