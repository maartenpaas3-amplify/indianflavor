import React from 'react';
import { MenuItem, Language } from '../types';
import { X, Plus, Minus, Flame, Leaf, Sparkles } from 'lucide-react';

interface QuickViewModalProps {
  item: MenuItem | null;
  onClose: () => void;
  lang: Language;
  quantity: number;
  onUpdateQuantity: (newQty: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  item,
  onClose,
  lang,
  quantity,
  onUpdateQuantity,
}) => {
  if (!item) return null;

  const name =
    lang === 'ar'
      ? item.nameAr || item.nameEn
      : lang === 'fr'
      ? item.nameFr
      : item.nameEn;
  const desc =
    lang === 'ar'
      ? item.descAr || item.descEn
      : lang === 'fr'
      ? item.descFr
      : item.descEn;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-[#4a0f10] border border-[#f3d382]/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Food Image */}
        <div className="relative aspect-[16/10] w-full bg-[#3a0a0b]">
          <img
            src={item.image}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a0f10] via-transparent to-black/40" />

          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 bg-[#3a0a0b]/95 border border-[#f3d382] px-4 py-1.5 rounded-full shadow-md">
            <span className="font-serif-luxury text-lg font-bold text-gold-gradient">
              {item.price} DH
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {item.isPopular && (
              <span className="flex items-center gap-1 bg-[#f3d382] text-[#3a0a0b] text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                <Sparkles className="w-3 h-3 fill-current" />
                {lang === 'ar' ? 'مميز' : lang === 'fr' ? 'Spécialité Maison' : 'House Special'}
              </span>
            )}
            {item.isVegan && (
              <span className="flex items-center gap-1 bg-emerald-950 border border-emerald-400/60 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <Leaf className="w-3 h-3 text-emerald-300" />
                Vegan
              </span>
            )}
            {item.isSpicy && (
              <span className="flex items-center gap-1 bg-red-950 border border-red-400/60 text-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-red-400" />
                {lang === 'ar' ? 'حار' : lang === 'fr' ? 'Épicé' : 'Spicy'}
              </span>
            )}
          </div>

          <h3 className="font-serif-luxury text-2xl font-bold text-white">
            {name}
          </h3>

          <p className="text-zinc-200 text-sm leading-relaxed">{desc}</p>

          <div className="pt-4 border-t border-[#f3d382]/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-[#3a0a0b] border border-[#f3d382]/40 p-1.5 rounded-xl">
              <button
                onClick={() => onUpdateQuantity(Math.max(0, quantity - 1))}
                className="w-9 h-9 rounded-lg bg-[#5c1617] text-[#f3d382] hover:bg-[#f3d382] hover:text-[#3a0a0b] flex items-center justify-center font-bold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-bold text-white text-base px-2">
                {quantity}
              </span>

              <button
                onClick={() => onUpdateQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg bg-[#f3d382] text-[#3a0a0b] hover:bg-[#fff0ca] flex items-center justify-center font-bold shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="flex-1 bg-gold-gradient text-[#3a0a0b] font-bold text-sm py-3 px-6 rounded-xl hover:opacity-95 transition-opacity"
            >
              {lang === 'ar' ? 'تم' : lang === 'fr' ? 'Valider' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
