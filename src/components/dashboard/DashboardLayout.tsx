import React from 'react';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Briefcase,
  ChevronLeft,
  LogOut,
  Settings,
  BellRing,
  FileText,
  CreditCard,
  Database
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  notificationCount?: number;
}

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  onLogout,
  notificationCount = 0
}: DashboardLayoutProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart2 },
    { id: 'leads', label: 'CRM Leads', icon: Users },
    { id: 'services', label: 'Offerings', icon: Briefcase },
    { id: 'cms', label: 'Blog / CMS', icon: FileText },
    { id: 'payments', label: 'Payments & Lists', icon: CreditCard },
    { id: 'backend', label: 'Backend Stack', icon: Database },
    { id: 'notifications', label: 'Notification Log', icon: BellRing, badge: notificationCount },
    { id: 'automation', label: 'Automation', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 md:flex-row">
      <aside className="flex w-full flex-col justify-between border-b border-slate-800 bg-slate-900 md:w-72 md:flex-shrink-0 md:border-b-0 md:border-r">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                MK ShopZone DB
              </span>
              <span className="rounded border border-indigo-800 bg-indigo-900/50 px-1.5 py-0.5 text-xs text-indigo-400">
                v3.0
              </span>
            </div>
            <button onClick={onLogout} className="rounded-lg p-2 text-slate-400 hover:text-white md:hidden">
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden border-t border-slate-800 p-4 md:block">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Website
          </button>
        </div>
      </aside>

      <main className="max-h-screen flex-1 overflow-y-auto p-4 md:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
