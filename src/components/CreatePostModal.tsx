import React, { useState } from 'react';
import { 
  X, 
  Image, 
  Mic, 
  Vote, 
  Sparkles, 
  MapPin, 
  Tag, 
  DollarSign, 
  Radio, 
  Check, 
  Plus, 
  Trash2,
  Loader2,
  Wand2
} from 'lucide-react';
import { User, Post, PostCategory, PollData } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';

interface CreatePostModalProps {
  currentUser: User;
  activeWilayaId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  activeWilayaId,
  isOpen,
  onClose,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('عام');
  const [selectedWilayaId, setSelectedWilayaId] = useState<number>(activeWilayaId);
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'poll' | 'audio'>('text');
  
  // Image attachments
  const [imageUrl, setImageUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  
  // Audio state simulation
  const [isRecording, setIsRecording] = useState(false);
  const [audioDuration, setAudioDuration] = useState('01:30');
  const [hasRecordedAudio, setHasRecordedAudio] = useState(false);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['نعم، أؤيد بشدة', 'لا، أفضل خياراً بديلاً']);
  const [isCommunityIssue, setIsCommunityIssue] = useState(false);

  // Marketplace details
  const [priceDZD, setPriceDZD] = useState<string>('');

  // AI Refine states
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiStyle, setAiStyle] = useState<'formal' | 'market' | 'community' | 'darija_polished'>('formal');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentWilaya = ALGERIA_WILAYAS.find(w => w.id === selectedWilayaId) || ALGERIA_WILAYAS[15];

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setMediaUrls([...mediaUrls, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, `خيار ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // AI Polish Text Function
  const handleAIRefine = async () => {
    if (!content.trim()) return;
    setIsAILoading(true);
    try {
      const res = await fetch('/api/gemini/refine-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          style: aiStyle,
          wilaya: currentWilaya.nameAr,
        }),
      });
      const data = await res.json();
      if (data.refinedText) {
        setContent(data.refinedText);
        if (data.suggestedHashtags && Array.isArray(data.suggestedHashtags)) {
          setAiSuggestions(data.suggestedHashtags);
        }
      }
    } catch (err) {
      console.error('Error refining post:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0 && !hasRecordedAudio && !pollQuestion) {
      return;
    }

    let pollData: PollData | undefined;
    if (mediaType === 'poll' || pollQuestion) {
      pollData = {
        id: `poll_${Date.now()}`,
        question: pollQuestion || 'استطلاع رأي مجتمعي',
        isCommunityIssue: isCommunityIssue || category === 'صوت_المجتمع',
        wilayaTarget: currentWilaya.nameAr,
        totalVotes: 0,
        options: pollOptions.map((opt, i) => ({
          id: `opt_${i + 1}`,
          text: opt,
          votes: 0,
          voters: []
        }))
      };
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content,
      mediaType: hasRecordedAudio ? 'audio' : (pollData ? 'poll' : (mediaUrls.length > 0 ? 'image' : 'text')),
      mediaUrls,
      wilayaId: selectedWilayaId,
      wilayaName: currentWilaya.nameAr,
      municipality: currentUser.municipality,
      category,
      pollData,
      audioDuration: hasRecordedAudio ? audioDuration : undefined,
      audioWaveform: hasRecordedAudio ? [40, 65, 85, 95, 70, 50, 80, 100, 60, 45, 90, 75, 40] : undefined,
      likes: [],
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      priceDZD: priceDZD ? Number(priceDZD) : undefined,
      createdAt: 'الآن',
      viewsCount: 1,
      tags: aiSuggestions.length > 0 ? aiSuggestions : [`#${currentWilaya.nameAr}`, '#ديزاد_كونكت']
    };

    onSubmitPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-500"
            />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  {category}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <select
                  value={selectedWilayaId}
                  onChange={(e) => setSelectedWilayaId(Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-500 dark:text-slate-400 font-medium focus:outline-none cursor-pointer"
                >
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.id} value={w.id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      ولاية {w.code} - {w.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Main Textarea */}
          <div className="relative">
            <textarea
              rows={4}
              placeholder="ماذا يجري في منطقتك؟ شارك فكرة، خبراً، أو استفساراً مع مجتمع الجزائر 🇩🇿..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 resize-none transition"
            />

            {/* AI Polish Toolbar */}
            <div className="mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-300/40 dark:border-emerald-700/40 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  تحسين المحتوى بـ Gemini AI:
                </span>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as any)}
                  className="text-xs px-2 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="formal">فصحى راقية ومحترفة</option>
                  <option value="market">صياغة إعلان تجاري بالدينار</option>
                  <option value="community">قضية مجتمعية للنقاش</option>
                  <option value="darija_polished">دارجة جزائرية مهذبة</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAIRefine}
                disabled={isAILoading || !content.trim()}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                {isAILoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جار التحسين...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>تحويل الصياغة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              تصنيف المنشور:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['عام', 'صوت_المجتمع', 'منطقتي', 'سوق', 'أخبار_محلية', 'تقنية', 'ثقافة_وتراث', 'وظائف', 'مفقودات'] as PostCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    if (cat === 'صوت_المجتمع') setMediaType('poll');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    category === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Media Modules */}

          {/* 1. Image Attachment */}
          {mediaType === 'image' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                إضافة رابط صورة أو من المعرض:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  إضافة
                </button>
              </div>

              {/* Sample Photo Pickers */}
              <div className="flex gap-2 overflow-x-auto pt-1">
                {[
                  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Sample"
                    onClick={() => setMediaUrls([...mediaUrls, url])}
                    className="w-14 h-14 rounded-xl object-cover cursor-pointer hover:opacity-80 border border-slate-300"
                  />
                ))}
              </div>

              {mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt="Attached" className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500" />
                      <button
                        type="button"
                        onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Poll Builder ("صوت المجتمع") */}
          {(mediaType === 'poll' || category === 'صوت_المجتمع') && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-amber-600" />
                  إنشاء استطلاع رأي (صوت المجتمع)
                </span>
                <label className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCommunityIssue}
                    onChange={(e) => setIsCommunityIssue(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>قضية تنموية محلية</span>
                </label>
              </div>

              <input
                type="text"
                placeholder="اكتب سؤال الاستطلاع (مثلاً: هل تؤيد بناء سوق محلي جديد بالمغير؟)"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              />

              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[idx] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة خيار تصويت آخر</span>
                </button>
              )}
            </div>
          )}

          {/* 3. Audio Recording Simulator */}
          {mediaType === 'audio' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecording(!isRecording);
                    setHasRecordedAudio(true);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition ${
                    isRecording ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {isRecording ? 'جارٍ التسجيل الصوتي...' : (hasRecordedAudio ? 'تم تسجيل المقطع الصوتي' : 'انقر لبدء التسجيل')}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                    المدة: {audioDuration}
                  </p>
                </div>
              </div>

              {hasRecordedAudio && (
                <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold">
                  جاهز للنشر 🎙️
                </span>
              )}
            </div>
          )}

          {/* 4. Price Field for Marketplace */}
          {category === 'سوق' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  السعر بالدينار الجزائري (DZD):
                </label>
                <input
                  type="number"
                  placeholder="مثلاً: 2500 دج"
                  value={priceDZD}
                  onChange={(e) => setPriceDZD(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>
          )}

          {/* Media Switcher Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'image' ? 'text' : 'image')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  mediaType === 'image'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Image className="w-4 h-4 text-emerald-600" />
                <span>صورة</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'audio' ? 'text' : 'audio')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  mediaType === 'audio'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>صوت</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'poll' ? 'text' : 'poll')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  mediaType === 'poll'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Vote className="w-4 h-4 text-amber-500" />
                <span>استطلاع</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition"
            >
              نشر الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
