import React, { useEffect, useState } from 'react';
import { HakeLogo } from './HakeLogo';
import { Sparkles, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  duration = 2200 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Smooth progress bar simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, duration / 8);

    // Fade out timer
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 400);

    // Completion timer
    const completeTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 text-white transition-opacity duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="w-full flex items-center justify-between z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-300 flex items-center gap-1.5 font-sans">
          <span>🇩🇿</span>
          <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
        </span>
        <button
          type="button"
          onClick={onFinish}
          className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition flex items-center gap-1 focus:outline-none"
        >
          <span>تخطي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Branding & Logo Showcase */}
      <div className="flex flex-col items-center text-center z-10 my-auto animate-in zoom-in-95 duration-700">
        {/* Glowing Logo Aura */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/30 to-emerald-500/30 rounded-3xl blur-xl animate-pulse" />
          <div className="relative p-2 rounded-3xl bg-slate-900/80 border border-sky-400/40 shadow-2xl backdrop-blur-xl scale-110 sm:scale-125">
            <HakeLogo size="xl" showText={false} />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center gap-1 font-sans">
              <span className="text-sky-400">hake</span>
              <span className="text-emerald-400">DZ</span>
            </h1>
            <span className="text-lg sm:text-2xl font-black px-3 py-0.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border border-sky-400/40 text-sky-200">
              حَاكْ ديزاد 🇩🇿
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-sm mx-auto leading-relaxed">
            الشبكة الاجتماعية والتجارية التفاعلية لـ 69 ولاية جزائرية
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-md">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-sky-300 flex items-center gap-1 shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>69 ولاية جزائرية</span>
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-300 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>السوق المحلي بالدينار (DZD)</span>
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-300 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            <span>حسابات موثقة بالهاتف</span>
          </span>
        </div>
      </div>

      {/* Bottom Progress & Registration Transition Notice */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
          <div 
            className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400">
          <span>جاري فتح خانة التسجيل...</span>
          <span className="font-mono text-sky-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
