import { automationDB, Notification } from '../../db/automationDB';
import { MessageCircle, Mail, MessageSquare, Trash2, Clock, BellRing } from 'lucide-react';

interface NotificationLogProps {
  notifications: Notification[];
  onRefresh: () => void;
}

export default function NotificationLog({ notifications, onRefresh }: NotificationLogProps) {
  const handleClearAll = () => {
    automationDB.clearNotifications();
    onRefresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5 text-emerald-400" />;
      case 'email':
        return <Mail className="h-5 w-5 text-blue-400" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5 text-amber-400" />;
      default:
        return <BellRing className="h-5 w-5 text-indigo-400" />;
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

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'whatsapp': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'email': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'sms': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Stats
  const whatsappCount = notifications.filter(n => n.type === 'whatsapp').length;
  const emailCount = notifications.filter(n => n.type === 'email').length;
  const smsCount = notifications.filter(n => n.type === 'sms').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <BellRing className="h-6 w-6 text-indigo-400" />
            Notification Log
          </h2>
          <p className="text-slate-400 text-sm mt-1">Complete history of all automated WhatsApp, Email & SMS messages sent.</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition self-start"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <MessageCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{whatsappCount}</p>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">WhatsApp</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <Mail className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{emailCount}</p>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <MessageSquare className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{smsCount}</p>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">SMS</span>
        </div>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900">
          <BellRing className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No notifications sent yet. Submit a lead inquiry to trigger automation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4 hover:border-slate-700 transition"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getBadgeColor(notif.type)}`}>
                      {getLabel(notif.type)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    ✓ {notif.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  <span className="text-slate-500 font-semibold">To:</span> {notif.recipient}
                </p>
                <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800/50 whitespace-pre-wrap font-mono leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
