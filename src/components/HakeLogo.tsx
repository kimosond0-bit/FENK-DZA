import React from 'react';

interface HakeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HakeLogo: React.FC<HakeLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { emblem: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]', badge: 'text-[9px] px-1 py-0.2' },
    sm: { emblem: 'w-9 h-9', text: 'text-base sm:text-lg', sub: 'text-[10px]', badge: 'text-[10px] px-1.5 py-0.5' },
    md: { emblem: 'w-11 h-11', text: 'text-xl', sub: 'text-[11px]', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { emblem: 'w-14 h-14', text: 'text-2xl sm:text-3xl', sub: 'text-xs', badge: 'text-xs px-2 py-0.5' },
    xl: { emblem: 'w-20 h-20', text: 'text-3xl sm:text-4xl', sub: 'text-sm', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none transition-all group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Official hake dz Vector Emblem (Interlocking Dialogue People) */}
      <div className={`relative ${currentSize.emblem} rounded-2xl p-1 shrink-0 bg-gradient-to-tr from-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border border-sky-200/80 dark:border-sky-800/60 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="hakeBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="hakeGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="hakeWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Left Speech Bubble / Avatar (Blue) */}
          <circle cx="34" cy="26" r="6" fill="url(#hakeBlueGrad)" />
          <path 
            d="M 38 34 C 24 34 16 43 16 54 C 16 63 21 68 28 71 L 22 81 L 34 76 C 36 76.5 39 77 42 77 C 46 77 49 76.2 52 74.8 C 45 68 44 52 49 43 C 46 37 42 34 38 34 Z" 
            fill="url(#hakeBlueGrad)" 
          />

          {/* Right Speech Bubble / Avatar (Green) */}
          <circle cx="66" cy="24" r="6.5" fill="url(#hakeGreenGrad)" />
          <path 
            d="M 62 33 C 58 33 54 35 51 38 C 54 48 53 62 58 70 C 62 74 67 75 72 75 C 75 75 78 74.5 80 73.8 L 88 80 L 84 69 C 89 65 91 59 91 52 C 91 41 81 33 62 33 Z" 
            fill="url(#hakeGreenGrad)" 
          />

          {/* Dynamic Interconnecting Human Ribbon / Swirl */}
          <path 
            d="M 30 76 C 34 68 37 56 46 48 C 55 40 68 32 78 27 C 76 34 68 45 59 55 C 50 65 42 74 30 76 Z" 
            fill="url(#hakeWaveGrad)" 
          />
          <circle cx="50" cy="18" r="7" fill="url(#hakeWaveGrad)" />
          <path 
            d="M 44 29 C 48 27 52 27 56 29 C 53 36 49 46 46 58 C 42 52 43 38 44 29 Z" 
            fill="url(#hakeBlueGrad)" 
          />
        </svg>
      </div>

      {/* Brand Text Branding */}
      {showText && (
        <div className="text-right flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${currentSize.text} flex items-center gap-0.5`}>
              <span className="text-sky-600 dark:text-sky-400 font-extrabold font-sans">hake</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black font-sans">DZ</span>
            </span>
            <span className={`font-black rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-950/90 dark:to-emerald-950/90 text-sky-800 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800 shadow-2xs ${currentSize.badge}`}>
              حَاكْ ديزاد 🇩🇿
            </span>
          </div>

          {showSubtitle && (
            <p className={`text-slate-500 dark:text-slate-400 font-medium leading-none mt-1 ${currentSize.sub}`}>
              الشبكة الاجتماعية والتجارية الجزائرية
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Backwards compatibility export
export const FenkLogo = HakeLogo;
