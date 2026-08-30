import React from 'react';
import { Language } from '../types';

interface HeroProps {
  lang?: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang = 'fr' }) => {
  const kicker =
    lang === 'ar'
      ? 'مرحباً بكم في'
      : lang === 'en'
      ? 'WELCOME TO'
      : 'BIENVENUE CHEZ';

  return (
    <section className="relative overflow-hidden py-5 sm:py-7 bg-[#0B0B0C]">
      {/* Background Image Layer with horizontal flip and overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[position:top_left] md:bg-center"
          style={{
            backgroundImage: `url('https://i.ibb.co/ym6PdsLV/indianflavorbackground.webp')`,
            transform: 'scaleX(-1)',
          }}
        />
        {/* Dark wine gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(143,45,46,0.92) 0%, rgba(143,45,46,0.65) 60%, rgba(143,45,46,0.35) 100%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-center">
        {/* Kicker Eyebrow */}
        <span className="text-[#C9A15A] text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-serif font-extrabold block mb-0.5 sm:mb-1 drop-shadow">
          {kicker}
        </span>

        {/* Hero Main Title */}
        <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider uppercase text-white drop-shadow-lg leading-tight">
          INDIAN <span className="text-gold-gradient">FLAVORS</span>
        </h1>

        {/* Decorative Gold Divider */}
        <div className="flex items-center justify-center gap-2.5 my-2 sm:my-2.5 w-[130px] sm:w-[180px] pointer-events-none select-none" aria-hidden="true">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A15A]/60 to-[#C9A15A]" />
          <span className="text-[#C9A15A] text-[9px] sm:text-[11px] leading-none">◆</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A15A]/60 to-[#C9A15A]" />
        </div>

        {/* Hours Text */}
        <span className="text-xs sm:text-sm text-zinc-300/90 font-medium tracking-wide">
          13:00 – 23:00
        </span>
      </div>
    </section>
  );
};

