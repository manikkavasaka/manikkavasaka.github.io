import { ArrowRight, Clock, Eye } from 'lucide-react';
import PageLayout from './PageLayout';
import { enhancedDB } from '../../db/enhancedDB';
import { useRouter } from '../../router';
import NewsletterSection from '../global/NewsletterSection';

export default function BlogPage() {
  const { navigate } = useRouter();
  const blogs = enhancedDB.getBlogs();
  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  return (
    <PageLayout title="Blog" description="SEO-friendly digital marketing articles on SEO, social media, ads, and growth tips.">
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="py-2 text-sm font-bold text-slate-700">Categories:</span>
            {categories.map((cat) => (
              <span key={cat} className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600">
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                onClick={() => {
                  enhancedDB.incrementBlogViews(blog.slug);
                  navigate('blog-post', { slug: blog.slug });
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{blog.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">{blog.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{blog.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {blog.readTime}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {blog.views}</span>
                    </div>
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 transition-all group-hover:gap-2">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewsletterSection compact />
    </PageLayout>
  );
}
