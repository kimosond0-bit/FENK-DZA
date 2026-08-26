import React, { useState } from 'react';
import { 
  Vote, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  MessageSquare, 
  Filter,
  BarChart3,
  Users,
  Lightbulb,
  Building
} from 'lucide-react';
import { Post, User } from '../types';
import { PostCard } from './PostCard';
import { ALGERIA_WILAYAS } from '../data/wilayas';

interface CommunityVoiceViewProps {
  posts: Post[];
  currentUser: User;
  activeWilayaId: number;
  onLikePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onBookmarkPost: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReportPost: (post: Post) => void;
  onTipDZD: (post: Post, amount: number) => void;
  onOpenCreatePoll: () => void;
}

export const CommunityVoiceView: React.FC<CommunityVoiceViewProps> = ({
  posts,
  currentUser,
  activeWilayaId,
  onLikePost,
  onOpenComments,
  onSharePost,
  onBookmarkPost,
  onVotePoll,
  onReportPost,
  onTipDZD,
  onOpenCreatePoll,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'my_wilaya' | 'trending'>('all');

  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === activeWilayaId) || ALGERIA_WILAYAS[56];
  const pollPosts = posts.filter(p => p.pollData || p.category === 'صوت_المجتمع');

  const filteredPolls = pollPosts.filter(p => {
    if (filterType === 'my_wilaya') {
      return p.wilayaId === activeWilayaId || p.wilayaName === currentWilaya.nameAr;
    }
    return true;
  });

  const totalVotesAcrossApp = pollPosts.reduce((acc, p) => {
    return acc + (p.pollData?.options.reduce((s, o) => s + o.votes, 0) || 0);
  }, 0);

  return (
    <div className="space-y-4">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-amber-400/20 text-amber-200 px-3 py-1 rounded-full font-bold border border-amber-400/30 flex items-center gap-1.5 w-fit">
            <Vote className="w-3.5 h-3.5" />
            <span>صوت المجتمع الجزائري 🇩🇿</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2">
            منصة الاستطلاعات والقضايا التنموية المحلية
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            شارك في صنع القرار المحلي! استطلاعات شفافة لكل بلدية وولاية مع تحليل ذكي لاتجاهات الرأي العام بـ Gemini AI.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreatePoll}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>طرح استطلاع رأي جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-bold">إجمالي الأصوات</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {totalVotesAcrossApp.toLocaleString()} صوت
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold">قضايا نشطة</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {pollPosts.length} استطلاع
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
            <Building className="w-4 h-4" />
            <span className="text-xs font-bold">التغطية الوطنية</span>
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
            69 ولاية
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          كل القضايا الوطنية (69 ولاية)
        </button>

        <button
          type="button"
          onClick={() => setFilterType('my_wilaya')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            filterType === 'my_wilaya' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>استطلاعات ولاية {currentWilaya.nameAr}</span>
        </button>
      </div>

      {/* Poll Posts Stream */}
      <div className="space-y-4">
        {filteredPolls.map((post) => (
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
  );
};
