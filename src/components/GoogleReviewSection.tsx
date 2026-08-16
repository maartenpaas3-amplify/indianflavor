import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface GoogleReviewSectionProps {
  lang: Language;
}

export const GoogleReviewSection: React.FC<GoogleReviewSectionProps> = ({ lang }) => {
  const heading =
    lang === 'ar'
      ? 'هل أعجبتك وجبتك؟'
      : lang === 'fr'
      ? 'Vous avez aimé votre repas ?'
      : 'Enjoyed your meal?';

  const subtext =
    lang === 'ar'
      ? 'شاركنا تجربتك على جوجل'
      : lang === 'fr'
      ? 'Partagez votre expérience sur Google'
      : 'Share your experience on Google';

  const buttonText =
    lang === 'ar'
      ? 'اترك تقييمك'
      : lang === 'fr'
      ? 'Laisser un avis'
      : 'Leave a review';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-4 sm:mt-4 sm:mb-6">
      <div className="bg-[#5c1617] border border-[#f3d382]/30 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all duration-300 hover:border-[#f3d382]/60">
        {/* Left / Info Side */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#450d0e] border border-[#f3d382]/40 flex items-center justify-center flex-shrink-0 text-[#f3d382] shadow-inner">
            <div className="flex items-center gap-0.5">
              <Star className="w-5 h-5 fill-[#f3d382] text-[#f3d382]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[#f3d382]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
              {heading}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              {subtext}
            </p>
          </div>
        </div>

        {/* Right / CTA Button Side */}
        <div>
          <a
            href="https://www.google.com/search?q=Indian+Flavors+Rabat+Agdal+reviews#lrd="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#450d0e] hover:bg-gold-gradient text-[#f3d382] hover:text-[#3a0a0b] border border-[#f3d382]/60 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-md group active:scale-95 whitespace-nowrap"
          >
            <img
              src="https://i.ibb.co/8L2NLSm1/google-icon.png"
              alt="Google"
              className="h-[18px] sm:h-[20px] w-auto object-contain shrink-0"
            />
            <span>{buttonText}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
