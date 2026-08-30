import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Language } from '../types';

interface StickyCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onClearCart: () => void;
  lang: Language;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onClearCart,
  lang,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  if (cartCount === 0) return null;

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmClear) {
      onClearCart();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const ctaText =
    lang === 'ar'
      ? 'إتمام الطلب'
      : lang === 'fr'
      ? 'Finaliser la commande'
      : 'Complete Order';

  const clearText =
    lang === 'ar' ? 'مسح؟' : lang === 'fr' ? 'Vider ?' : 'Clear?';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#131315]/95 backdrop-blur-md border-t border-[#C9A15A]/40 px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl transition-all duration-300"
      style={{ paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left area: Trash Icon + Cart Icon badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Trash / Vider Button */}
          <button
            type="button"
            onClick={handleTrashClick}
            title={lang === 'ar' ? 'تفريغ السلة' : lang === 'fr' ? 'Vider le panier' : 'Clear cart'}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              confirmClear
                ? 'bg-red-950/90 border-red-500 text-red-300 px-2.5'
                : 'bg-[#0B0B0C] border-[#C9A15A]/30 text-zinc-200 hover:text-red-300 hover:border-red-400'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            {confirmClear && (
              <span className="text-[11px] font-bold tracking-tight animate-fade-in">
                {clearText}
              </span>
            )}
          </button>

          {/* Cart Icon with badge */}
          <button
            type="button"
            onClick={onOpenCart}
            title={lang === 'ar' ? 'فتح السلة' : lang === 'fr' ? 'Ouvrir le panier' : 'Open cart'}
            className="relative w-10 h-10 rounded-full bg-gold-gradient text-[#0B0B0C] flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 transition-transform cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-white text-[#0B0B0C] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0B0C]">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Big Main CTA Button (takes full remaining width) */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex-1 flex items-center justify-between bg-gold-gradient hover:bg-gold-gradient-hover text-[#0B0B0C] px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] group cursor-pointer"
        >
          <div className="flex flex-col text-left leading-tight min-w-0">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight truncate">
              {ctaText}
            </span>
            <span className="font-serif-luxury font-black text-xs sm:text-sm text-[#0B0B0C] opacity-90">
              {cartTotal} DH
            </span>
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
