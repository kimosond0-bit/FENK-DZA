import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Mic } from 'lucide-react';

interface AudioPlayerProps {
  duration?: string;
  waveform?: number[];
  authorName?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  duration = '01:15',
  waveform = [30, 45, 75, 90, 60, 40, 85, 95, 70, 50, 65, 80, 45, 90, 100, 75, 50, 35, 60],
  authorName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 my-2 flex items-center gap-3">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md transition shrink-0"
        title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الرسالة الصوتية'}
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-1.5">
          <span className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {authorName ? `تسجيل صوتي من ${authorName}` : 'رسالة صوتية'}
          </span>
          <span className="font-mono text-[11px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-300">
            {duration}
          </span>
        </div>

        {/* Dynamic Waveform Bars */}
        <div 
          className="flex items-center gap-1 h-7 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(Math.max(0, Math.min(100, Math.round((1 - clickPos) * 100))));
          }}
        >
          {waveform.map((height, i) => {
            const barProgress = (i / waveform.length) * 100;
            const isFilled = barProgress <= progress;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-emerald-600 dark:bg-emerald-400 scale-y-110'
                    : 'bg-emerald-200 dark:bg-emerald-800/80 hover:bg-emerald-300'
                }`}
                style={{ height: `${Math.max(20, height)}%` }}
              />
            );
          })}
        </div>
      </div>

      <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 hidden sm:block opacity-75" />
    </div>
  );
};
