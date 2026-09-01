import React, { useState } from 'react';
import { MenuItem, Language } from '../types';
import { POPULAR_ITEM_IDS, RICE_OPTIONS } from '../data/menuData';
import { Plus, Minus, Flame, Leaf, Sparkles } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  lang: Language;
  quantity: number;
  onUpdateQuantity: (newQty: number, selectedRiceId?: string) => void;
  onQuickView?: (item: MenuItem) => void;
  selectedRiceId?: string;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  lang,
  quantity,
  onUpdateQuantity,
  onQuickView,
  selectedRiceId: initialRiceId = '',
}) => {
  const [selectedRiceId, setSelectedRiceId] = useState<string>(initialRiceId);

  const isPopularDish = item.isPopular || POPULAR_ITEM_IDS.includes(item.id);
  const selectedRice = RICE_OPTIONS.find((r) => r.id === selectedRiceId);
  const unitPrice = item.price + (selectedRice ? selectedRice.price : 0);

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

  const handleRiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRiceId = e.target.value;
    setSelectedRiceId(newRiceId);
    if (quantity > 0) {
      onUpdateQuantity(quantity, newRiceId);
    }
  };

  return (
    <div className="menu-card group bg-gradient-to-b from-[#131315] to-[#0B0B0C] border border-[#C9A15A]/30 hover:border-[#C9A15A] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between">
      <div>
        {/* Card Header Image & Badges */}
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B0B0C] cursor-pointer"
          onClick={() => onQuickView && onQuickView(item)}
        >
          <img
            src={item.image}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              // Fallback if raw imgbb webpage URL doesn't directly stream image bytes
              e.currentTarget.src = 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Dark Wine Overlay gradient for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {isPopularDish && (
              <span className="flex items-center gap-1 bg-[#C9A15A] text-[#0B0B0C] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                <Sparkles className="w-3 h-3 fill-current" />
                {lang === 'ar' ? 'مميز' : lang === 'fr' ? 'Populaire' : 'Popular'}
              </span>
            )}
            {item.isVegan && (
              <span className="badge-pill text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Leaf className="w-3 h-3" />
                Vegan
              </span>
            )}
            {item.isVeg && !item.isVegan && (
              <span className="badge-pill text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Leaf className="w-3 h-3" />
                Veg
              </span>
            )}
            {item.isSpicy && (
              <span className="badge-pill text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                {lang === 'ar' ? 'حار' : lang === 'fr' ? 'Épicé' : 'Spicy'}
              </span>
            )}
            {item.isExtraSpicy && (
              <span className="badge-pill text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 fill-current" />
                {lang === 'ar' ? 'حار جداً' : lang === 'fr' ? 'Très Épicé' : 'Extra Spicy'}
              </span>
            )}
          </div>

          {/* Price Tag Overlay on image bottom right */}
          <div className="absolute bottom-3 right-3 bg-[#0B0B0C]/95 backdrop-blur-md border border-[#C9A15A]/60 px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
            <span className="font-serif-luxury text-sm font-bold text-gold-gradient">
              {unitPrice} DH
            </span>
          </div>
        </div>

        {/* Dish Info */}
        <div className="p-5">
          <h3
            className="font-bold text-white text-lg group-hover:text-[#C9A15A] transition-colors leading-snug cursor-pointer mb-1.5"
            onClick={() => onQuickView && onQuickView(item)}
          >
            {name}
          </h3>
          <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">
            {desc}
          </p>

          {/* Rice Option Upsell for Popular Category Dishes */}
          {isPopularDish && (
            <div className="mt-3.5 pt-3 border-t border-[#C9A15A]/20">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-[#C9A15A] flex items-center gap-1">
                  <span>🍚</span>
                  <span>
                    {lang === 'ar'
                      ? 'إضافة أرز'
                      : lang === 'fr'
                      ? 'Accompagnement Riz'
                      : 'Add Rice Side'}
                  </span>
                </label>
                <span className="text-[10px] text-zinc-300 font-normal">
                  {lang === 'ar' ? '(اختياري)' : lang === 'fr' ? '(optionnel)' : '(optional)'}
                </span>
              </div>
              <select
                value={selectedRiceId}
                onChange={handleRiceChange}
                className="w-full bg-[#0B0B0C] border border-[#C9A15A]/40 focus:border-[#C9A15A] rounded-lg text-xs text-white px-2.5 py-1.5 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="">
                  {lang === 'ar'
                    ? 'بدون أرز (+0 د.م.)'
                    : lang === 'fr'
                    ? 'Sans riz (+0 DH)'
                    : 'No rice (+0 DH)'}
                </option>
                {RICE_OPTIONS.map((rice) => {
                  const riceName =
                    lang === 'ar'
                      ? rice.nameAr || rice.nameEn
                      : lang === 'fr'
                      ? rice.nameFr
                      : rice.nameEn;
                  return (
                    <option key={rice.id} value={rice.id}>
                      {riceName} (+{rice.price} DH)
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Quantity Actions */}
      <div className="p-5 pt-0 mt-auto">
        {quantity === 0 ? (
          <button
            onClick={() => onUpdateQuantity(1, selectedRiceId)}
            className="add-to-order-btn w-full flex items-center justify-center gap-2 font-bold text-sm py-2.5 px-4 rounded-xl active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة' : lang === 'fr' ? 'Ajouter' : 'Add to Order'}</span>
          </button>
        ) : (
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-between gap-1.5 sm:gap-2 bg-[#131315] border border-[#C9A15A]/80 p-1 px-1.5 rounded-full shadow-inner">
              <button
                onClick={() => onUpdateQuantity(quantity - 1, selectedRiceId)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A] hover:text-[#0B0B0C] flex items-center justify-center transition-colors font-bold active:scale-90 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 px-2">
                <span className="font-bold text-white text-xs sm:text-sm">{quantity}</span>
                <span className="text-[11px] sm:text-xs text-zinc-300">× {unitPrice} DH</span>
              </div>

              <button
                onClick={() => onUpdateQuantity(quantity + 1, selectedRiceId)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C9A15A] text-[#0B0B0C] hover:bg-[#E8D4A8] flex items-center justify-center transition-colors font-bold active:scale-90 shadow cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
