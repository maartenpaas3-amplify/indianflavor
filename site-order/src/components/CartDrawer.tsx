import React, { useState, useEffect, useRef } from 'react';
import { CartItem, Language, OrderDetails, OrderType } from '../types';
import { RESTAURANT_INFO, MENU_ITEMS } from '../data/menuData';
import { syncOrderToScreen } from '../lib/orderSync';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  FileText,
  UtensilsCrossed,
  Truck,
  ShoppingBag as BagIcon,
  AlertTriangle,
  Paperclip,
  Loader2,
} from 'lucide-react';

const RESTAURANT_LAT = 33.9953923;
const RESTAURANT_LON = -6.8492066;

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (menuItemId: string, newQty: number) => void;
  onClearCart: () => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onUpdateQuantity,
  onClearCart,
  lang,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    customerPhone: '',
    orderType: 'delivery',
    addressOrTable: '',
    specialNotes: '',
  });

  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [distanceWarning, setDistanceWarning] = useState<string | null>(null);

  const addressContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOrderDetails((prev) => ({ ...prev, addressOrTable: val }));
    setDistanceWarning(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (orderDetails.orderType !== 'delivery' || val.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          val
        )}&format=json&countrycodes=ma&limit=5&viewbox=-6.88,34.03,-6.82,33.97&bounded=1`;
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'fr',
          },
        });
        if (res.ok) {
          const data: NominatimResult[] = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (item: NominatimResult) => {
    setOrderDetails((prev) => ({ ...prev, addressOrTable: item.display_name }));
    setShowSuggestions(false);

    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      const dist = calculateHaversineDistance(RESTAURANT_LAT, RESTAURANT_LON, lat, lon);
      if (dist > 10) {
        if (lang === 'ar') {
          setDistanceWarning(
            'يبدو أن هذا العنوان خارج منطقة التوصيل المعتادة (10 كم). يمكنك الاستمرار، ولكن يرجى الاتصال بنا أولاً عبر WhatsApp للتأكيد.'
          );
        } else if (lang === 'fr') {
          setDistanceWarning(
            "Cette adresse semble en dehors de notre zone de livraison habituelle (10km). Vous pouvez continuer, mais contactez-nous d'abord via WhatsApp pour confirmer."
          );
        } else {
          setDistanceWarning(
            'This address appears to be outside our usual delivery zone (10km). You can proceed, but please contact us first via WhatsApp to confirm.'
          );
        }
      } else {
        setDistanceWarning(null);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Build formatted WhatsApp message
  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;

    const orderTypeLabels: Record<OrderType, { fr: string; en: string; ar: string }> = {
      delivery: { fr: 'Livraison à domicile', en: 'Home Delivery', ar: 'توصيل للمنزل' },
      takeaway: { fr: 'À emporter', en: 'Takeaway', ar: 'استلام بالفرع' },
      dinein: { fr: 'Sur place (Table)', en: 'Dine-In (Table)', ar: 'تناول بالمطعم (طاولة)' },
    };

    const typeText = orderTypeLabels[orderDetails.orderType][lang];

    let message = '';

    if (lang === 'ar') {
      message += `*طلب جديد - INDIAN FLAVORS*\n`;
      message += `----------------------------------\n`;
      if (orderDetails.customerName) message += `👤 *الاسم:* ${orderDetails.customerName}\n`;
      if (orderDetails.customerPhone) message += `📞 *الهاتف:* ${orderDetails.customerPhone}\n`;
      message += `📍 *النوع:* ${typeText}\n`;
      if (orderDetails.orderType === 'delivery' && orderDetails.addressOrTable) {
        message += `🏠 *العنوان:* ${orderDetails.addressOrTable}\n`;
      }
      message += `----------------------------------\n`;
      message += `*تفاصيل الطلب:*\n\n`;

      cart.forEach((item) => {
        const itemName = item.menuItem.nameAr || item.menuItem.nameEn;
        const unitPrice = item.menuItem.price + (item.selectedRice ? item.selectedRice.price : 0);
        const lineTotal = unitPrice * item.quantity;

        if (item.selectedRice) {
          const riceName = item.selectedRice.nameAr || item.selectedRice.nameEn;
          message += `• *${item.quantity}x* ${itemName}\n`;
          message += `  └ 🍚 *إضافة أرز:* ${riceName} (+${item.selectedRice.price} DH)\n`;
          message += `  ↳ *المجموع:* ${lineTotal} DH\n`;
        } else {
          message += `• *${item.quantity}x* ${itemName} — ${lineTotal} DH\n`;
        }
      });

      message += `\n----------------------------------\n`;
      message += `💰 *المجموع:* *${cartTotal} DH*\n`;

      if (orderDetails.specialNotes) {
        message += `----------------------------------\n`;
        message += `💬 *ملاحظات:* ${orderDetails.specialNotes}\n`;
      }

      message += `----------------------------------\n`;
      message += `يرجى تأكيد الاستلام وتجهيز الطلب. 🌶️✨`;
    } else if (lang === 'fr') {
      message += `*NOUVELLE COMMANDE - INDIAN FLAVORS*\n`;
      message += `----------------------------------\n`;
      if (orderDetails.customerName) message += `👤 *Nom:* ${orderDetails.customerName}\n`;
      if (orderDetails.customerPhone) message += `📞 *Téléphone:* ${orderDetails.customerPhone}\n`;
      message += `📍 *Type:* ${typeText}\n`;
      if (orderDetails.orderType === 'delivery' && orderDetails.addressOrTable) {
        message += `🏠 *Adresse:* ${orderDetails.addressOrTable}\n`;
      }
      message += `----------------------------------\n`;
      message += `*DÉTAILS DE LA COMMANDE:*\n\n`;

      cart.forEach((item) => {
        const unitPrice = item.menuItem.price + (item.selectedRice ? item.selectedRice.price : 0);
        const lineTotal = unitPrice * item.quantity;

        if (item.selectedRice) {
          message += `• *${item.quantity}x* ${item.menuItem.nameFr}\n`;
          message += `  └ 🍚 *Option Riz:* ${item.selectedRice.nameFr} (+${item.selectedRice.price} DH)\n`;
          message += `  ↳ *Sous-total:* ${lineTotal} DH\n`;
        } else {
          message += `• *${item.quantity}x* ${item.menuItem.nameFr} — ${lineTotal} DH\n`;
        }
      });

      message += `\n----------------------------------\n`;
      message += `💰 *TOTAL A PAYER:* *${cartTotal} DH*\n`;

      if (orderDetails.specialNotes) {
        message += `----------------------------------\n`;
        message += `💬 *Remarques:* ${orderDetails.specialNotes}\n`;
      }

      message += `----------------------------------\n`;
      message += `Merci de confirmer la préparation. 🌶️✨`;
    } else {
      message += `*NEW ORDER - INDIAN FLAVORS*\n`;
      message += `----------------------------------\n`;
      if (orderDetails.customerName) message += `👤 *Name:* ${orderDetails.customerName}\n`;
      if (orderDetails.customerPhone) message += `📞 *Phone:* ${orderDetails.customerPhone}\n`;
      message += `📍 *Order Type:* ${typeText}\n`;
      if (orderDetails.orderType === 'delivery' && orderDetails.addressOrTable) {
        message += `🏠 *Address:* ${orderDetails.addressOrTable}\n`;
      }
      message += `----------------------------------\n`;
      message += `*ORDER ITEMS:*\n\n`;

      cart.forEach((item) => {
        const unitPrice = item.menuItem.price + (item.selectedRice ? item.selectedRice.price : 0);
        const lineTotal = unitPrice * item.quantity;

        if (item.selectedRice) {
          message += `• *${item.quantity}x* ${item.menuItem.nameEn}\n`;
          message += `  └ 🍚 *Rice Side:* ${item.selectedRice.nameEn} (+${item.selectedRice.price} DH)\n`;
          message += `  ↳ *Subtotal:* ${lineTotal} DH\n`;
        } else {
          message += `• *${item.quantity}x* ${item.menuItem.nameEn} — ${lineTotal} DH\n`;
        }
      });

      message += `\n----------------------------------\n`;
      message += `💰 *TOTAL AMOUNT:* *${cartTotal} DH*\n`;

      if (orderDetails.specialNotes) {
        message += `----------------------------------\n`;
        message += `💬 *Special Instructions:* ${orderDetails.specialNotes}\n`;
      }

      message += `----------------------------------\n`;
      message += `Please confirm receipt and estimated timing. 🌶️✨`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encoded}`;

    // Also push the order to the in-restaurant staff screen. This never
    // blocks or interferes with the WhatsApp flow below (see orderSync.ts).
    syncOrderToScreen(cart, orderDetails, cartTotal);

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg bg-[#131315] border-l border-[#C9A15A]/30 h-full flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky at top) */}
        <div className="p-5 border-b border-[#C9A15A]/25 flex items-center justify-between bg-[#131315] shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/60 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://i.ibb.co/ZzqpzTdj/indianflavorslogotransparent-1.png"
                alt="Indian Flavors Logo"
                referrerPolicy="no-referrer"
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-white leading-none">
                {lang === 'ar' ? 'سلة الطلبات' : lang === 'fr' ? 'Votre Commande' : 'Your Order'}
              </h2>
              <span className="text-xs text-[#C9A15A]/90 font-medium">
                {cart.reduce((acc, curr) => acc + curr.quantity, 0)}{' '}
                {lang === 'ar' ? 'أطباق مختارة' : lang === 'fr' ? 'articles sélectionnés' : 'items selected'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/30 text-zinc-200 hover:text-white hover:border-[#C9A15A] hover:bg-[#1A1A1E] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content: Item list + Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-zinc-300 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/30 flex items-center justify-center mx-auto text-[#C9A15A]">
                <ShoppingBag className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-base font-medium text-white">
                {lang === 'ar'
                  ? 'السلة فارغة حالياً'
                  : lang === 'fr'
                  ? 'Votre panier est encore vide.'
                  : 'Your cart is currently empty.'}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#131315] border border-[#C9A15A]/50 text-gold-gradient text-xs font-bold hover:border-[#C9A15A] transition-colors"
              >
                {lang === 'ar' ? 'تصفح القائمة' : lang === 'fr' ? 'Parcourir le menu' : 'Browse Menu'}
              </button>
            </div>
          ) : (
            <>
              {/* Selected Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#C9A15A]/20">
                  <span className="text-xs uppercase tracking-widest text-[#C9A15A] font-semibold">
                    {lang === 'ar' ? 'ملخص الأطباق' : lang === 'fr' ? 'Résumé des Plats' : 'Dishes Summary'}
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-xs text-zinc-300 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'مسح الكل' : lang === 'fr' ? 'Vider' : 'Clear all'}
                  </button>
                </div>

                {cart.map((item) => {
                  const itemName =
                    lang === 'ar'
                      ? item.menuItem.nameAr || item.menuItem.nameEn
                      : lang === 'fr'
                      ? item.menuItem.nameFr
                      : item.menuItem.nameEn;
                  const riceName = item.selectedRice
                    ? lang === 'ar'
                      ? item.selectedRice.nameAr || item.selectedRice.nameEn
                      : lang === 'fr'
                      ? item.selectedRice.nameFr
                      : item.selectedRice.nameEn
                    : null;
                  const unitPrice = item.menuItem.price + (item.selectedRice ? item.selectedRice.price : 0);
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-[#131315] border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2.5 sm:gap-3 hover:border-[#C9A15A]/40 transition-colors"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={itemName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-sm font-bold text-white leading-snug break-words">
                          {itemName}
                        </h4>
                        {item.selectedRice && (
                          <div className="text-[11px] text-[#C9A15A] font-semibold mt-0.5 flex items-center gap-1">
                            <span>🍚</span>
                            <span>{riceName} (+{item.selectedRice.price} DH)</span>
                          </div>
                        )}
                        <span className="text-xs text-[#C9A15A]/80 font-medium block mt-0.5">
                          {unitPrice} DH
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0B0B0C] border border-[#C9A15A]/30 rounded-lg p-1 shrink-0">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded bg-[#131315] text-[#C9A15A] hover:bg-[#C9A15A] hover:text-[#0B0B0C] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded bg-[#C9A15A] text-[#0B0B0C] hover:bg-[#E8D4A8] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0 min-w-12 sm:min-w-14">
                        <span className="text-xs font-extrabold text-white">
                          {itemTotal} DH
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Drink Upsell Suggestion (shown only if no drink is in cart) */}
              {(() => {
                const hasDrinkInCart = cart.some(
                  (item) =>
                    item.menuItem.categoryId === 'cold_drinks' ||
                    item.menuItem.categoryId === 'hot_drinks'
                );
                if (hasDrinkInCart) return null;

                const SUGGESTED_DRINK_IDS = ['cd1', 'cd6', 'hd3'];
                const suggestedDrinks = MENU_ITEMS.filter((m) =>
                  SUGGESTED_DRINK_IDS.includes(m.id)
                );

                return (
                  <div className="bg-[#131315] border border-[#C9A15A]/30 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A15A]">
                        {lang === 'ar'
                          ? 'إضافة مشروب؟'
                          : lang === 'fr'
                          ? 'Ajoutez une boisson ?'
                          : 'Add a drink?'}
                      </span>
                      <span className="text-[10px] text-[#C9A15A]/80 uppercase tracking-wider font-semibold">
                        {lang === 'ar' ? 'اقتراح' : lang === 'fr' ? 'Suggestion' : 'Suggestion'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {suggestedDrinks.map((drink) => {
                        const drinkName =
                          lang === 'ar'
                            ? drink.nameAr || drink.nameEn
                            : lang === 'fr'
                            ? drink.nameFr
                            : drink.nameEn;
                        return (
                          <div
                            key={drink.id}
                            className="bg-[#0B0B0C] border border-[#C9A15A]/20 rounded-lg p-2 flex flex-col justify-between items-center text-center gap-1.5 hover:border-[#C9A15A]/50 transition-colors"
                          >
                            <img
                              src={drink.image}
                              alt={drinkName}
                              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                            />
                            <div className="w-full min-w-0">
                              <p className="text-[11px] font-semibold text-white truncate leading-tight">
                                {drinkName}
                              </p>
                              <p className="text-[10px] text-[#C9A15A] font-bold mt-0.5">
                                {drink.price} DH
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const currentQty =
                                  cart.find((c) => c.menuItem.id === drink.id)?.quantity || 0;
                                onUpdateQuantity(drink.id, currentQty + 1);
                              }}
                              className="w-full py-1 rounded bg-[#131315] border border-[#C9A15A]/40 text-[#C9A15A] hover:bg-[#C9A15A] hover:text-[#0B0B0C] flex items-center justify-center gap-1 text-[11px] font-bold transition-all active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>
                                {lang === 'ar' ? 'إضافة' : lang === 'fr' ? 'Ajouter' : 'Add'}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Order Options & Customer Details */}
              <form onSubmit={handleSendWhatsAppOrder} className="space-y-4 pt-2">
                <span className="text-xs uppercase tracking-widest text-[#C9A15A] font-semibold block border-b border-[#C9A15A]/20 pb-2">
                  {lang === 'ar' ? 'معلومات الزبون' : lang === 'fr' ? 'Vos Coordonnées' : 'Customer Details'}
                </span>

                {/* Order Type Tabs */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1.5 block">
                    {lang === 'ar' ? 'نوع الطلب' : lang === 'fr' ? 'Mode de Commande' : 'Order Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOrderDetails((prev) => ({ ...prev, orderType: 'delivery' }))
                      }
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        orderDetails.orderType === 'delivery'
                          ? 'bg-[#1A1A1E] border-[#C9A15A] text-[#C9A15A]'
                          : 'bg-[#0B0B0C] border-white/10 text-zinc-300 hover:border-[#C9A15A]/40'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1" />
                      <span>{lang === 'ar' ? 'توصيل' : lang === 'fr' ? 'Livraison' : 'Delivery'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOrderDetails((prev) => ({ ...prev, orderType: 'takeaway' }))
                      }
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        orderDetails.orderType === 'takeaway'
                          ? 'bg-[#1A1A1E] border-[#C9A15A] text-[#C9A15A]'
                          : 'bg-[#0B0B0C] border-white/10 text-zinc-300 hover:border-[#C9A15A]/40'
                      }`}
                    >
                      <BagIcon className="w-4 h-4 mb-1" />
                      <span>{lang === 'ar' ? 'سفري' : lang === 'fr' ? 'À Emporter' : 'Takeaway'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOrderDetails((prev) => ({ ...prev, orderType: 'dinein' }))
                      }
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        orderDetails.orderType === 'dinein'
                          ? 'bg-[#1A1A1E] border-[#C9A15A] text-[#C9A15A]'
                          : 'bg-[#0B0B0C] border-white/10 text-zinc-300 hover:border-[#C9A15A]/40'
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4 mb-1" />
                      <span>{lang === 'ar' ? 'بالمطعم' : lang === 'fr' ? 'Sur Place' : 'Dine-In'}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1 block">
                    {lang === 'ar' ? 'الاسم الكامل' : lang === 'fr' ? 'Nom complet' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={orderDetails.customerName}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, customerName: e.target.value })
                      }
                      placeholder={lang === 'ar' ? 'مثال: محمد العلمي' : lang === 'fr' ? 'Ex: Mohamed Alami' : 'e.g. John Smith'}
                      className="w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl pl-9 pr-3 py-2 text-base text-white focus:outline-none placeholder:text-zinc-400"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1 block">
                    {lang === 'ar' ? 'الهاتف / واتساب' : lang === 'fr' ? 'Téléphone / WhatsApp' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={orderDetails.customerPhone}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, customerPhone: e.target.value })
                      }
                      placeholder="Ex: +212 6 00 00 00 00"
                      className="w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl pl-9 pr-3 py-2 text-base text-white focus:outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {/* Delivery Address (Only shown when orderType === 'delivery') */}
                {orderDetails.orderType === 'delivery' && (
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-1 block">
                      {lang === 'ar'
                        ? 'عنوان التوصيل (الرباط - أقدال)'
                        : lang === 'fr'
                        ? 'Adresse de Livraison (Rabat / Agdal)'
                        : 'Delivery Address (Rabat / Agdal)'}
                    </label>
                    <div className="relative" ref={addressContainerRef}>
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3 z-10 pointer-events-none" />
                      <input
                        type="text"
                        value={orderDetails.addressOrTable}
                        onChange={handleAddressChange}
                        onFocus={() => {
                          if (suggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        placeholder={
                          lang === 'ar'
                            ? 'شقة 5، زنقة جبل العياشي، أقدال'
                            : lang === 'fr'
                            ? 'Ex: Appt 5, Immeuble B, Agdal'
                            : 'e.g. Apt 5, Agdal, Rabat'
                        }
                        className="w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl pl-9 pr-8 py-2 text-base text-white focus:outline-none placeholder:text-zinc-400"
                        required
                      />
                      {isLoadingSuggestions && (
                        <Loader2 className="w-4 h-4 text-[#C9A15A] animate-spin absolute right-3 top-3 z-10 pointer-events-none" />
                      )}

                      {/* Autocomplete Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-[#131315] border border-[#C9A15A]/40 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-white/10 max-h-56 overflow-y-auto">
                          {suggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(item)}
                              className="w-full text-left px-3 py-2.5 text-xs text-zinc-200 hover:bg-[#1A1A1E] hover:text-[#C9A15A] transition-colors flex items-start gap-2"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#C9A15A] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{item.display_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Distance Warning (if selected address > 10km) */}
                    {distanceWarning && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{distanceWarning}</span>
                      </div>
                    )}

                    {/* Helper / Hint Text */}
                    <p className="text-[11px] text-zinc-300 mt-1.5 flex items-start gap-1 leading-normal">
                      <Paperclip className="w-3.5 h-3.5 text-zinc-300 shrink-0 mt-0.5" />
                      <span>
                        {lang === 'ar'
                          ? 'للحصول على موقع أكثر دقة، يمكنك أيضًا مشاركة موقعك المباشر عبر رمز 📎 في WhatsApp بعد إرسال الطلب.'
                          : lang === 'fr'
                          ? 'Pour une localisation plus précise, vous pouvez aussi partager votre position en direct via l’icône 📎 dans WhatsApp après l’envoi de la commande.'
                          : 'For a more precise location, you can also share your live location via the 📎 icon in WhatsApp after sending the order.'}
                      </span>
                    </p>
                  </div>
                )}

                {/* Special Instructions / Notes */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 mb-1 block">
                    {lang === 'ar' ? 'ملاحظات وتفضيلات (اختياري)' : lang === 'fr' ? 'Remarques & Allergies (Optionnel)' : 'Special Notes (Optional)'}
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <textarea
                      value={orderDetails.specialNotes}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, specialNotes: e.target.value })
                      }
                      placeholder={
                        lang === 'ar'
                          ? 'مثال: حار خفيف، بدون بصل...'
                          : lang === 'fr'
                          ? 'Ex: Moins épicé, sans oignons, sauce à part...'
                          : 'e.g. Mild spice, no onions...'
                      }
                      rows={2}
                      className="w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl pl-9 pr-3 py-2 text-base text-white focus:outline-none resize-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                {/* Submit button inside form */}
                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#25d366] via-[#128c7e] to-[#075e54] text-white font-black text-base py-3.5 px-6 rounded-xl shadow-xl hover:opacity-95 transition-all duration-300 active:scale-95"
                >
                  <Send className="w-5 h-5 fill-current" />
                  <span>
                    {lang === 'ar'
                      ? `إرسال الطلب عبر واتساب (${cartTotal} DH)`
                      : lang === 'fr'
                      ? `Envoyer la Commande sur WhatsApp (${cartTotal} DH)`
                      : `Send Order via WhatsApp (${cartTotal} DH)`}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer info in drawer */}
        {cart.length > 0 && (
          <div
            className="p-4 bg-[#0B0B0C] border-t border-[#C9A15A]/20 text-center"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <p className="text-[11px] text-zinc-300">
              {lang === 'fr'
                ? 'En cliquant, WhatsApp s’ouvrira automatiquement avec le récapitulatif prêt à l’envoi.'
                : 'Clicking will launch WhatsApp with your formatted order ready to send.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
