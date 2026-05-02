export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceInterested: string;
  message: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Lost';
  date: string;
  budget: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Google' | 'Facebook' | 'LinkedIn' | 'Instagram' | 'TikTok';
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  startDate: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  category: 'SEO' | 'PPC' | 'Social' | 'Content' | 'Design' | 'Email' | 'Video' | 'Influencer' | 'Local';
  includes: string[];
}

export interface SEOReport {
  score: number;
  url: string;
  metrics: {
    title: string;
    score: number;
    description: string;
    status: 'good' | 'warning' | 'critical';
  }[];
  recommendations: string[];
}
