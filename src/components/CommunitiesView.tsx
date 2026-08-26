import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Plus, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { Community, User, Post } from '../types';
import { PostCard } from './PostCard';

interface CommunitiesViewProps {
  communities: Community[];
  currentUser: User;
  onJoinToggle: (communityId: string) => void;
  posts: Post[];
  onLikePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onBookmarkPost: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReportPost: (post: Post) => void;
  onTipDZD: (post: Post, amount: number) => void;
  onOpenCreatePost: () => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  currentUser,
  onJoinToggle,
  posts,
  onLikePost,
  onOpenComments,
  onSharePost,
  onBookmarkPost,
  onVotePoll,
  onReportPost,
  onTipDZD,
  onOpenCreatePost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);

  const categories = ['الكل', 'ولايات', 'تقنية وريادة أعمال', 'تجارة واقتصاد', 'ثقافة وفنون', 'جامعة وطلاب', 'خدمات ونقل'];

  const filteredCommunities = communities.filter((c) => {
    const matchesCat = selectedCategory === 'الكل' || c.category === selectedCategory;
    const matchesSearch = c.name.includes(searchQuery) || c.description.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      
      {/* If viewing a specific community */}
      {activeCommunity ? (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="relative h-44 sm:h-56 bg-gradient-to-r from-emerald-800 to-teal-900">
              <img
                src={activeCommunity.coverImage}
                alt={activeCommunity.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                type="button"
                onClick={() => setActiveCommunity(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black/80 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للمجتمعات</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 -mt-12 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={activeCommunity.avatar || activeCommunity.coverImage || activeCommunity.icon}
                  alt={activeCommunity.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {activeCommunity.name}
                    </h2>
                    {activeCommunity.isOfficial && (
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeCommunity.category} • {activeCommunity.membersCount.toLocaleString()} عضو نشط
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onJoinToggle(activeCommunity.id)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-2xl text-xs font-bold transition shadow ${
                    activeCommunity.isJoined
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {activeCommunity.isJoined ? 'عضو منضم ✓' : 'انضمام للمجتمع +'}
                </button>
                <button
                  type="button"
                  onClick={onOpenCreatePost}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100"
                >
                  نشر هنا
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
              {activeCommunity.description}
            </div>
          </div>

          {/* Community Feed */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white px-2">
              منشورات مجتمع {activeCommunity.name}
            </h3>
            {posts.slice(0, 3).map((post) => (
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
        </div>
      ) : (
        <>
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                نوادي ومجموعات الجزائر 🇩🇿
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-2">
                مجتمعات ديزاد التفاعلية
              </h2>
              <p className="text-xs text-teal-100 mt-1 max-w-lg">
                انضم لمجموعات التخصص، ورواد الأعمال، وأبناء ولايتك لتبادل الخبرات والفرص.
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن مجتمع أو نادي بالاسم أو التخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={community.avatar || community.coverImage || community.icon}
                        alt={community.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                          {community.name}
                          {community.isOfficial && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                        </h4>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {community.category}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {community.membersCount.toLocaleString()} عضو
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                    {community.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCommunity(community)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    تصفح المنشورات ←
                  </button>

                  <button
                    type="button"
                    onClick={() => onJoinToggle(community.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      community.isJoined
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                    }`}
                  >
                    {community.isJoined ? 'منضم ✓' : 'انضمام +'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
