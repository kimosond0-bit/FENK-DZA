import React from 'react';
import fenkLogoImg from '../assets/images/fenkdz_logo_1787679338049.jpg';

interface FenkLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FenkLogo: React.FC<FenkLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { img: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { img: 'w-10 h-10', text: 'text-lg', sub: 'text-[10px]' },
    md: { img: 'w-11 h-11', text: 'text-xl', sub: 'text-[11px]' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none transition-all group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Neon Glow Emblem Container */}
      <div className={`relative ${currentSize.img} rounded-2xl overflow-hidden shrink-0 shadow-md shadow-cyan-500/25 border border-cyan-400/50 group-hover:border-cyan-300 group-hover:shadow-cyan-400/40 transition-all duration-300 bg-slate-950`}>
        <img
          src={fenkLogoImg}
          alt="شعار فنك ديزاد fenkDZ"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-300"
        />
        {/* Subtle Neon Light overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-amber-400/15 pointer-events-none rounded-2xl" />
      </div>

      {/* Brand Text Branding */}
      {showText && (
        <div className="text-right flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${currentSize.text} flex items-center`}>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold tracking-tight">fenk</span>
              <span className="text-amber-500 dark:text-amber-400 font-black">DZ</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950/90 dark:to-emerald-950/90 text-cyan-800 dark:text-cyan-300 border border-cyan-300/60 dark:border-cyan-800 shadow-2xs">
              فنك ديزاد 🇩🇿
            </span>
          </div>

          {showSubtitle && (
            <p className={`text-slate-500 dark:text-slate-400 font-medium leading-none mt-1 ${currentSize.sub}`}>
              الشبكة الاجتماعية الجزائرية
            </p>
          )}
        </div>
      )}
    </div>
  );
};
