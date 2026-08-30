import React from 'react';
import { Language } from '../types';

interface AnnouncementBarProps {
  lang: Language;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ lang }) => {
  const tagline =
    lang === 'ar'
      ? 'مأكولات هندية أصيلة وراقية'
      : lang === 'fr'
      ? 'Cuisine Indienne Authentique'
      : 'Fine Authentic Indian Cuisine';

  return (
    <div
      className="bg-gradient-to-r from-[#8C7040] via-[#C9A15A] to-[#B08D48] text-[#0B0B0C] text-xs pb-1 px-3 font-bold text-center border-b border-[#8C7040]/30 select-none"
      style={{ paddingTop: 'max(0.25rem, env(safe-area-inset-top))' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 whitespace-nowrap overflow-hidden">
        <span className="text-amber-950 text-[11px] tracking-widest font-black">★★★★★</span>
        <span className="font-serif-luxury tracking-wide text-xs">{tagline}</span>
      </div>
    </div>
  );
};

