import React, { useState } from 'react';
import { X, Send, Heart, Mic, Check, MapPin } from 'lucide-react';
import { Post, Comment, User } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface CommentsDrawerProps {
  post: Post | null;
  currentUser: User;
  comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, text: string, isVoice?: boolean) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  post,
  currentUser,
  comments,
  isOpen,
  onClose,
  onAddComment,
  onLikeComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleVoiceSend = () => {
    onAddComment(post.id, 'تسجيل صوتي من أحد مواطني المنطقة 🇩🇿', true);
    setIsRecordingVoice(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              التعليقات والنقاشات ({comments.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
              حول منشور {post.author?.name || 'المستخدم'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Mini Summary */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
          <img
            src={post.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={post.author?.name || 'User'}
            className="w-8 h-8 rounded-xl object-cover shrink-0"
          />
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">كن أول من يعلق ويشارك رأيه!</p>
              <p className="text-xs mt-1">النقاش البناء يطور مجتمعنا المحلي 🇩🇿</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3"
              >
                <img
                  src={comment.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={comment.author?.name || 'مستخدم'}
                  className="w-9 h-9 rounded-xl object-cover border border-emerald-400 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {comment.author?.name || 'مستخدم ديزاد'}
                      </span>
                      {comment.author?.isVerified && (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {comment.author?.wilayaName || 'الجزائر'}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                  </div>

                  {comment.audioUrl ? (
                    <AudioPlayer
                      duration={comment.audioDuration || '00:45'}
                      authorName={comment.author?.name || 'مستخدم'}
                    />
                  ) : (
                    <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onLikeComment(comment.id)}
                      className={`text-[11px] font-semibold flex items-center gap-1 transition ${
                        comment.isLiked ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {isRecordingVoice ? (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>جارٍ تسجيل رسالة صوتية (00:25)...</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleVoiceSend}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow"
                >
                  إرسال التسجيل
                </button>
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition"
                title="تسجيل رد صوتي"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder="اكتب تعليقك أو استفسارك هنا..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-md transition"
              >
                <Send className="w-5 h-5 -rotate-90" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
