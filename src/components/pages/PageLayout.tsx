import { useState, useEffect } from 'react';
import { Megaphone, Menu, X, LayoutDashboard } from 'lucide-react';
import { useRouter } from '../../router';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  const { navigate } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (title) document.title = `${title} | MK ShopZone`;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogTitle && title) ogTitle.setAttribute('content', `${title} | MK ShopZone`);
      if (ogDesc) ogDesc.setAttribute('content', description);
    }
  }, [title, description]);

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 py-2 shadow-lg shadow-slate-200/50 backdrop-blur-lg' : 'bg-white py-3'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => goTo('home')} className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">MK ShopZone</span>
              <span className="-mt-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Digital Agency</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.name} onClick={() => goTo(item.page)} className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600">
                {item.name}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => goTo('dashboard')} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </button>
          </div>

          <button className="rounded-xl p-2.5 transition hover:bg-slate-100 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="animate-fade-in space-y-1 border-t border-slate-100 bg-white px-4 py-4 shadow-xl lg:hidden">
            {navItems.map((item) => (
              <button key={item.name} onClick={() => goTo(item.page)} className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600">
                {item.name}
              </button>
            ))}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <button onClick={() => goTo('dashboard')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md">
                <LayoutDashboard className="h-4 w-4" /> Client Dashboard
              </button>
            </div>
          </div>
        )}
      </header>

      {title && (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pb-12 pt-24">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">{title}</h1>
            {description && <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{description}</p>}
          </div>
        </div>
      )}

      <main className={title ? '' : 'pt-20'}>{children}</main>

      <footer className="bg-slate-950 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                  <Megaphone className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">MK ShopZone</span>
              </div>
              <p className="text-sm leading-relaxed">Top-rated digital marketing agency for SEO, PPC, social media, content, email marketing, web design, influencer campaigns, and video growth.</p>
              <div className="flex gap-2 text-[11px] font-bold">
                {['Google Partner', 'Meta Partner', 'Clutch Top Agency'].map((badge) => (
                  <span key={badge} className="rounded-full bg-slate-800 px-3 py-1.5 text-slate-300">{badge}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">LinkedIn</a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">X / Twitter</a>
              </div>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ['Home', 'home'], ['Services', 'services'], ['About Us', 'about'], ['Portfolio', 'portfolio'], ['Blog', 'blog'], ['Pricing', 'pricing'], ['Contact', 'contact'], ['Free SEO Audit', 'free-audit']
                ].map(([label, page]) => (
                  <li key={label}><button onClick={() => goTo(page)} className="flex items-center gap-1.5 transition hover:text-indigo-400"><span className="h-1 w-1 rounded-full bg-indigo-500" />{label}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Services</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ['SEO', 'seo'], ['Google Ads', 'ppc'], ['Social Media', 'social-media'], ['Content Marketing', 'content-marketing'], ['Email Marketing', 'email-marketing'], ['Web Design', 'web-dev'], ['Influencer Marketing', 'influencer-marketing'], ['Video Marketing', 'video-marketing'], ['Local SEO', 'local-seo']
                ].map(([label, page]) => (
                  <li key={label}><button onClick={() => goTo(page)} className="flex items-center gap-1.5 transition hover:text-indigo-400"><span className="h-1 w-1 rounded-full bg-violet-500" />{label}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
              <div className="space-y-3 text-sm">
                <p>123 Digital Avenue, Suite 400<br />San Francisco, CA 94102</p>
                <p><a href="mailto:mkshopzone2@gmail.com" className="transition hover:text-indigo-400">mkshopzone2@gmail.com</a></p>
                <p><a href="tel:+917200059453" className="transition hover:text-indigo-400">+91 7200059453</a></p>
                <p><a href="https://wa.me/917200059453" target="_blank" rel="noopener noreferrer" className="transition hover:text-indigo-400">WhatsApp us directly</a></p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800/50 pt-6">
            <p className="mx-auto max-w-5xl text-center text-[10px] leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-500">Digital marketing keywords:</span> SEO optimization, social media marketing, Google Ads management, PPC advertising, website design and development, content marketing, email marketing, influencer marketing, video marketing, lead generation, conversion rate optimization, local SEO, e-commerce growth, B2B marketing.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row">
            <p>&copy; {new Date().getFullYear()} MK ShopZone. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => goTo('privacy')} className="transition hover:text-slate-300">Privacy Policy</button>
              <button onClick={() => goTo('terms')} className="transition hover:text-slate-300">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
