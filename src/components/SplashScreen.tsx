import React, { useEffect, useState } from 'react';
import { HakeLogo } from './HakeLogo';
import { Sparkles, MapPin, ShieldCheck, ArrowLeft, Heart, ShoppingBag, Radio } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  duration = 2600 
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(12);
  const [currentStepText, setCurrentStepText] = useState('تهيئة الخوادم والشبكة الجزائرية...');

  useEffect(() => {
    // Step status updates based on progress
    const stepInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 12;
        if (next >= 100) {
          clearInterval(stepInterval);
          setCurrentStepText('مرحباً بك! جاري فتح نافذة التسجيل...');
          return 100;
        }
        if (next > 70) {
          setCurrentStepText('تجهيز فضاء التسجيل الآمن برقم الهاتف...');
        } else if (next > 40) {
          setCurrentStepText('تحميل ولايات الوطن الـ 69 والأسواق المحلية...');
        } else {
          setCurrentStepText('تهيئة الخوادم والشبكة الجزائرية...');
        }
        return next;
      });
    }, duration / 9);

    // Fade out timer
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 400);

    // Completion timer
    const completeTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onFinish]);

  const handleSkip = () => {
    sounds.playPop();
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white transition-opacity duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="w-full flex items-center justify-between z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="text-[11px] sm:text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 flex items-center gap-2 font-sans shadow-sm">
          <span className="text-base leading-none">🇩🇿</span>
          <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
        </span>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-bold text-emerald-300 hover:text-white px-3.5 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition flex items-center gap-1.5 focus:outline-none shadow-sm"
        >
          <span>تخطي والدخول</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Branding & Logo Showcase */}
      <div className="flex flex-col items-center text-center z-10 my-auto animate-in zoom-in-95 duration-700 max-w-lg">
        {/* Glowing Logo Aura */}
        <div className="relative mb-5">
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/40 via-teal-500/30 to-sky-500/40 rounded-3xl blur-2xl animate-pulse" />
          <div className="relative p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-emerald-400/40 shadow-2xl backdrop-blur-xl scale-110 sm:scale-125">
            <HakeLogo size="xl" showText={false} />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center gap-1 font-sans">
              <span className="text-sky-400">hake</span>
              <span className="text-emerald-400">DZ</span>
            </h1>
            <span className="text-lg sm:text-2xl font-black px-3.5 py-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-200 shadow-inner">
              حَاكْ ديزاد 🇩🇿
            </span>
          </div>

          {/* Algerian Warm Welcoming Message */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-base sm:text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
              <span>مرحباً بيك في دارك ومطرحك يا بن بلادي</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
              الفضاء الرقمي الجزائري 100% للتواصل، التعبير الحر، والتجارة المحلية بالدينار عبر كافة ربوع الوطن (69 ولاية).
            </p>
          </div>
        </div>

        {/* Feature Highlights Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 w-full max-w-md">
          <div className="p-2 rounded-2xl bg-slate-900/70 border border-emerald-500/30 text-right flex flex-col justify-between">
            <MapPin className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] font-bold text-emerald-300">69 ولاية</span>
            <span className="text-[9px] text-slate-400">من المغير لتمنراست</span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-900/70 border border-amber-500/30 text-right flex flex-col justify-between">
            <ShoppingBag className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] font-bold text-amber-300">سوق بالدينار</span>
            <span className="text-[9px] text-slate-400">بيع وشراء (DZD)</span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-900/70 border border-sky-500/30 text-right flex flex-col justify-between">
            <Radio className="w-4 h-4 text-sky-400 mb-1" />
            <span className="text-[11px] font-bold text-sky-300">صوت الشعب</span>
            <span className="text-[9px] text-slate-400">استطلاعات ورسائل</span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-900/70 border border-teal-500/30 text-right flex flex-col justify-between">
            <ShieldCheck className="w-4 h-4 text-teal-400 mb-1" />
            <span className="text-[11px] font-bold text-teal-300">أمان وموثوقية</span>
            <span className="text-[9px] text-slate-400">برقم الهاتف +213</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress & Registration Transition Notice */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2.5 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-xs text-slate-300 px-1 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>{currentStepText}</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

