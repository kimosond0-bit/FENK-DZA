import React from 'react';
import { Home, MapPin, Film, ShoppingBag, MessageSquare, Plus, ShieldCheck } from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { User } from '../types';
import { OWNER_PHONE } from '../data/initialData';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadMessagesCount: number;
  onOpenCreatePost: () => void;
  activeWilayaId: number;
  currentUser?: User;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadMessagesCount,
  onOpenCreatePost,
  activeWilayaId,
  currentUser,
}) => {
  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];
  
  const cleanPhone = currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '';
  const isOwner = cleanPhone === OWNER_PHONE || cleanPhone === `213${OWNER_PHONE.slice(1)}` || currentUser?.role === 'owner' || currentUser?.handle === 'kimo_owner';

  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'region', label: currentWilaya.nameAr, icon: MapPin },
    { id: 'create', label: 'نشر', icon: Plus, isAction: true },
    ...(isOwner ? [{ id: 'admin', label: 'التحكم 👑', icon: ShieldCheck }] : [{ id: 'moments', label: 'لحظات', icon: Film }]),
    { id: 'marketplace', label: 'السوق', icon: ShoppingBag },
    { id: 'messages', label: 'الرسائل', icon: MessageSquare, badge: unreadMessagesCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={onOpenCreatePost}
              className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-600/30 active:scale-95 transition"
              title="نشر جديد"
            >
              <Plus className="w-6 h-6" />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition relative ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5 truncate max-w-[54px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
