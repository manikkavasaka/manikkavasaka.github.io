import { useEffect, useState } from 'react';
import { BookOpen, BriefcaseBusiness, Star, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { adminBackend, CmsBlog, CmsCaseStudy, CmsTestimonial } from '../../db/adminBackend';

interface CMSManagerProps {
  onRefresh: () => void;
}

export default function CMSManager({ onRefresh }: CMSManagerProps) {
  const [mode, setMode] = useState<'blogs' | 'cases' | 'testimonials'>('blogs');
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', image: '/images/seo-service.jpg', category: 'SEO', tags: '', metaTitle: '', metaDescription: '' });
  const [caseForm, setCaseForm] = useState({ title: '', slug: '', description: '', image: '/images/portfolio-ecommerce.jpg', pdfUrl: '', results: 'Before: Low traffic | After: 5x growth', industry: 'E-Commerce', strategy: 'SEO + PPC' });
  const [testForm, setTestForm] = useState({ client_name: '', company: '', review: '', rating: 5, approved: true, displayOrder: 1 });

  const [blogs, setBlogs] = useState<CmsBlog[]>([]);
  const [cases, setCases] = useState<CmsCaseStudy[]>([]);
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === 'blogs') setBlogs(await adminBackend.getBlogs());
      if (mode === 'testimonials') setTestimonials(await adminBackend.getTestimonials());
    };
    fetchData();
  }, [mode, onRefresh]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">CMS & Content Management</h2>
        <p className="text-slate-400 text-sm">Create, edit, approve, and remove blogs, portfolio case studies, and testimonials.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'blogs', label: 'Blog CMS', icon: BookOpen },
          { id: 'cases', label: 'Portfolio / Cases', icon: BriefcaseBusiness },
          { id: 'testimonials', label: 'Testimonials', icon: Star }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setMode(item.id as any)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${mode === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
              <Icon className="h-4 w-4" /> {item.label}
            </button>
          );
        })}
      </div>

      {mode === 'blogs' && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-black text-white">Create blog post</h3>
            <div className="mt-4 space-y-3">
              <input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="Slug" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} placeholder="Excerpt" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <textarea rows={4} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Content" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} placeholder="Image URL / Cloudinary URL" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} placeholder="Category" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} placeholder="Tags comma separated" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={blogForm.metaTitle} onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })} placeholder="Meta title" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <textarea rows={2} value={blogForm.metaDescription} onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })} placeholder="Meta description" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <button onClick={async () => {
                if (!blogForm.title || !blogForm.slug) return;
                await adminBackend.addBlog({ ...blogForm, tags: blogForm.tags.split(',').map((t) => t.trim()).filter(Boolean) });
                setBlogForm({ title: '', slug: '', excerpt: '', content: '', image: '/images/seo-service.jpg', category: 'SEO', tags: '', metaTitle: '', metaDescription: '' });
                onRefresh();
              }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">
                <Plus className="h-4 w-4" /> Add blog post
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-white">{blog.title}</h4>
                    <p className="mt-1 text-xs text-slate-400">/{blog.slug} • {blog.category}</p>
                    <p className="mt-3 text-sm text-slate-500">{blog.excerpt}</p>
                  </div>
                  <button onClick={async () => { await adminBackend.deleteBlog(blog.id); onRefresh(); }} className="rounded-xl bg-slate-950 p-2 text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'cases' && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-black text-white">Create case study</h3>
            <div className="mt-4 space-y-3">
              <input value={caseForm.title} onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.slug} onChange={(e) => setCaseForm({ ...caseForm, slug: e.target.value })} placeholder="Slug" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.industry} onChange={(e) => setCaseForm({ ...caseForm, industry: e.target.value })} placeholder="Industry" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.strategy} onChange={(e) => setCaseForm({ ...caseForm, strategy: e.target.value })} placeholder="Strategy used" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <textarea rows={3} value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} placeholder="Description / problem" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.results} onChange={(e) => setCaseForm({ ...caseForm, results: e.target.value })} placeholder="Before-after stats" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.image} onChange={(e) => setCaseForm({ ...caseForm, image: e.target.value })} placeholder="Image upload URL" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={caseForm.pdfUrl} onChange={(e) => setCaseForm({ ...caseForm, pdfUrl: e.target.value })} placeholder="PDF URL (optional)" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <button onClick={async () => {
                if (!caseForm.title || !caseForm.slug) return;
                await adminBackend.addCaseStudy(caseForm);
                setCaseForm({ title: '', slug: '', description: '', image: '/images/portfolio-ecommerce.jpg', pdfUrl: '', results: 'Before: Low traffic | After: 5x growth', industry: 'E-Commerce', strategy: 'SEO + PPC' });
                onRefresh();
              }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">
                <Plus className="h-4 w-4" /> Add case study
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {cases.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-black text-white">{entry.title}</h4>
                    <p className="mt-1 text-xs text-slate-400">{entry.industry} • {entry.strategy}</p>
                    <p className="mt-3 text-sm text-slate-500">{entry.description}</p>
                  </div>
                  <button onClick={async () => { await adminBackend.deleteCaseStudy(entry.id); onRefresh(); }} className="rounded-xl bg-slate-950 p-2 text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'testimonials' && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-black text-white">Manage testimonials</h3>
            <div className="mt-4 space-y-3">
              <input value={testForm.client_name} onChange={(e) => setTestForm({ ...testForm, client_name: e.target.value })} placeholder="Client name" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <input value={testForm.company} onChange={(e) => setTestForm({ ...testForm, company: e.target.value })} placeholder="Company" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <textarea rows={4} value={testForm.review} onChange={(e) => setTestForm({ ...testForm, review: e.target.value })} placeholder="Review" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min={1} max={5} value={testForm.rating} onChange={(e) => setTestForm({ ...testForm, rating: Number(e.target.value) })} placeholder="Rating" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
                <input type="number" min={1} value={testForm.displayOrder} onChange={(e) => setTestForm({ ...testForm, displayOrder: Number(e.target.value) })} placeholder="Display order" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={testForm.approved} onChange={(e) => setTestForm({ ...testForm, approved: e.target.checked })} /> Approved</label>
              <button onClick={async () => {
                if (!testForm.client_name || !testForm.review) return;
                await adminBackend.addTestimonial(testForm);
                setTestForm({ client_name: '', company: '', review: '', rating: 5, approved: true, displayOrder: 1 });
                onRefresh();
              }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">
                <Plus className="h-4 w-4" /> Add testimonial
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {testimonials.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white">{entry.client_name}</h4>
                      {entry.approved && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Approved</span>}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{entry.company} • {entry.rating}★ • Order {entry.displayOrder}</p>
                    <p className="mt-3 text-sm text-slate-500">{entry.review}</p>
                  </div>
                  <button onClick={async () => { await adminBackend.deleteTestimonial(entry.id); onRefresh(); }} className="rounded-xl bg-slate-950 p-2 text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
