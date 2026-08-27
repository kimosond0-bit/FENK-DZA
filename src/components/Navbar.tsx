import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  ChevronDown, 
  Sun, 
  Moon, 
  Check, 
  Menu,
  X,
  Compass,
  Building2,
  TrendingUp,
  Plus,
  Volume2,
  VolumeX,
  UserPlus,
  Phone
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { User } from '../types';
import { HakeLogo } from './HakeLogo';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentUser: User;
  activeWilayaId: number;
  onSelectWilaya: (id: number) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  onOpenAIAssistant: () => void;
  onOpenCreatePost: () => void;
  onOpenAuthModal?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeWilayaId,
  onSelectWilaya,
  activeTab,
  onSelectTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  onOpenAIAssistant,
  onOpenCreatePost,
  onOpenAuthModal,
  isDarkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
}) => {
  const [isWilayaModalOpen, setIsWilayaModalOpen] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => sounds.getMutedState());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsSoundMuted(muted);
  };

  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56]; // 57 El Mghair

  const cleanPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '';
  const isOwner = cleanPhone === '0777946398' || cleanPhone === '213777946398' || currentUser.role === 'owner' || currentUser.handle === 'kimo_owner';

  const filteredWilayas = ALGERIA_WILAYAS.filter(
    w => w.nameAr.includes(wilayaSearch) || 
         w.nameFr.toLowerCase().includes(wilayaSearch.toLowerCase()) || 
         w.code.includes(wilayaSearch)
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
          >
            <HakeLogo size="sm" showSubtitle={true} />
          </button>

          {/* Wilaya Selector Badge */}
          <button
            type="button"
            onClick={() => setIsWilayaModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition group"
            title="تغيير الولاية المحددة"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:animate-bounce" />
            <span className="max-w-[110px] sm:max-w-[140px] truncate">
              {currentWilaya.code} - {currentWilaya.nameAr}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن أشخاص، منشورات، لحظات، خدمات بالولاية..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:ring-2 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Quick Create Post Button */}
          <button
            type="button"
            onClick={onOpenCreatePost}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>نشر جديد</span>
          </button>

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 hover:from-amber-500/20 hover:to-teal-500/20 border border-emerald-300/40 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition group"
            title="مساعد ديزاد الذكي"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="hidden lg:inline">مساعد ديزاد</span>
          </button>

          {/* Messages shortcut */}
          <button
            type="button"
            onClick={() => onSelectTab('messages')}
            className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              activeTab === 'messages' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : ''
            }`}
            title="الرسائل"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications shortcut */}
          <button
            type="button"
            onClick={() => onSelectTab('notifications')}
            className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              activeTab === 'notifications' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : ''
            }`}
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Sound Effects Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition ${
              isSoundMuted 
                ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800' 
                : 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
            }`}
            title={isSoundMuted ? 'تفعيل المؤثرات الصوتية (الرسائل، التعليقات، الإعجابات)' : 'كتم المؤثرات الصوتية'}
          >
            {isSoundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border-2 border-emerald-500"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.isVerified && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{currentUser.handle}</p>
                  
                  {currentUser.phone && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-mono" dir="ltr">
                      <Phone className="w-3 h-3 text-cyan-500" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}

                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400">
                    <MapPin className="w-3 h-3" />
                    <span>ولاية {currentUser.wilayaName}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => onSelectTab('profile')}
                    className="w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>ملفي الشخصي</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded-full">{currentUser.reputationPoints} نقطة</span>
                  </button>

                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="w-full text-right px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-slate-700 flex items-center justify-between font-bold"
                    >
                      <span>تسجيل حساب جديد (برقم الهاتف)</span>
                      <UserPlus className="w-4 h-4 text-cyan-500" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectTab('region')}
                    className="w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>منطقتي ({currentWilaya.nameAr})</span>
                    <Compass className="w-4 h-4 text-cyan-500" />
                  </button>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => onSelectTab('admin')}
                      className="w-full text-right px-4 py-2 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center justify-between font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>لوحة تحكم المالك</span>
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-mono">👑</span>
                      </span>
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectTab('marketplace')}
                    className="w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>السوق المحلي بالدينار (DZD)</span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 69 Wilayas Selector Modal */}
      {isWilayaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div 
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  اختر ولايتك (69 ولاية جزائرية 🇩🇿)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  خصص المنشورات والفعاليات والأسواق المحلية حسب منطقتك
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWilayaModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search within Wilayas */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو الرقم (مثلاً: 64، بوسعادة، بريكة، مسعد، وهران، Alger...)"
                  value={wilayaSearch}
                  onChange={(e) => setWilayaSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Wilayas Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredWilayas.map((wilaya) => {
                const isSelected = wilaya.id === activeWilayaId;
                return (
                  <button
                    key={wilaya.id}
                    type="button"
                    onClick={() => {
                      onSelectWilaya(wilaya.id);
                      setIsWilayaModalOpen(false);
                    }}
                    className={`text-right p-3 rounded-2xl border transition-all text-xs flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {wilaya.code}
                        </span>
                        <span className="font-bold text-sm">{wilaya.nameAr}</span>
                      </div>
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {wilaya.nameFr} • {wilaya.region}
                      </p>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Footer info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              تغطي منصة hakeDZ (حَاكْ ديزاد) كامل التراب الوطني عبر الـ 69 ولاية من الشمال إلى أقصى الجنوب الكبير 🇩🇿
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
