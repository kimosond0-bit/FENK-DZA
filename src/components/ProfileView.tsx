import React, { useState } from 'react';
import { 
  MapPin, 
  Check, 
  Award, 
  Calendar, 
  Edit3, 
  ShoppingBag, 
  Bookmark, 
  Heart, 
  Coins, 
  ShieldCheck,
  Building,
  Sparkles,
  Phone
} from 'lucide-react';
import { User, Post, MarketplaceItem } from '../types';
import { PostCard } from './PostCard';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  userPosts: Post[];
  userMarketItems: MarketplaceItem[];
  savedPosts: Post[];
  onLikePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onBookmarkPost: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReportPost: (post: Post) => void;
  onTipDZD: (post: Post, amount: number) => void;
  onUpdateBio?: (newBio: string) => void;
  onOpenAuthModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  userPosts,
  userMarketItems,
  savedPosts,
  onLikePost,
  onOpenComments,
  onSharePost,
  onBookmarkPost,
  onVotePoll,
  onReportPost,
  onTipDZD,
  onUpdateBio,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'market' | 'saved' | 'badges'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const isSelf = user.id === currentUser.id;

  const handleSaveBio = () => {
    if (onUpdateBio) onUpdateBio(bioText);
    setIsEditingBio(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Cover & Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 relative bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900">
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold">
              عضو منذ {user.joinedDate}
            </span>
          </div>
        </div>

        {/* User Details & Actions Header */}
        <div className="p-5 sm:p-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            
            {/* Avatar + Main identity */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-2xl bg-white"
                />
                {user.isVerified && (
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-800 shadow">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {user.name}
                  </h1>

                  {user.hasSupremeBadge && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 font-black shadow-md flex items-center gap-1.5 border border-amber-400">
                      <span>👑</span>
                      <span>شارة الفنك العليا (Supreme Badge)</span>
                    </span>
                  )}

                  {user.badge && !user.hasSupremeBadge && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40">
                      {user.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{user.handle}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ولاية {user.wilayaName} ({user.municipality || 'المركز'})</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-700 dark:text-slate-300 font-mono" dir="ltr">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-[11px] font-bold">
                      <Phone className="w-3 h-3" />
                      <span>{user.phone}</span>
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-sans font-bold">موثق بالهاتف ✓</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Edit, Verify, Follow, New Account */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {isSelf ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    تعديل النبذة
                  </button>

                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={onOpenAuthModal}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 text-xs font-bold hover:bg-cyan-100 transition"
                    >
                      تسجيل حساب جديد 📱
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>توثيق الهوية الجزائرية</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
                >
                  متابعة الحساب
                </button>
              )}
            </div>
          </div>

          {/* Bio section */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            {isEditingBio ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveBio}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 text-xs text-slate-700"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                {bioText}
              </p>
            )}
          </div>

          {/* Social Stats Strip */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="block font-black text-sm text-slate-900 dark:text-white font-mono">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">متابعون</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
              <span className="block font-black text-sm text-slate-900 dark:text-white font-mono">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">يتابع</span>
            </div>

            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
              <span className="block font-black text-sm text-amber-600 dark:text-amber-400 font-mono">
                {user.reputationPoints.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">نقاط السمعة</span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
              <span className="block font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                {userPosts.length}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">منشورات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
        {[
          { id: 'posts', label: 'المنشورات', icon: Edit3 },
          { id: 'market', label: `إعلانات السوق (${userMarketItems.length})`, icon: ShoppingBag },
          { id: 'saved', label: `المحفوظات (${savedPosts.length})`, icon: Bookmark },
          { id: 'badges', label: 'الأوسمة والسمعة', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <p className="text-sm font-semibold">لم يقم بنشر أي محتوى بعد</p>
            </div>
          ) : (
            userPosts.map((post) => (
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

      {/* Tab 2: Marketplace items */}
      {activeTab === 'market' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userMarketItems.length === 0 ? (
            <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <p className="text-sm font-semibold">لا توجد إعلانات معروضة حالياً</p>
            </div>
          ) : (
            userMarketItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <img src={item.images[0]} alt={item.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-bold">{item.category}</span>
                    <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                      {item.priceDZD.toLocaleString()} دج
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedPosts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <p className="text-sm font-semibold">لم تقم بحفظ أي منشورات بعد</p>
            </div>
          ) : (
            savedPosts.map((post) => (
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

      {/* Tab 4: Badges & Reputation */}
      {activeTab === 'badges' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            الأوسمة المجتمعية ونظام السمعة
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
                <span>🇩🇿 رائد مجتمعي نشط</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                تمنح للأعضاء الذين يتفاعلون في استطلاعات صوت المجتمع في ولايتهم.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-200">
                <span>🌟 بائع محلي موثوق</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                تمنح للحسابات التجارية التي حققت تقييمات إيجابية في السوق المحلي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 text-right">
            <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              توثيق الحساب بالهوية الوطنية (DZA Verified)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 my-3 leading-relaxed">
              احصل على شارة التوثيق الخضراء وزد من مصداقية متجرك أو نشاطك المجتمعي في ولاية {user.wilayaName}.
            </p>

            <div className="space-y-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-800 dark:text-slate-200">المتطلبات:</span>
                <ul className="list-disc list-inside mt-1 text-slate-600 dark:text-slate-400 space-y-1">
                  <li>بطاقة التعريف الوطنية البيومترية أو السجل التجاري</li>
                  <li>رقم هاتف جزائري مفعل</li>
                  <li>سمعة تتجاوز 100 نقطة</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('تم إرسال طلب التوثيق إلى المشرفين لمراجعته خلال 24 ساعة 🇩🇿');
                  setShowVerificationModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                تقديم طلب التوثيق الآن
              </button>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
