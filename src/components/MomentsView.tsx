import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Music, 
  ChevronUp, 
  ChevronDown,
  Check,
  Plus
} from 'lucide-react';
import { Moment, User } from '../types';

interface MomentsViewProps {
  moments: Moment[];
  currentUser: User;
  onLikeMoment: (momentId: string) => void;
  onShareMoment: (moment: Moment) => void;
}

export const MomentsView: React.FC<MomentsViewProps> = ({
  moments,
  currentUser,
  onLikeMoment,
  onShareMoment,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);

  const activeMoment = moments[currentIndex] || moments[0];

  const handleNext = () => {
    if (currentIndex < moments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (!activeMoment) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-8.5rem)] py-1 select-none">
      
      {/* Container Frame */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[78vh] sm:h-[82vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
        
        {/* Video Player */}
        <div className="absolute inset-0 z-0">
          <video
            key={activeMoment.id}
            src={activeMoment.videoUrl}
            poster={activeMoment.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle Dark Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Top Bar: Category & Wilaya & Sound toggle */}
        <div className="relative z-10 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-600/80 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow">
              {activeMoment.category}
            </span>
            <span className="text-xs bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-white/20">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {activeMoment.wilaya}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 text-white transition border border-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Right Side Social Actions Sidebar */}
        <div className="relative z-10 self-end mr-3 mb-20 flex flex-col items-center gap-4 text-white">
          
          {/* Author Avatar + Follow */}
          <div className="relative group">
            <img
              src={activeMoment.author.avatar}
              alt={activeMoment.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-lg"
            />
            <button
              type="button"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          {/* Like */}
          <button
            type="button"
            onClick={() => onLikeMoment(activeMoment.id)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition"
          >
            <div className={`p-3 rounded-full backdrop-blur-md ${
              activeMoment.isLiked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white'
            }`}>
              <Heart className={`w-5 h-5 ${activeMoment.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs font-bold font-mono drop-shadow">
              {activeMoment.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-mono drop-shadow">
              {activeMoment.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => onShareMoment(activeMoment)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-mono drop-shadow">
              {activeMoment.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => toggleSave(activeMoment.id)}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition"
          >
            <div className={`p-3 rounded-full backdrop-blur-md ${
              savedIds.includes(activeMoment.id) ? 'bg-amber-500 text-white' : 'bg-black/40 text-white'
            }`}>
              <Bookmark className={`w-5 h-5 ${savedIds.includes(activeMoment.id) ? 'fill-current' : ''}`} />
            </div>
          </button>
        </div>

        {/* Bottom Details Overlay */}
        <div className="relative z-10 p-4 sm:p-5 text-white text-right">
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="font-bold text-base drop-shadow-md flex items-center gap-1">
              {activeMoment.author.name}
              {activeMoment.author.isVerified && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </h4>
            <span className="text-xs text-emerald-300 font-mono">@{activeMoment.author.handle}</span>
          </div>

          <h3 className="font-bold text-sm leading-tight drop-shadow mb-1">
            {activeMoment.title}
          </h3>

          <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-2 drop-shadow mb-3">
            {activeMoment.description}
          </p>

          {/* Algerian Sound / Music Track Bar */}
          <div className="flex items-center gap-2 text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl w-fit border border-white/10">
            <Music className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="truncate max-w-[220px] font-medium">{activeMoment.soundTitle}</span>
          </div>
        </div>

        {/* Up / Down Navigation Floating Controls */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white backdrop-blur-md transition shadow"
            title="السابق"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === moments.length - 1}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white backdrop-blur-md transition shadow"
            title="التالي"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 mt-3">
        {moments.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
