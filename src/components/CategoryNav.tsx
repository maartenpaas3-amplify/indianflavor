import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Category, CategoryId, Language } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  lang: Language;
}

// Zelfde dunne lijn-icoontjes als op de carte-pagina (1 per categorie,
// puur decoratief/aria-hidden) i.p.v. emoji — ziet er overal consistent
// uit, ongeacht toestel/besturingssysteem, en oogt rustiger naast de
// serif-gouden stijl. "all" en "popular" bestaan niet als aparte categorie
// op de carte-kaart, dus die twee zijn los toegevoegd in dezelfde lijnstijl.
const CATEGORY_ICON_PATHS: Record<string, string> = {
  all: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z M6 18h12',
  popular: 'M12 2c-3 4-6 7-6 11a6 6 0 0012 0c0-2-1-4-2-5 0 2-1 3-2 2 1-3-1-6-2-8z',
  veg_starters: 'M12 21c-4-2-7-6-7-11a7 7 0 0114 0c0 5-3 9-7 11z',
  nonveg_starters: 'M8 3c2 1 3 3 3 5l7 7a2.5 2.5 0 01-3.5 3.5L7 11c-2 0-4-1-5-3',
  veg_mains: 'M12 21c-4-2-7-6-7-11a7 7 0 0114 0c0 5-3 9-7 11z',
  main_courses: 'M4 13a8 8 0 0016 0H4z M12 3v2 M8 4l.5 1.5 M16 4l-.5 1.5',
  tandoori: 'M12 3c-1.5 3-4.5 4.5-4.5 8.5a4.5 4.5 0 009 0C16.5 7.5 13.5 6 12 3z',
  biryani: 'M5 11h14l-1 8a2 2 0 01-2 2H8a2 2 0 01-2-2l-1-8z M4 11a8 3 0 0016 0',
  naan_rice: 'M4 8c4-3 12-3 16 0-2 2-2 5 0 7-4 3-12 3-16 0 2-2 2-5 0-7z',
  desserts: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z M6 18h12',
  cold_drinks: 'M7 4h10l-1 15a2 2 0 01-2 2h-4a2 2 0 01-2-2L7 4z M6 4h12 M9 9h6',
  hot_drinks: 'M4 9h13v5a4 4 0 01-4 4H8a4 4 0 01-4-4V9z M17 10h1.5a2 2 0 010 4H17 M8 4c0 1-1 1-1 2 M12 4c0 1-1 1-1 2',
};
const FALLBACK_ICON_PATH = 'M8 3v6a2 2 0 002 2h0a2 2 0 002-2V3 M12 3v18 M16 3c-1.5 0-3 1.5-3 4s1.5 4 3 4v10';

const CategoryIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d={CATEGORY_ICON_PATHS[id] ?? FALLBACK_ICON_PATH} />
  </svg>
);

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
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 ${
              selectedCategory === 'all'
                ? 'bg-gold-gradient text-[#0B0B0C] border border-transparent'
                : 'bg-[#131315] text-zinc-300 border border-[#C9A15A]/25 hover:border-[#C9A15A] hover:text-white'
            }`}
          >
            <span className={selectedCategory === 'all' ? 'text-[#0B0B0C]' : 'text-[#C9A15A] opacity-85'}>
              <CategoryIcon id="all" />
            </span>
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
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gold-gradient text-[#0B0B0C] border border-transparent'
                    : 'bg-[#131315] text-zinc-300 border border-[#C9A15A]/25 hover:border-[#C9A15A] hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-[#0B0B0C]' : 'text-[#C9A15A] opacity-85'}>
                  <CategoryIcon id={cat.id} />
                </span>
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
