import { ArrowLeft, Clock, Eye, Tag, Share2, Link as LinkIcon } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';
import { useRouter } from '../../router';
import { useEffect, useState } from 'react';

export default function BlogPostPage() {
  const { params, navigate } = useRouter();
  const slug = params.slug;
  const blog = slug ? enhancedDB.getBlogBySlug(slug) : undefined;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) enhancedDB.incrementBlogViews(slug);
  }, [slug]);

  if (!blog) {
    return (
      <PageLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Blog post not found</h2>
          <button onClick={() => navigate('blog')} className="mt-4 text-indigo-600 font-semibold">Back to Blog</button>
        </div>
      </PageLayout>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout title={blog.title} description={blog.excerpt}>
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('blog')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </button>

          <div className="relative mb-8 h-72 overflow-hidden rounded-2xl md:h-96">
            <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{blog.category}</span>
              <h1 className="mt-3 text-2xl font-black text-white md:text-4xl">{blog.title}</h1>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-5 border-b border-slate-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{blog.authorAvatar}</span>
              <div>
                <p className="text-sm font-bold text-slate-900">{blog.author}</p>
                <p className="text-xs text-slate-500">{blog.date}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {blog.readTime} read</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {blog.views} views</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            {blog.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-slate-600 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                {blog.authorAvatar}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">About {blog.author}</h3>
                <p className="text-sm text-slate-500">MK ShopZone editorial team member focused on {blog.category.toLowerCase()} growth strategy.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Share</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  X
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  in
                </a>
                <button onClick={handleCopy} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <span className="inline-flex items-center gap-1.5"><LinkIcon className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
