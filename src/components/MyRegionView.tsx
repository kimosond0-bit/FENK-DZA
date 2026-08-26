import React, { useState } from 'react';
import { 
  MapPin, 
  Sun, 
  CloudSun, 
  Building2, 
  ShoppingBag, 
  Vote, 
  Search, 
  Phone, 
  Check, 
  Plus, 
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Wilaya, Post, MarketplaceItem, BusinessService, LostAndFoundItem, User } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { PostCard } from './PostCard';

interface MyRegionViewProps {
  activeWilayaId: number;
  onSelectWilaya: (id: number) => void;
  posts: Post[];
  marketplaceItems: MarketplaceItem[];
  businesses: BusinessService[];
  lostAndFound: LostAndFoundItem[];
  currentUser: User;
  onLikePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onBookmarkPost: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReportPost: (post: Post) => void;
  onTipDZD: (post: Post, amount: number) => void;
  onOpenCreatePost: () => void;
  onSelectMarketItem: (item: MarketplaceItem) => void;
}

export const MyRegionView: React.FC<MyRegionViewProps> = ({
  activeWilayaId,
  onSelectWilaya,
  posts,
  marketplaceItems,
  businesses,
  lostAndFound,
  currentUser,
  onLikePost,
  onOpenComments,
  onSharePost,
  onBookmarkPost,
  onVotePoll,
  onReportPost,
  onTipDZD,
  onOpenCreatePost,
  onSelectMarketItem,
}) => {
  const [subTab, setSubTab] = useState<'feed' | 'voice' | 'businesses' | 'market' | 'lost_found'>('feed');
  const [lostFoundFilter, setLostFoundFilter] = useState<'all' | 'lost' | 'found'>('all');

  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];

  // Filter items by active Wilaya
  const wilayaPosts = posts.filter(p => p.wilayaId === activeWilayaId || p.wilayaName === currentWilaya.nameAr);
  const wilayaMarket = marketplaceItems.filter(m => m.wilayaId === activeWilayaId || m.wilayaName.includes(currentWilaya.nameAr));
  const wilayaBusinesses = businesses.filter(b => b.wilayaName.includes(currentWilaya.nameAr) || b.wilayaName.includes('69 ولاية') || b.wilayaName.includes('58 ولاية') || b.wilayaName.includes('الجزائر'));
  const wilayaLostFound = lostAndFound.filter(l => l.wilayaName === currentWilaya.nameAr);

  return (
    <div className="space-y-4">
      
      {/* Wilaya Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl border border-emerald-600/30 p-5 sm:p-7">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-black bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                ولاية {currentWilaya.code}
              </span>
              <span className="text-xs bg-emerald-900/60 px-3 py-1 rounded-xl text-emerald-200 font-semibold border border-emerald-500/40">
                إقليم {currentWilaya.region}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>ولاية {currentWilaya.nameAr}</span>
              <span className="text-base sm:text-lg font-normal text-emerald-200">({currentWilaya.nameFr})</span>
            </h1>

            {currentWilaya.landmark && (
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-300 shrink-0" />
                <span>المعالم والخصوصية: {currentWilaya.landmark}</span>
              </p>
            )}

            {/* Municipalities tag strip */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px] text-emerald-200">
              <span className="font-bold">أبرز الدوائر والبلديات:</span>
              {currentWilaya.municipalities.map((m, idx) => (
                <span key={idx} className="bg-emerald-900/50 px-2 py-0.5 rounded-lg">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Weather & Community Status Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 text-center shrink-0 w-full sm:w-auto">
            <div className="flex items-center justify-center gap-2 text-amber-300 mb-1">
              <Sun className="w-6 h-6 animate-spin-slow" />
              <span className="text-2xl font-black text-white font-mono">24°C</span>
            </div>
            <p className="text-[11px] text-emerald-100">طقس مشمس ومعتدل</p>
            <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between gap-3 text-[10px] text-emerald-200">
              <span>{wilayaPosts.length} منشور محلي</span>
              <span>•</span>
              <span>{wilayaMarket.length} إعلانات سوق</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'feed', label: `منشورات ${currentWilaya.nameAr}`, icon: MapPin },
          { id: 'voice', label: 'صوت المجتمع والاستطلاعات', icon: Vote },
          { id: 'businesses', label: 'المحلات والخدمات (FUNK TAXI والمزيد)', icon: Building2 },
          { id: 'market', label: 'سوق الولاية (DZD)', icon: ShoppingBag },
          { id: 'lost_found', label: 'مفقودات وموجودات', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Tab Content */}

      {/* 1. Local Feed */}
      {subTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs text-emerald-900 dark:text-emerald-200 font-bold">
              أنت الآن تتصفح محتوى ولاية {currentWilaya.nameAr} ({currentWilaya.code})
            </span>
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>نشر بالولاية</span>
            </button>
          </div>

          {wilayaPosts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700">
              <MapPin className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">لا توجد منشورات حتى الآن في {currentWilaya.nameAr}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                كن أول من ينشر خبراً أو فكرة أو صورة من ولايتك الجميلة!
              </p>
              <button
                type="button"
                onClick={onOpenCreatePost}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md"
              >
                إنشاء أول منشور في {currentWilaya.nameAr}
              </button>
            </div>
          ) : (
            wilayaPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLikePost}
                onOpenComments={onOpenComments}
                onShare={onSharePost}
                onBookmark={onBookmarkPost}
                onVotePoll={onVotePoll}
                onReport={onReportPost}
                onTipDZD={onTipDZD}
              />
            ))
          )}
        </div>
      )}

      {/* 2. Community Voice */}
      {subTab === 'voice' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-3xl border border-amber-200 dark:border-amber-800/60">
            <h3 className="font-bold text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Vote className="w-5 h-5 text-amber-600" />
              صوت المجتمع في ولاية {currentWilaya.nameAr}
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
              مساحة ديمقراطية مخصصة لسكان الولاية لمناقشة المشاريع التنموية، واقتراح التحسينات، والتصويت على القضايا المحلية.
            </p>
          </div>

          {posts.filter(p => p.pollData).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={onLikePost}
              onOpenComments={onOpenComments}
              onShare={onSharePost}
              onBookmark={onBookmarkPost}
              onVotePoll={onVotePoll}
              onReport={onReportPost}
              onTipDZD={onTipDZD}
            />
          ))}
        </div>
      )}

      {/* 3. Businesses Directory (FUNK TAXI & Local Shops) */}
      {subTab === 'businesses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wilayaBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                        {biz.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                          {biz.name}
                          {biz.isVerified && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                        </h4>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {biz.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <span>★ {biz.rating}</span>
                      <span className="text-[10px] text-slate-400">({biz.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {biz.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {biz.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{biz.municipality}</span>
                  </div>

                  <a
                    href={`tel:${biz.phone}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>اتصال بالخدمة</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Local Marketplace in DZD */}
      {subTab === 'market' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wilayaMarket.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMarketItem(item)}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                    {item.priceDZD.toLocaleString()} دج
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {item.municipality}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">تفاصيل الإعلان ←</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Lost & Found (مفقودات وموجودات) */}
      {subTab === 'lost_found' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLostFoundFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  lostFoundFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setLostFoundFilter('lost')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  lostFoundFilter === 'lost' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                المفقودات 🔍
              </button>
              <button
                type="button"
                onClick={() => setLostFoundFilter('found')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  lostFoundFilter === 'found' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                الموجودات والمعثور عليها ✨
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wilayaLostFound
              .filter(l => lostFoundFilter === 'all' || l.type === lostFoundFilter)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-xl font-bold ${
                      item.type === 'lost' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {item.type === 'lost' ? 'مفقود ⚠️' : 'معثور عليه (موجود) ✅'}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.rewardDZD && (
                    <div className="mb-3 text-xs bg-amber-50 dark:bg-amber-950 p-2 rounded-xl text-amber-800 dark:text-amber-300 font-bold">
                      مكافأة تقديرية: {item.rewardDZD.toLocaleString()} دج
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {item.municipality}
                    </span>
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      اتصال: {item.contactPhone}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
