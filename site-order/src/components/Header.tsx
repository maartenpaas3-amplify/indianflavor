import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#1A1A1E]/95 backdrop-blur-md border-b border-[#C9A15A]/25 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Logo & Indian Flavors wordmark */}
        <a href="#" className="flex items-center gap-2.5 focus:outline-none shrink-0">
          <div className="w-[58px] md:w-[68px] shrink-0 flex items-center justify-center">
            <img
              src="https://i.ibb.co/ZzqpzTdj/indianflavorslogotransparent-1.png"
              alt="Indian Flavors Logo"
              referrerPolicy="no-referrer"
              className="h-[48px] md:h-[56px] w-auto object-contain shrink-0"
              style={{ display: 'block' }}
            />
          </div>
          <span className="font-serif-luxury text-xs min-[380px]:text-sm sm:text-xl md:text-2xl font-extrabold tracking-wide sm:tracking-wider text-gold-gradient whitespace-nowrap">
            INDIAN FLAVORS
          </span>
        </a>

        {/* Right Section: Language Switcher & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Toggle (FR / EN / AR) */}
          <div className="flex items-center bg-[#131315] border border-[#C9A15A]/30 rounded-full p-0.5 shadow-inner">
            <button
              onClick={() => setLang('fr')}
              className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-200 ${
                lang === 'fr'
                  ? 'bg-gold-gradient text-[#0B0B0C] shadow-sm'
                  : 'text-zinc-200 hover:text-white'
              }`}
              title="Français"
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-gold-gradient text-[#0B0B0C] shadow-sm'
                  : 'text-zinc-200 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-200 ${
                lang === 'ar'
                  ? 'bg-gold-gradient text-[#0B0B0C] shadow-sm'
                  : 'text-zinc-200 hover:text-white'
              }`}
              title="العربية"
            >
              AR
            </button>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#131315] to-[#0B0B0C] hover:from-[#1A1A1E] hover:to-[#131315] border border-[#C9A15A]/40 hover:border-[#C9A15A] text-white px-2 sm:px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-md group active:scale-95 shrink-0"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A15A] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C9A15A] text-[#0B0B0C] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-zinc-300 font-semibold leading-none">
                {lang === 'ar' ? 'السلة' : lang === 'fr' ? 'Panier' : 'Cart'}
              </span>
              <span className="text-xs font-bold text-[#C9A15A] leading-tight">
                {cartTotal} DH
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
