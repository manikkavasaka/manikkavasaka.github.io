import { useState, useEffect } from 'react';
import { Megaphone, Menu, X, LayoutDashboard } from 'lucide-react';
import { useRouter } from '../../router';

interface LandingLayoutProps {
  children: React.ReactNode;
  onNavigateToDashboard: () => void;
}

export default function LandingLayout({ children, onNavigateToDashboard }: LandingLayoutProps) {
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', page: 'home' as const },
    { name: 'Services', page: 'services' as const },
    { name: 'About', page: 'about' as const },
    { name: 'Portfolio', page: 'portfolio' as const },
    { name: 'Blog', page: 'blog' as const },
    { name: 'Pricing', page: 'pricing' as const },
    { name: 'Contact', page: 'contact' as const },
  ];

  const goTo = (page: string) => {
    setIsMenuOpen(false);
    navigate(page as any);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-slate-200/50 py-2' : 'bg-transparent py-4'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => goTo('home')} className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                MK ShopZone
              </span>
              <span className={`text-[10px] font-semibold block -mt-1 tracking-widest uppercase ${scrolled ? 'text-slate-400' : 'text-slate-500'}`}>
                Digital Agency
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.name} onClick={() => goTo(item.page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all hover:bg-indigo-50 hover:text-indigo-600 ${scrolled ? 'text-slate-600' : 'text-slate-700'}`}>
                {item.name}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
          </div>

          <button className="lg:hidden rounded-xl p-2.5 hover:bg-slate-100 transition" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl px-4 py-4 space-y-1 animate-fade-in">
            {navItems.map((item) => (
              <button key={item.name} onClick={() => goTo(item.page)}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                {item.name}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-3">
              <button onClick={onNavigateToDashboard}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md">
                <LayoutDashboard className="h-4 w-4" /> Client Dashboard
              </button>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mb-16 relative z-10">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Ready to 10x Your Digital Growth?</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">Join 500+ businesses that trust MK ShopZone for their digital marketing success.</p>
            <button onClick={() => goTo('contact')}
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg">
              Get Free Consultation
            </button>
          </div>
        </div>

        <div className="pt-28 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                    <Megaphone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-extrabold text-white">MK ShopZone</span>
                </div>
                <p className="text-sm leading-relaxed">Full-service digital marketing agency helping businesses scale with data-driven strategies, SEO, Google Ads, social media, and web development.</p>
                <div className="flex flex-wrap gap-3 text-xs font-semibold">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Instagram</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">LinkedIn</a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">X / Twitter</a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  {[{l:'Home',p:'home'},{l:'Services',p:'services'},{l:'About Us',p:'about'},{l:'Portfolio',p:'portfolio'},{l:'Blog',p:'blog'},{l:'Pricing',p:'pricing'},{l:'Contact',p:'contact'},{l:'Free SEO Audit',p:'free-audit'}].map(link => (
                    <li key={link.p}><button onClick={() => goTo(link.p)} className="hover:text-indigo-400 transition flex items-center gap-1.5"><span className="h-1 w-1 bg-indigo-500 rounded-full" />{link.l}</button></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Services</h4>
                <ul className="space-y-3 text-sm">
                  {[
                    {l:'SEO Optimization',p:'seo'},
                    {l:'Google Ads',p:'ppc'},
                    {l:'Social Media',p:'social-media'},
                    {l:'Content Marketing',p:'content-marketing'},
                    {l:'Email Marketing',p:'email-marketing'},
                    {l:'Web Development',p:'web-dev'},
                    {l:'Influencer Marketing',p:'influencer-marketing'},
                    {l:'Video Marketing',p:'video-marketing'},
                    {l:'Local SEO',p:'local-seo'},
                    {l:'Brand Strategy',p:'branding'}
                  ].map(svc => (
                    <li key={svc.p}><button onClick={() => goTo(svc.p)} className="hover:text-indigo-400 transition flex items-center gap-1.5"><span className="h-1 w-1 bg-violet-500 rounded-full" />{svc.l}</button></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact Us</h4>
                <div className="space-y-4 text-sm">
                  <p>123 Digital Avenue, Suite 400<br />San Francisco, CA 94102</p>
                  <p><a href="mailto:mkshopzone2@gmail.com" className="hover:text-indigo-400 transition">mkshopzone2@gmail.com</a></p>
                  <p><a href="tel:+917200059453" className="hover:text-indigo-400 transition">+91 7200059453</a></p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800/50">
              <p className="text-[10px] text-slate-600 leading-relaxed text-center max-w-5xl mx-auto">
                <span className="text-slate-500 font-semibold">Services:</span> SEO optimization • Social media marketing • Google Ads management • PPC advertising • Website development • Content marketing • Brand identity design • Email marketing • Local SEO • E-commerce SEO • Facebook ads • Instagram marketing • LinkedIn B2B • TikTok advertising • Conversion optimization
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} MK ShopZone. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <button onClick={() => goTo('privacy')} className="hover:text-slate-300 transition">Privacy Policy</button>
                <button onClick={() => goTo('terms')} className="hover:text-slate-300 transition">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
