import React from 'react';
import { Language } from '../types';
import heroDesktop from '../assets/images/hero-home.webp';
import heroMobile from '../assets/images/hero-home-mobile.webp';

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
      {/* Background Image Layer — same hero photos as the main site, swapped by breakpoint */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroMobile}
          alt=""
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-top"
        />
        <img
          src={heroDesktop}
          alt=""
          className="hidden sm:block absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay, matching the main site's brand background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(11,11,12,0.92) 0%, rgba(11,11,12,0.65) 60%, rgba(11,11,12,0.35) 100%)',
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

        {/* Decorative Gold Divider — lotus/petal motif, matching the carte page's ornament */}
        <div className="flex items-center justify-center gap-2.5 my-2 sm:my-2.5 w-[160px] sm:w-[210px] pointer-events-none select-none" aria-hidden="true">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A15A]/60 to-[#C9A15A]" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#C9A15A]">
            <path
              d="M12 3c-1.5 3-4.5 4.5-4.5 8.5a4.5 4.5 0 009 0C16.5 7.5 13.5 6 12 3z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M6 16c2 1.2 4 1.6 6 1.6s4-.4 6-1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="12" cy="10.5" r="1.1" fill="currentColor" />
          </svg>
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

