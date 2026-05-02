import { postJson, getJson, patchJson, deleteJson } from '../utils/api';

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

const KEYS = {
  TOKEN: 'gl_admin_token',
  USER: 'gl_admin_user'
};

export const adminBackend = {
  init: () => {
    // No-op for real backend
  },

  login: async (email: string, password: string) => {
    try {
      const response = await postJson<{ ok: boolean; token: string; user: AdminUser; message?: string }>('/api/auth/login', { email, password });
      if (response.ok) {
        localStorage.setItem(KEYS.TOKEN, response.token);
        localStorage.setItem(KEYS.USER, JSON.stringify(response.user));
        return { success: true, token: response.token, user: response.user };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(KEYS.TOKEN);
    if (!token) return false;
    return true;
  },

  getCurrentUser: (): AdminUser | null => {
    const user = localStorage.getItem(KEYS.USER);
    if (!user) return null;
    try { return JSON.parse(user); } catch { return null; }
  },

  getBlogs: async (): Promise<CmsBlog[]> => {
    const res = await getJson<{ ok: boolean; data: CmsBlog[] }>('/api/blog-posts');
    return res.data || [];
  },
  addBlog: async (blog: Omit<CmsBlog, 'id' | 'published_at'>) => {
    await postJson('/api/blog-posts', blog);
  },
  deleteBlog: async (id: string) => {
    await deleteJson(`/api/blog-posts/${id}`);
  },

  getTestimonials: async (): Promise<CmsTestimonial[]> => {
    const res = await getJson<{ ok: boolean; data: CmsTestimonial[] }>('/api/testimonials');
    return res.data || [];
  },
  addTestimonial: async (entry: Omit<CmsTestimonial, 'id'>) => {
    await postJson('/api/testimonials', entry);
  },
  deleteTestimonial: async (id: string) => {
    await deleteJson(`/api/testimonials/${id}`);
  },

  getCaseStudies: async (): Promise<CmsCaseStudy[]> => {
    // Portfolio route not fully implemented in backend yet, using empty array for now
    return [];
  },
  addCaseStudy: async (entry: Omit<CmsCaseStudy, 'id' | 'created_at'>) => {
    // await postJson('/api/portfolio', entry);
  },
  deleteCaseStudy: async (id: string) => {
    // await deleteJson(`/api/portfolio/${id}`);
  },

  getPayments: async (): Promise<PaymentRecord[]> => {
    const res = await getJson<{ ok: boolean; data: PaymentRecord[] }>('/api/payments');
    return res.data || [];
  },

  getTechStack: () => ({
    backend: 'Node.js (Express)',
    database: 'Local JSON Storage',
    auth: 'JWT + bcrypt',
    fileStorage: 'Local',
    email: 'Nodemailer (Gmail)',
    whatsapp: 'Mocked',
    payment: 'Mocked',
    hosting: 'Localhost',
    apiType: 'REST API'
  })
};
