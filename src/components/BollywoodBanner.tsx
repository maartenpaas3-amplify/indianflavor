import React from 'react';
import { Language } from '../types';

interface BollywoodBannerProps {
  lang: Language;
  onClick: () => void;
  totalRegistered: number;
}

export const BollywoodBanner: React.FC<BollywoodBannerProps> = ({
  lang,
  onClick,
  totalRegistered,
}) => {
  const showCounter = totalRegistered >= 5;
  const target = 20;
  const progressPercent = Math.min(100, Math.round((totalRegistered / target) * 100));

  const text =
    {
      fr: {
        title: "Soirée Bollywood",
        subtitle: "La date sera fixée dès 20 inscrits",
        register: "S'inscrire",
        counter: `${totalRegistered}/20 inscrits`,
      },
      en: {
        title: "Bollywood Night",
        subtitle: "Date set once 20 people register",
        register: "Register",
        counter: `${totalRegistered}/20 registered`,
      },
      ar: {
        title: "أمسية بوليوود",
        subtitle: "سيتم تحديد التاريخ عند الوصول إلى 20 مسجلاً",
        register: "التسجيل",
        counter: `${totalRegistered}/20 مسجلاً`,
      },
    }[lang] || {
      title: "Soirée Bollywood",
      subtitle: "La date sera fixée dès 20 inscrits",
      register: "S'inscrire",
      counter: `${totalRegistered}/20 inscrits`,
    };

  return (
    <div
      onClick={onClick}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="bg-gradient-to-r from-[#131315] via-[#131315] to-[#131315] border-b border-[#C9A15A]/25 text-xs py-1.5 hover:bg-[#1A1A1E] transition-colors cursor-pointer select-none group relative overflow-hidden"
      style={{ paddingTop: 'max(0.35rem, env(safe-area-inset-top))' }}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A15A]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-5 flex-wrap">
        {/* Icon & 2 Text Lines */}
        <div className="flex items-center gap-2.5 text-left rtl:text-right">
          <div className="w-[58px] md:w-[68px] shrink-0 flex items-center justify-center">
            <span className="text-base sm:text-lg">🎬</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xs sm:text-sm text-white font-serif-luxury tracking-wide">
              {text.title}
            </span>
            <span className="text-[11px] sm:text-xs text-[#C9A15A]/90 font-medium">
              {text.subtitle}
            </span>
          </div>
        </div>

        {/* Counter if threshold reached */}
        {showCounter && (
          <div className="inline-flex items-center gap-2 bg-black/60 border border-[#C9A15A]/40 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-[#C9A15A]">
            <span>{text.counter}</span>
            <div className="w-10 h-1.5 bg-black rounded-full overflow-hidden border border-[#C9A15A]/30 inline-block">
              <div
                className="h-full bg-gradient-to-r from-[#C9A15A] to-[#E8D4A8] rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Solid Gold Pill Button */}
        <button className="bg-gold-gradient hover:opacity-90 text-[#0B0B0C] font-bold text-xs px-3.5 py-1 rounded-full shadow transition-all shrink-0 cursor-pointer">
          {text.register}
        </button>
      </div>
    </div>
  );
};

