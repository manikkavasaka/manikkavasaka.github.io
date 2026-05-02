import { useEffect, useState } from 'react';
import { MessageCircle, Mail, MessageSquare, X, CheckCircle2 } from 'lucide-react';
import { Notification } from '../../db/automationDB';

interface NotificationToastProps {
  notifications: Notification[];
  onClose: () => void;
}

export default function NotificationToast({ notifications, onClose }: NotificationToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5 text-emerald-400" />;
      case 'email':
        return <Mail className="h-5 w-5 text-blue-400" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5 text-amber-400" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-indigo-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'whatsapp': return 'WhatsApp';
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      default: return type;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'whatsapp': return 'border-emerald-500/30 bg-emerald-950/40';
      case 'email': return 'border-blue-500/30 bg-blue-950/40';
      case 'sms': return 'border-amber-500/30 bg-amber-950/40';
      default: return 'border-slate-500/30 bg-slate-950/40';
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3 animate-slide-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-white" />
            <span className="text-sm font-bold text-white">Automation Triggered!</span>
          </div>
          <button onClick={() => { setVisible(false); setTimeout(onClose, 500); }} className="text-white/80 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notification Items */}
        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
          {notifications.map((notif) => (
            <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl border ${getColor(notif.type)}`}>
              <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{getLabel(notif.type)}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">✓ Sent</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">To: {notif.recipient}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{notif.message.substring(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50">
          <p className="text-[10px] text-slate-500 text-center">
            {notifications.length} notification{notifications.length > 1 ? 's' : ''} sent successfully via automation
          </p>
        </div>
      </div>
    </div>
  );
}
