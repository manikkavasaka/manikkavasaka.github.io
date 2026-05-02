import { useEffect, useMemo, useState } from 'react';
import { useRouter } from './router';
import { mockDB } from './db/mockDB';
import { automationDB, Notification } from './db/automationDB';
import { enhancedDB } from './db/enhancedDB';
import { adminBackend } from './db/adminBackend';
import { Lead, Campaign, Service } from './types';

import Hero from './components/landing/Hero';
import Services from './components/landing/Services';
import AboutAndStats from './components/landing/AboutAndStats';
import Portfolio from './components/landing/Portfolio';
import Testimonials from './components/landing/Testimonials';
import Pricing from './components/landing/Pricing';
import Contact from './components/landing/Contact';
import WhatsAppAndPopup from './components/landing/WhatsAppAndPopup';
import SEOAudit from './components/landing/SEOAudit';
import LandingLayout from './components/landing/LandingLayout';
import SocialProofBar from './components/landing/SocialProofBar';
import { getJson } from './utils/api';

import ServicesPage from './components/pages/ServicesPage';
import AboutPage from './components/pages/AboutPage';
import PortfolioPage from './components/pages/PortfolioPage';
import CaseStudyPage from './components/pages/CaseStudyPage';
import TestimonialsPage from './components/pages/TestimonialsPage';
import PricingPage from './components/pages/PricingPage';
import ContactPage from './components/pages/ContactPage';
import ServiceDetailPage from './components/pages/ServiceDetailPage';
import BlogPage from './components/pages/BlogPage';
import BlogPostPage from './components/pages/BlogPostPage';
import FreeAuditPage from './components/pages/FreeAuditPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import NotFoundPage from './components/pages/NotFoundPage';

import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import Campaigns from './components/dashboard/Campaigns';
import Leads from './components/dashboard/Leads';
import ServiceManager from './components/dashboard/ServiceManager';
import AutomationSettingsPanel from './components/dashboard/AutomationSettingsPanel';
import NotificationLog from './components/dashboard/NotificationLog';
import NotificationToast from './components/dashboard/NotificationToast';
import AdminLogin from './components/dashboard/AdminLogin';
import CMSManager from './components/dashboard/CMSManager';
import PaymentsHub from './components/dashboard/PaymentsHub';
import BackendStackPanel from './components/dashboard/BackendStackPanel';

import NewsletterSection from './components/global/NewsletterSection';
import CookieConsent from './components/global/CookieConsent';
import LiveChatWidget from './components/global/LiveChatWidget';
import FloatingContactButtons from './components/global/FloatingContactButtons';

export default function App() {
  const { page, navigate } = useRouter();
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService] = useState('');
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    mockDB.init();
    enhancedDB.init();
    adminBackend.init();
    setIsAdminAuthed(adminBackend.isAuthenticated());
    fetchData();
  }, []);

  useEffect(() => {
    enhancedDB.trackPageView(page);
  }, [page]);

  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (page === 'home') {
      document.title = 'MK ShopZone | SEO, Google Ads, Social Media, Web Design';
      meta?.setAttribute('content', 'MK ShopZone is a full-service digital marketing agency offering SEO, Google Ads, social media marketing, content, email, influencer, video marketing, and website design.');
    }
  }, [page]);

  const fetchData = async () => {
    try {
      const res = await getJson<{ ok: boolean; data: Lead[] }>('/api/leads');
      if (res.ok) setLeads(res.data);
      
      const campaignRes = mockDB.getCampaigns();
      setCampaigns(campaignRes);
      
      const serviceRes = mockDB.getServices();
      setServices(serviceRes);
      
      setNotifications(automationDB.getNotifications());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  const handleNotificationsSent = (notifs: Notification[]) => {
    setToastNotifications(notifs);
    fetchData();
  };

  const servicePageMap: Record<string, string> = useMemo(() => ({
    'SEO Optimization': 'seo',
    'Social Media Marketing': 'social-media',
    'Google Ads (PPC)': 'ppc',
    'Website Development': 'web-dev',
    'Content Marketing': 'content-marketing',
    'Brand Strategy': 'branding',
  }), []);

  const globalOverlays = (
    <>
      <LiveChatWidget />
      <FloatingContactButtons />
      <CookieConsent />
      {toastNotifications.length > 0 && (
        <NotificationToast notifications={toastNotifications} onClose={() => setToastNotifications([])} />
      )}
    </>
  );

  if (page === 'dashboard') {
    if (!isAdminAuthed) {
      return <AdminLogin onLoginSuccess={() => setIsAdminAuthed(true)} />;
    }

    return (
      <>
        <DashboardLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={() => {
            adminBackend.logout();
            setIsAdminAuthed(false);
            navigate('home');
          }}
          notificationCount={notifications.length}
        >
          {activeTab === 'overview' && <Overview leads={leads} campaigns={campaigns} />}
          {activeTab === 'campaigns' && <Campaigns campaigns={campaigns} onRefresh={fetchData} />}
          {activeTab === 'leads' && <Leads leads={leads} onRefresh={fetchData} />}
          {activeTab === 'services' && <ServiceManager services={services} onRefresh={fetchData} />}
          {activeTab === 'cms' && <CMSManager onRefresh={fetchData} />}
          {activeTab === 'payments' && <PaymentsHub onRefresh={fetchData} />}
          {activeTab === 'backend' && <BackendStackPanel />}
          {activeTab === 'notifications' && <NotificationLog notifications={notifications} onRefresh={fetchData} />}
          {activeTab === 'automation' && <AutomationSettingsPanel onRefresh={fetchData} />}
        </DashboardLayout>
        {globalOverlays}
      </>
    );
  }

  let pageView: React.ReactNode;

  switch (page) {
    case 'services':
      pageView = <ServicesPage />;
      break;
    case 'about':
      pageView = <AboutPage />;
      break;
    case 'portfolio':
      pageView = <PortfolioPage />;
      break;
    case 'case-study':
      pageView = <CaseStudyPage />;
      break;
    case 'testimonials':
      pageView = <TestimonialsPage />;
      break;
    case 'pricing':
      pageView = <PricingPage />;
      break;
    case 'contact':
      pageView = <ContactPage />;
      break;
    case 'seo':
    case 'ppc':
    case 'social-media':
    case 'content-marketing':
    case 'email-marketing':
    case 'web-dev':
    case 'influencer-marketing':
    case 'video-marketing':
    case 'local-seo':
    case 'branding':
      pageView = <ServiceDetailPage />;
      break;
    case 'blog':
      pageView = <BlogPage />;
      break;
    case 'blog-post':
      pageView = <BlogPostPage />;
      break;
    case 'free-audit':
      pageView = <FreeAuditPage />;
      break;
    case 'privacy':
      pageView = <PrivacyPage />;
      break;
    case 'terms':
      pageView = <TermsPage />;
      break;
    case 'not-found':
      pageView = <NotFoundPage />;
      break;
    default:
      pageView = (
        <>
          <LandingLayout onNavigateToDashboard={() => navigate('dashboard')}>
            <Hero onGetStarted={() => navigate('contact')} onExploreServices={() => navigate('services')} />
            <SocialProofBar />
            <Services
              onSelectService={(name) => {
                const target = servicePageMap[name] || 'services';
                navigate(target as any);
              }}
            />
            <AboutAndStats />
            <Portfolio />
            <Testimonials />
            <SEOAudit />
            <Pricing onSelectTier={() => navigate('pricing')} />
            <NewsletterSection />
            <Contact selectedService={selectedService} onNotificationsSent={handleNotificationsSent} />
          </LandingLayout>
          <WhatsAppAndPopup
            onSubmit={async (data) => {
              try {
                await postJson('/api/leads', {
                  ...data,
                  company: 'Lead Magnet',
                  serviceInterested: 'Lead Magnet Download',
                  message: 'Downloaded the 2026 Digital Growth Checklist.',
                  budget: 0,
                });
                fetchData();
              } catch (err) {
                console.error('Failed to submit popup lead:', err);
              }
            }}
          />
        </>
      );
      break;
  }

  return (
    <>
      {pageView}
      {globalOverlays}
    </>
  );
}
