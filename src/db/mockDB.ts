import { Lead, Campaign, Service } from '../types';

const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Search Engine Optimization (SEO)',
    description: 'Boost your organic visibility, optimize landing pages, and drive compounding traffic month-over-month.',
    price: '₹24,999/mo',
    icon: 'Search',
    category: 'SEO',
    includes: ['SEO Audit', 'Keyword Research', 'On-page SEO', 'Monthly Reporting']
  },
  {
    id: 's2',
    title: 'Pay-Per-Click Advertising (PPC)',
    description: 'High-intent Google Ads campaigns that deliver immediate, trackable revenue and ROI.',
    price: '₹39,999/mo',
    icon: 'MousePointer',
    category: 'PPC',
    includes: ['Campaign Setup', 'Ad Copywriting', 'Bid Optimization', 'Weekly Reports']
  },
  {
    id: 's3',
    title: 'Social Media Marketing',
    description: 'Engage audiences across Meta, LinkedIn, Instagram, and TikTok with full-funnel campaigns.',
    price: '₹29,999/mo',
    icon: 'Megaphone',
    category: 'Social',
    includes: ['Content Calendar', 'Reels & Posts', 'Community Management', 'Analytics']
  },
  {
    id: 's4',
    title: 'Content Strategy & Creation',
    description: 'High-quality thought leadership articles, infographics, and conversion-focused content.',
    price: '₹18,999/mo',
    icon: 'FileText',
    category: 'Content',
    includes: ['Blog Articles', 'Content Calendar', 'SEO Writing', 'Performance Tracking']
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Sarah Jenkins',
    email: 'sarah@apextech.com',
    company: 'Apex Tech Solutions',
    phone: '555-0199',
    serviceInterested: 'Search Engine Optimization (SEO)',
    message: 'We are looking to scale our organic traffic and rank for high-intent B2B SaaS keywords.',
    status: 'New',
    date: '2026-03-01',
    budget: 5000
  },
  {
    id: 'l2',
    name: 'Michael Chen',
    email: 'm.chen@urbanfit.com',
    company: 'UrbanFit Apparel',
    phone: '555-0144',
    serviceInterested: 'Pay-Per-Click Advertising (PPC)',
    message: 'Need urgent boost in online checkout conversions for our new athleisure drop.',
    status: 'Contacted',
    date: '2026-02-27',
    budget: 12000
  },
  {
    id: 'l3',
    name: 'Eleanor Vance',
    email: 'eleanor@brightglow.io',
    company: 'BrightGlow Skincare',
    phone: '555-0211',
    serviceInterested: 'Social Media Marketing',
    message: 'Looking to launch a major influencer campaign paired with TikTok advertising.',
    status: 'Converted',
    date: '2026-02-15',
    budget: 8000
  }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'Q1 Google Search - High Intent',
    platform: 'Google',
    status: 'Active',
    budget: 5000,
    spent: 2450,
    clicks: 1420,
    impressions: 22000,
    conversions: 84,
    startDate: '2026-01-10'
  },
  {
    id: 'c2',
    name: 'Facebook Retargeting - Cart Abandoners',
    platform: 'Facebook',
    status: 'Active',
    budget: 3000,
    spent: 1800,
    clicks: 3100,
    impressions: 45000,
    conversions: 112,
    startDate: '2026-01-15'
  },
  {
    id: 'c3',
    name: 'LinkedIn B2B Lead Gen',
    platform: 'LinkedIn',
    status: 'Paused',
    budget: 6000,
    spent: 6000,
    clicks: 850,
    impressions: 15000,
    conversions: 42,
    startDate: '2025-11-01'
  }
];

const STORAGE_KEYS = {
  LEADS: 'dm_leads',
  CAMPAIGNS: 'dm_campaigns',
  SERVICES: 'dm_services'
};

const normalizeService = (service: any): Service => ({
  id: service.id,
  title: service.title,
  description: service.description,
  price: typeof service.price === 'string' ? service.price.replace('$', '₹') : '₹0',
  icon: service.icon || 'Megaphone',
  category: service.category || 'SEO',
  includes: Array.isArray(service.includes) && service.includes.length > 0
    ? service.includes
    : ['Strategy', 'Execution', 'Reporting', 'Support']
});

export const mockDB = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
  },

  getLeads: (): Lead[] => {
    mockDB.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
  },
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>): Lead => {
    const leads = mockDB.getLeads();
    const newLead: Lead = {
      ...lead,
      id: 'l_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    return newLead;
  },
  updateLeadStatus: (id: string, status: Lead['status']): void => {
    const leads = mockDB.getLeads();
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
  },
  deleteLead: (id: string): void => {
    const leads = mockDB.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(filtered));
  },

  getCampaigns: (): Campaign[] => {
    mockDB.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
  },
  addCampaign: (campaign: Omit<Campaign, 'id' | 'spent' | 'clicks' | 'impressions' | 'conversions'>): Campaign => {
    const campaigns = mockDB.getCampaigns();
    const newCampaign: Campaign = {
      ...campaign,
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      spent: 0,
      clicks: 0,
      impressions: 0,
      conversions: 0
    };
    campaigns.unshift(newCampaign);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    return newCampaign;
  },
  updateCampaignStatus: (id: string, status: Campaign['status']): void => {
    const campaigns = mockDB.getCampaigns();
    const updated = campaigns.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
  },
  updateCampaignStats: (id: string, clicks: number, conversions: number, spent: number): void => {
    const campaigns = mockDB.getCampaigns();
    const updated = campaigns.map(c => c.id === id ? {
      ...c,
      spent: c.spent + spent,
      clicks: c.clicks + clicks,
      impressions: c.impressions + (clicks * 12),
      conversions: c.conversions + conversions
    } : c);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
  },
  deleteCampaign: (id: string): void => {
    const campaigns = mockDB.getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(filtered));
  },

  getServices: (): Service[] => {
    mockDB.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]').map(normalizeService);
  },
  addService: (service: Omit<Service, 'id'>): Service => {
    const services = mockDB.getServices();
    const newService: Service = normalizeService({
      ...service,
      id: 's_' + Math.random().toString(36).substr(2, 9)
    });
    services.push(newService);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return newService;
  },
  updateService: (updatedService: Service): void => {
    const services = mockDB.getServices();
    const updated = services.map(s => s.id === updatedService.id ? normalizeService(updatedService) : s);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  },
  deleteService: (id: string): void => {
    const services = mockDB.getServices();
    const filtered = services.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
  }
};
