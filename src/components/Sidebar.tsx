import React from 'react';
import { 
  Home, 
  MapPin, 
  Vote, 
  Film, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  Award,
  Crown,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import { User } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  activeWilayaId: number;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
  onOpenAIAssistant: () => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  activeWilayaId,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenCreatePost,
  onOpenAIAssistant,
  onOpenAuthModal,
}) => {
  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];

  const cleanPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '';
  const isOwner = cleanPhone === '0777946398' || cleanPhone === '213777946398' || currentUser.role === 'owner' || currentUser.handle === 'kimo_owner';

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, badge: null },
    { id: 'region', label: `منطقتي (${currentWilaya.nameAr})`, icon: MapPin, badge: '69 ولاية' },
    { id: 'voice', label: 'صوت المجتمع', icon: Vote, badge: 'استطلاعات' },
    { id: 'moments', label: 'لحظات (Reels)', icon: Film, badge: 'جديد' },
    { id: 'communities', label: 'المجتمعات', icon: Users, badge: null },
    { id: 'marketplace', label: 'السوق المحلي (DZD)', icon: ShoppingBag, badge: 'دج' },
    { id: 'messages', label: 'المحادثات', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : null },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null },
    { id: 'profile', label: 'ملفي الشخصي', icon: Award, badge: null },
    ...(isOwner ? [{ id: 'admin', label: 'لوحة تحكم المالك 👑', icon: ShieldCheck, badge: 'المالك' }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] pb-4 overflow-y-auto select-none">
      
      {/* User Mini Profile Card */}
      <div 
        onClick={() => onSelectTab('profile')}
        className="p-3.5 mb-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-emerald-400 transition cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate flex items-center gap-1">
              {currentUser.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{currentUser.handle}</p>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">ولاية {currentUser.wilayaName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1 bg-white dark:bg-slate-800/90 rounded-2xl p-2 border border-slate-200 dark:border-slate-700/80 shadow-sm flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : typeof item.badge === 'number'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Assistant Quick Trigger */}
        <button
          type="button"
          onClick={onOpenAIAssistant}
          className="w-full mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30 dark:border-emerald-700/40 hover:opacity-90 transition"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin-slow" />
            <span>مساعد ديزاد الذكي</span>
          </div>
          <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md">Gemini</span>
        </button>
      </div>

      {/* Quick Action Button: New Post */}
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={onOpenCreatePost}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-98 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>إنشاء منشور أو استطلاع</span>
        </button>

        {onOpenAuthModal && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-bold text-xs shadow-2xs transition"
          >
            <UserPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>تسجيل حساب جديد (برقم الهاتف)</span>
          </button>
        )}
      </div>

      {/* Commercial & Algerian Identity Footer */}
      <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-b from-slate-50 to-cyan-50/30 dark:from-slate-800/60 dark:to-cyan-950/20 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 text-center shadow-xs">
        <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
          <span className="text-sky-600 dark:text-sky-400 font-black">hakeDZ</span>
          <span>•</span>
          <span>حَاكْ ديزاد 🇩🇿</span>
          <span>•</span>
          <span>69 ولاية</span>
        </p>
        <p className="text-[10px] mt-1 text-slate-500 dark:text-slate-400">الشبكة الاجتماعية والتجارية الجزائرية</p>
      </div>
    </aside>
  );
};
