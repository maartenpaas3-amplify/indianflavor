import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Category, CategoryId, Language } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  lang: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  lang,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setCanScrollRight(false);
      return;
    }
    const currentScroll = Math.abs(el.scrollLeft);
    const isEnd = currentScroll >= maxScroll - 12 || (el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
    setCanScrollRight(!isEnd);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const ro = new ResizeObserver(() => {
      checkScroll();
    });
    ro.observe(el);

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    const t1 = setTimeout(checkScroll, 100);
    const t2 = setTimeout(checkScroll, 400);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories, lang]);

  return (
    <div className="sticky top-14 sm:top-16 z-20 bg-[#1A1A1E]/95 backdrop-blur-md border-y border-[#C9A15A]/30 py-2.5 transition-all shadow-lg mt-2 sm:mt-3 mb-6 sm:mb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 scroll-smooth pr-10 sm:pr-4"
        >
          {/* 'All' Category Pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-md ${
              selectedCategory === 'all'
                ? 'bg-gold-gradient text-[#0B0B0C] scale-105 shadow-gold-glow'
                : 'bg-[#131315] text-zinc-200 border border-[#C9A15A]/25 hover:border-[#C9A15A] hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>
              {lang === 'ar'
                ? 'جميع الأطباق'
                : lang === 'fr'
                ? 'Tout le Menu'
                : 'All Menu'}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catName =
              lang === 'ar'
                ? cat.nameAr || cat.nameEn
                : lang === 'fr'
                ? cat.nameFr
                : cat.nameEn;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-md whitespace-nowrap ${
                  isSelected
                    ? 'bg-gold-gradient text-[#0B0B0C] scale-105 shadow-gold-glow'
                    : 'bg-[#131315] text-zinc-200 border border-[#C9A15A]/25 hover:border-[#C9A15A] hover:text-white'
                }`}
              >
                <span className="text-sm sm:text-base">{cat.emoji}</span>
                <span>{catName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fade gradient overlay on right edge */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent pointer-events-none transition-opacity duration-300 z-30 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  );
};
