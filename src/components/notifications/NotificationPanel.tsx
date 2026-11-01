import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHealthcare } from '../../context/HealthcareContext';
import { PageView } from '../../types';
import { Bell, Check, Trash2, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage: (page: PageView) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  setCurrentPage
}) => {
  const { role, activeUser } = useAuth();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useHealthcare();

  if (!isOpen) return null;

  const userNotifs = notifications.filter(n => 
    n.role === role || n.role === 'ALL' || (activeUser && n.userId === activeUser.id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
      
      {/* Drawer Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-black tracking-tight">
              Healthcare Notifications
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {userNotifs.filter(n => !n.read).length} Unread
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Bell className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold">No notifications available.</p>
            </div>
          ) : (
            userNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  notif.read
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-emerald-50/50 border-emerald-200 shadow-sm ring-1 ring-emerald-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    notif.type === 'EMERGENCY' ? 'text-rose-600' :
                    notif.type === 'RESPONSE' ? 'text-emerald-700' : 'text-sky-700'
                  }`}>
                    {notif.title}
                  </span>

                  <span className="text-[10px] font-bold text-slate-400">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {notif.message}
                </p>

                {notif.actionPage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationAsRead(notif.id);
                      onClose();
                      setCurrentPage(notif.actionPage!);
                    }}
                    className="pt-1 flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => clearAllNotifications(role)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>

          <span className="text-[11px] text-slate-400 font-medium">CareBridge AI Alerts</span>
        </div>

      </div>

    </div>
  );
};
