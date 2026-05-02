import { ArrowLeft, Home, SearchX } from 'lucide-react';
import PageLayout from './PageLayout';
import { useRouter } from '../../router';

export default function NotFoundPage() {
  const { navigate } = useRouter();

  return (
    <PageLayout title="404 Page Not Found" description="The page you are looking for does not exist or may have moved.">
      <div className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
            <SearchX className="h-12 w-12" />
          </div>
          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.25em] text-slate-400">Error 404</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Oops, this page is missing.</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            The link may be outdated or the page has been moved. You can go back home, browse services, or contact us directly.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('home')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <Home className="h-4 w-4" /> Go to Home
            </button>
            <button onClick={() => navigate('services')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              View Services
            </button>
            <button onClick={() => history.back()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
