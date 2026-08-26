import React from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Vote, 
  ShoppingBag, 
  UserPlus, 
  ShieldAlert, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Notification, User } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-current" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'vote':
        return <Vote className="w-4 h-4 text-amber-500" />;
      case 'market_inquiry':
        return <ShoppingBag className="w-4 h-4 text-teal-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-sky-500" />;
      case 'system':
        return <ShieldAlert className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            مركز الإشعارات والتنبيهات
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحديثات التفاعل مع منشوراتك واستطلاعات ولايتك وسوقك
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50"
        >
          تحديد الكل كمقروء ✓
        </button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-4 rounded-3xl border transition flex items-start gap-3 cursor-pointer ${
              notif.isRead
                ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60'
                : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300/60 dark:border-emerald-800'
            }`}
          >
            {/* Avatar or Icon */}
            <div className="relative shrink-0">
              {notif.actor ? (
                <img
                  src={notif.actor.avatar}
                  alt={notif.actor.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-emerald-500"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                {getIcon(notif.type)}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {notif.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">{notif.createdAt}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {notif.body}
              </p>

              {notif.actor && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-3 h-3" />
                  <span>ولاية {notif.actor.wilayaName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
