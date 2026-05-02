import { useState, useEffect } from 'react';

export type Page =
  | 'home'
  | 'services'
  | 'about'
  | 'portfolio'
  | 'case-study'
  | 'testimonials'
  | 'pricing'
  | 'contact'
  | 'seo'
  | 'ppc'
  | 'social-media'
  | 'content-marketing'
  | 'email-marketing'
  | 'web-dev'
  | 'influencer-marketing'
  | 'video-marketing'
  | 'local-seo'
  | 'branding'
  | 'blog'
  | 'blog-post'
  | 'free-audit'
  | 'dashboard'
  | 'privacy'
  | 'terms'
  | 'not-found';

const validPages: Page[] = [
  'home', 'services', 'about', 'portfolio', 'case-study', 'testimonials', 'pricing', 'contact',
  'seo', 'ppc', 'social-media', 'content-marketing', 'email-marketing', 'web-dev',
  'influencer-marketing', 'video-marketing', 'local-seo', 'branding', 'blog', 'blog-post', 'free-audit',
  'dashboard', 'privacy', 'terms', 'not-found'
];

export function useRouter() {
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const [route, query] = hash.split('?');
      const candidate = (route || 'home') as Page;
      const safePage = validPages.includes(candidate) ? candidate : 'not-found';
      setPage(safePage);

      const searchParams = new URLSearchParams(query || '');
      const nextParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        nextParams[key] = value;
      });
      setParams(nextParams);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (to: Page, query?: Record<string, string>) => {
    const q = query ? `?${new URLSearchParams(query).toString()}` : '';
    window.location.hash = `${to}${q}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { page, params, navigate };
}
