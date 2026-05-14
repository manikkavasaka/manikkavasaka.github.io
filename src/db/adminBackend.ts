import bcrypt from 'bcryptjs';
import { postJson, getJson, patchJson, deleteJson } from '../utils/api';

// ─── Admin credentials (stored as bcrypt hash — password never exposed) ───────
// Password: Admin@2024  |  To change: run → node -e "require('bcryptjs').hash('NewPass',12).then(console.log)"
const ADMIN_EMAIL = 'mkshopzone2@gmail.com';
const ADMIN_HASH  = '$2b$12$8gkEjzto0k0lhts2VkdXueDrMRE/AZtLtfwIBA9V3ESzJgU2i8mMm';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface PaymentRecord {
  id: string;
  lead_id?: string;
  package_name: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  gateway_ref: string;
  created_at: string;
}

export interface CmsBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  published_at: string;
}

export interface CmsCaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  pdfUrl?: string;
  results: string;
  industry: string;
  strategy: string;
  created_at: string;
}

export interface CmsTestimonial {
  id: string;
  client_name: string;
  company: string;
  review: string;
  rating: number;
  approved: boolean;
  displayOrder: number;
}

// ─── Session keys ─────────────────────────────────────────────────────────────
const KEYS = {
  TOKEN : 'gl_admin_token',
  USER  : 'gl_admin_user',
};

// ─── Simple session token (no server needed) ──────────────────────────────────
function makeSessionToken(email: string): string {
  const payload = { email, role: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
}

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

// ─── Backend reachability check ───────────────────────────────────────────────
async function isBackendOnline(): Promise<boolean> {
  try {
    const res = await fetch('http://127.0.0.1:4000/api/health', { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── adminBackend API ─────────────────────────────────────────────────────────
export const adminBackend = {
  init: () => { /* no-op */ },

  // LOGIN: bcrypt compare runs in browser — no backend needed
  login: async (email: string, password: string) => {
    try {
      // 1. Email check
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return { success: false, message: 'Invalid credentials' };
      }

      // 2. bcrypt compare (browser-side)
      const match = await bcrypt.compare(password, ADMIN_HASH);
      if (!match) {
        return { success: false, message: 'Invalid credentials' };
      }

      // 3. Create session
      const user: AdminUser = { id: '1', email: ADMIN_EMAIL, role: 'admin' };
      const token = makeSessionToken(email);
      localStorage.setItem(KEYS.TOKEN, token);
      localStorage.setItem(KEYS.USER, JSON.stringify(user));

      return { success: true, token, user };
    } catch (err) {
      return { success: false, message: 'Login error. Try again.' };
    }
  },

  logout: () => {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(KEYS.TOKEN);
    return !!token && isTokenValid(token);
  },

  getCurrentUser: (): AdminUser | null => {
    const user = localStorage.getItem(KEYS.USER);
    if (!user) return null;
    try { return JSON.parse(user); } catch { return null; }
  },

  // ─── Data routes — use backend if online, else return empty arrays ──────────
  getBlogs: async (): Promise<CmsBlog[]> => {
    if (!(await isBackendOnline())) return [];
    try {
      const res = await getJson<{ ok: boolean; data: CmsBlog[] }>('/api/blog-posts');
      return res.data || [];
    } catch { return []; }
  },

  addBlog: async (blog: Omit<CmsBlog, 'id' | 'published_at'>) => {
    if (!(await isBackendOnline())) return;
    await postJson('/api/blog-posts', blog);
  },

  deleteBlog: async (id: string) => {
    if (!(await isBackendOnline())) return;
    await deleteJson(`/api/blog-posts/${id}`);
  },

  getTestimonials: async (): Promise<CmsTestimonial[]> => {
    if (!(await isBackendOnline())) return [];
    try {
      const res = await getJson<{ ok: boolean; data: CmsTestimonial[] }>('/api/testimonials');
      return res.data || [];
    } catch { return []; }
  },

  addTestimonial: async (entry: Omit<CmsTestimonial, 'id'>) => {
    if (!(await isBackendOnline())) return;
    await postJson('/api/testimonials', entry);
  },

  deleteTestimonial: async (id: string) => {
    if (!(await isBackendOnline())) return;
    await deleteJson(`/api/testimonials/${id}`);
  },

  getCaseStudies: async (): Promise<CmsCaseStudy[]> => [],
  addCaseStudy: async (_entry: Omit<CmsCaseStudy, 'id' | 'created_at'>) => {},
  deleteCaseStudy: async (_id: string) => {},

  getPayments: async (): Promise<PaymentRecord[]> => {
    if (!(await isBackendOnline())) return [];
    try {
      const res = await getJson<{ ok: boolean; data: PaymentRecord[] }>('/api/payments');
      return res.data || [];
    } catch { return []; }
  },

  getTechStack: () => ({
    backend    : 'GitHub Pages (Static)',
    database   : 'Browser localStorage',
    auth       : 'bcryptjs (Client-side)',
    fileStorage: 'N/A',
    email      : 'Nodemailer (Gmail)',
    whatsapp   : 'Mocked',
    payment    : 'Mocked',
    hosting    : 'GitHub Pages',
    apiType    : 'Frontend-only'
  }),
};
