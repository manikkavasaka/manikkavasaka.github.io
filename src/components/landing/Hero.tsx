import { ArrowRight, Play, Sparkles, TrendingUp, Users, Award } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onExploreServices: () => void;
}

export default function Hero({ onGetStarted, onExploreServices }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="MK ShopZone Digital Marketing Agency"
          className="w-full h-full object-cover animate-ken-burns"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-indigo-950/90 to-slate-950/95" />
      </div>

      {/* Floating Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 md:py-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-4 py-2 text-xs font-bold text-indigo-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>#1 Digital Marketing Agency — SEO, PPC & Social Media</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Top-Rated
              <span className="block mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Digital Marketing
              </span>
              <span className="block mt-1 text-3xl sm:text-4xl md:text-5xl text-slate-300">
                Agency That Drives Revenue
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              We specialize in <strong className="text-white">SEO optimization</strong>, <strong className="text-white">social media marketing</strong>, <strong className="text-white">Google Ads management</strong>, <strong className="text-white">website development</strong>, and <strong className="text-white">content marketing</strong> — turning clicks into customers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all"
              >
                Get Free Marketing Audit
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onExploreServices}
                className="group inline-flex items-center gap-3 rounded-2xl border border-slate-600 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-slate-200 hover:bg-white/10 hover:border-slate-500 transition-all"
              >
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <Play className="h-4 w-4 ml-0.5" />
                </div>
                See Our Results
              </button>
            </div>

            {/* Trust Stats */}
            <div className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold text-white">340%</span>
                  <span className="text-[11px] text-slate-400">Avg. ROI</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <Users className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold text-white">500+</span>
                  <span className="text-[11px] text-slate-400">Clients</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-bold text-white">12+</span>
                  <span className="text-[11px] text-slate-400">Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Floating Dashboard Cards */}
          <div className="lg:col-span-5 relative hidden lg:block h-[480px]">
            {/* Main Chart Card */}
            <div className="absolute top-4 left-0 right-8 bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl animate-float">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue Growth</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+247%</span>
              </div>
              <div className="flex items-end gap-1 h-28">
                {[25, 35, 30, 45, 55, 50, 65, 75, 70, 85, 90, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                <span>Jan</span><span>Dec</span>
              </div>
            </div>

            {/* Traffic Card */}
            <div className="absolute top-0 right-0 bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Website Traffic</span>
              <p className="text-xl font-black text-white mt-1">128.4K</p>
              <span className="text-[10px] text-emerald-400 font-bold">↑ 34% MoM</span>
            </div>

            {/* Leads Card */}
            <div className="absolute bottom-20 left-0 bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '3s' }}>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Leads Generated</span>
              <p className="text-xl font-black text-white mt-1">2,847</p>
              <span className="text-[10px] text-indigo-400 font-bold">This quarter</span>
            </div>

            {/* Conversion Card */}
            <div className="absolute bottom-0 right-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
              <span className="text-[10px] font-bold text-white/70 uppercase">Conversion Rate</span>
              <p className="text-xl font-black text-white mt-1">8.7%</p>
              <span className="text-[10px] text-white/80 font-bold">↑ vs 2.3% avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Scroll</span>
        <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
