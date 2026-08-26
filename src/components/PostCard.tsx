import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MapPin, 
  Check, 
  MoreHorizontal, 
  Vote, 
  Sparkles, 
  DollarSign, 
  Phone, 
  ExternalLink,
  Flag,
  Award,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { Post, User } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onShare: (post: Post) => void;
  onBookmark: (postId: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onReport: (post: Post) => void;
  onTipDZD: (post: Post, amount: number) => void;
  onSelectUser?: (user: User) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onOpenComments,
  onShare,
  onBookmark,
  onVotePoll,
  onReport,
  onTipDZD,
  onSelectUser,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(200);

  const isLiked = post.likes.includes(currentUser.id);
  const totalVotes = post.pollData ? post.pollData.options.reduce((acc, curr) => acc + curr.votes, 0) : 0;

  const handleTip = () => {
    onTipDZD(post, selectedTipAmount);
    setShowTipModal(false);
  };

  return (
    <article className="bg-white dark:bg-slate-800/90 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition mb-4 overflow-hidden">
      
      {/* Post Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectUser && onSelectUser(post.author)}
            className="relative group focus:outline-none"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 group-hover:scale-105 transition"
            />
            {post.author.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 
                onClick={() => onSelectUser && onSelectUser(post.author)}
                className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 cursor-pointer"
              >
                {post.author.name}
              </h4>

              {post.author.hasSupremeBadge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-xs flex items-center gap-1">
                  <span>👑</span>
                  <span>الشارة العليا</span>
                </span>
              )}

              {post.author.badge && !post.author.hasSupremeBadge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  {post.author.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-mono text-[11px]">@{post.author.handle}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <MapPin className="w-3 h-3" />
                {post.wilayaName || post.author.wilayaName}
              </span>
              <span>•</span>
              <span className="text-[11px]">{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Category Badge & Menu */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] px-2.5 py-1 rounded-xl font-bold ${
            post.category === 'صوت_المجتمع'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40'
              : post.category === 'سوق'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {post.category.replace('_', ' ')}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute left-0 mt-1 w-44 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-20"
                onClick={() => setIsMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsBookmarked(!isBookmarked);
                    onBookmark(post.id);
                  }}
                  className="w-full text-right px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center justify-between"
                >
                  <span>{isBookmarked ? 'إلغاء الحفظ' : 'حفظ المنشور'}</span>
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowTipModal(true)}
                  className="w-full text-right px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center justify-between font-bold"
                >
                  <span>دعم الكاتب بالدينار 🇩🇿</span>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                </button>

                <button
                  type="button"
                  onClick={() => onReport(post)}
                  className="w-full text-right px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 flex items-center justify-between"
                >
                  <span>إبلاغ عن محتوى</span>
                  <Flag className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Text Content */}
      <div className="mb-3.5 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line">
        {post.content}
      </div>

      {/* Commercial / Price Callout */}
      {post.priceDZD && (
        <div className="mb-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">السعر المعروض:</span>
              <p className="text-base font-black text-emerald-700 dark:text-emerald-400">
                {post.priceDZD.toLocaleString()} دج (DZD)
              </p>
            </div>
          </div>

          {post.author.phone && (
            <a
              href={`tel:${post.author.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>اتصال / حجز</span>
            </a>
          )}
        </div>
      )}

      {/* Media Type 1: Audio Note */}
      {post.mediaType === 'audio' && (
        <AudioPlayer
          duration={post.audioDuration}
          waveform={post.audioWaveform}
          authorName={post.author.name}
        />
      )}

      {/* Media Type 2: Poll ("صوت المجتمع") */}
      {post.pollData && (
        <div className="my-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Vote className="w-4 h-4 text-amber-500" />
              {post.pollData.question}
            </h5>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              {totalVotes} صوت
            </span>
          </div>

          {/* Poll Options with Progress */}
          <div className="space-y-2">
            {post.pollData.options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              const hasVotedThis = post.pollData?.userVotedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onVotePoll(post.id, option.id)}
                  className={`w-full text-right p-3 rounded-2xl border transition-all relative overflow-hidden group ${
                    hasVotedThis
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400'
                  }`}
                >
                  {/* Progress bar fill */}
                  <div
                    className={`absolute top-0 bottom-0 right-0 opacity-15 transition-all duration-500 ${
                      hasVotedThis ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      {hasVotedThis && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {option.text}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                      {percentage}% ({option.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Community Insight Analysis */}
          {post.pollData.aiAnalysis && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{post.pollData.aiAnalysis}</p>
            </div>
          )}
        </div>
      )}

      {/* Media Type 3: Images Gallery */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="my-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {post.mediaUrls.length === 1 ? (
            <img
              src={post.mediaUrls[0]}
              alt="Post attachment"
              className="w-full max-h-96 object-cover hover:scale-[1.01] transition duration-300 cursor-pointer"
              onClick={() => onOpenComments(post)}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900">
              {post.mediaUrls.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i}`}
                  className="w-full h-48 object-cover rounded-xl hover:opacity-90 cursor-pointer transition"
                  onClick={() => onOpenComments(post)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hashtags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Action Footer Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-600 dark:text-slate-300 text-xs font-semibold">
        
        {/* Like Button */}
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
            isLiked
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-bold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
          <span>{post.likes.length}</span>
        </button>

        {/* Comments Button */}
        <button
          type="button"
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>{post.commentsCount} تعليق</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => onShare(post)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Share2 className="w-4 h-4 text-sky-500" />
          <span>مشاركة</span>
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={() => {
            setIsBookmarked(!isBookmarked);
            onBookmark(post.id);
          }}
          className={`p-2 rounded-xl transition ${
            isBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400'
          }`}
          title="حفظ المنشور"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* DZD Tip Creator Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                دعم المحتوى بالدينار الجزائري (DZD)
              </h4>
              <button
                type="button"
                onClick={() => setShowTipModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 my-3">
              تشجيع الكاتب <span className="font-bold text-slate-800 dark:text-slate-200">@{post.author.handle}</span> للاستمرار في إثراء المحتوى المجتمعي 🇩🇿
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedTipAmount(amt)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    selectedTipAmount === amt
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {amt} دج
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleTip}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              >
                إرسال {selectedTipAmount} دج
              </button>
              <button
                type="button"
                onClick={() => setShowTipModal(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
