import React, { useState, useMemo, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { CategoryId, Language, MenuItem, CartItem } from './types';
import { CATEGORIES, MENU_ITEMS, POPULAR_ITEM_IDS } from './data/menuData';
import { AnnouncementBar } from './components/AnnouncementBar';
import { BollywoodBanner } from './components/BollywoodBanner';
import { BollywoodModal } from './components/BollywoodModal';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { StickyCartBar } from './components/StickyCartBar';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { GoogleReviewSection } from './components/GoogleReviewSection';
import { Footer } from './components/Footer';
import { Search, Flame, Leaf, Utensils, X } from 'lucide-react';

interface CartEntry {
  menuItemId: string;
  selectedRiceId?: string;
  quantity: number;
}

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  // Dynamic document title update per language
  useEffect(() => {
    if (lang === 'ar') {
      document.title = 'إنديان فليفرز | مأكولات هندية أصيلة';
    } else if (lang === 'fr') {
      document.title = 'Indian Flavors | Cuisine Indienne Authentique et Raffinée';
    } else {
      document.title = 'Indian Flavors | Fine Authentic Indian Cuisine';
    }
  }, [lang]);

  // Cart state: map of cartItemId -> CartEntry
  const [cartMap, setCartMap] = useState<Record<string, CartEntry>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);

  // Bollywood Night Event state & Firestore live counter listener
  const [isBollywoodModalOpen, setIsBollywoodModalOpen] = useState(false);
  const [bollywoodRegisteredCount, setBollywoodRegisteredCount] = useState(0);

  useEffect(() => {
    const statsRef = doc(db, 'event_stats', 'bollywood_night');
    const unsubscribe = onSnapshot(
      statsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setBollywoodRegisteredCount(data.totalRegistered || 0);
        } else {
          setBollywoodRegisteredCount(0);
        }
      },
      (err) => {
        console.error('Error fetching event_stats:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Convert cartMap into CartItem array
  const cartList: CartItem[] = useMemo(() => {
    return (Object.entries(cartMap) as [string, CartEntry][])
      .filter(([_, entry]) => entry.quantity > 0)
      .map(([cartItemId, entry]) => {
        const menuItem = MENU_ITEMS.find((m) => m.id === entry.menuItemId);
        const selectedRice = entry.selectedRiceId
          ? MENU_ITEMS.find((m) => m.id === entry.selectedRiceId)
          : undefined;
        if (!menuItem) return null;
        const item: CartItem = {
          cartItemId,
          menuItem,
          quantity: entry.quantity,
          selectedRice,
        };
        return item;
      })
      .filter((ci): ci is CartItem => ci !== null);
  }, [cartMap]);

  // Total cart items & MAD price
  const cartCount = useMemo(() => {
    return cartList.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartList]);

  const cartTotal = useMemo(() => {
    return cartList.reduce((sum, item) => {
      const dishPrice = item.menuItem.price;
      const ricePrice = item.selectedRice ? item.selectedRice.price : 0;
      return sum + (dishPrice + ricePrice) * item.quantity;
    }, 0);
  }, [cartList]);

  // Quantity updater (handles cartItemId or menuItemId + selectedRiceId)
  const handleUpdateQuantity = (id: string, newQty: number, selectedRiceId?: string) => {
    setCartMap((prev) => {
      const next = { ...prev };

      let targetKey = id;
      if (selectedRiceId !== undefined) {
        targetKey = selectedRiceId ? `${id}__rice_${selectedRiceId}` : id;
      }

      if (newQty <= 0) {
        delete next[targetKey];
      } else {
        let menuItemId = id;
        let riceId = selectedRiceId;

        if (targetKey.includes('__rice_')) {
          const parts = targetKey.split('__rice_');
          menuItemId = parts[0];
          riceId = parts[1];
        }

        next[targetKey] = {
          menuItemId,
          selectedRiceId: riceId,
          quantity: newQty,
        };
      }

      return next;
    });
  };

  const handleClearCart = () => {
    setCartMap({});
  };

  // Filter menu items by category, search query, and dietary flags
  const filteredItems = useMemo(() => {
    const res = MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory === 'popular') {
        if (!POPULAR_ITEM_IDS.includes(item.id)) {
          return false;
        }
      } else if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName =
          item.nameFr.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          (item.nameAr && item.nameAr.toLowerCase().includes(q));
        const matchesDesc =
          item.descFr.toLowerCase().includes(q) ||
          item.descEn.toLowerCase().includes(q) ||
          (item.descAr && item.descAr.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc) return false;
      }

      // Vegan filter
      if (filterVegan && !item.isVegan) return false;

      // Spicy filter
      if (filterSpicy && !item.isSpicy && !item.isExtraSpicy) return false;

      return true;
    });

    if (selectedCategory === 'popular') {
      res.sort((a, b) => POPULAR_ITEM_IDS.indexOf(a.id) - POPULAR_ITEM_IDS.indexOf(b.id));
    }

    return res;
  }, [selectedCategory, searchQuery, filterVegan, filterSpicy]);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0B0B0C] text-white flex flex-col font-sans selection:bg-[#C9A15A] selection:text-[#0B0B0C]"
    >
      {/* 1. Top Announcement Bar & Bollywood Night Ribbon */}
      <AnnouncementBar lang={lang} />
      <BollywoodBanner
        lang={lang}
        onClick={() => setIsBollywoodModalOpen(true)}
        totalRegistered={bollywoodRegisteredCount}
      />

      {/* 2. Header */}
      <Header
        lang={lang}
        setLang={setLang}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Hero Section */}
      <Hero lang={lang} />

      {/* 4. Main Menu Section */}
      <main id="menu" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-4 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-serif font-extrabold text-[#C9A15A] block">
            {lang === 'ar' ? 'القائمة' : lang === 'fr' ? 'LE MENU' : 'THE MENU'}
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {lang === 'ar' ? 'أطباقنا المميزة' : lang === 'fr' ? 'Nos Délices' : 'Our Delights'}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed pt-1 max-w-[380px] sm:max-w-[480px] mx-auto text-center">
            {lang === 'ar' ? (
              <>
                اختر أطباقك،
                <br />
                ويتم إرسال الطلب مباشرة عبر واتساب.
              </>
            ) : lang === 'fr' ? (
              <>
                Sélectionnez vos plats,
                <br />
                la commande part directement sur WhatsApp.
              </>
            ) : (
              <>
                Select your dishes,
                <br />
                your order goes directly to WhatsApp.
              </>
            )}
          </p>
          <p className="text-xs text-[#C9A15A]/75 font-normal tracking-wide pt-0.5">
            {lang === 'ar'
              ? 'أسعار المطعم المباشرة، بدون رسوم إضافية.'
              : lang === 'fr'
              ? 'Prix direct restaurant, sans frais supplémentaires.'
              : 'Direct restaurant prices, no extra fees.'}
          </p>
        </div>

        {/* Category Navigation Bar (Sticky pills placed under LE MENU / Nos Délices) */}
        <CategoryNav
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
          lang={lang}
        />

        {/* Search & Dietary Filters Toolbar */}
        <div className="bg-[#1A1A1E] border border-[#C9A15A]/30 rounded-2xl p-4 mb-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Field */}
          <div className="relative w-full md:w-96">
            <Search className={`w-4 h-4 text-zinc-300 absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} top-3`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث عن طبق (مثل: برياني، نان)...'
                  : lang === 'fr'
                  ? 'Rechercher (ex: Biryani, Naan)...'
                  : 'Search dish (e.g. Biryani, Naan)...'
              }
              className={`w-full bg-[#131315] border border-white/20 focus:border-[#C9A15A] rounded-xl ${lang === 'ar' ? 'pr-10 pl-9' : 'pl-10 pr-9'} py-2 text-base text-white focus:outline-none transition-colors placeholder:text-zinc-300/70`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3 text-zinc-300 hover:text-white`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Dietary Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setFilterVegan((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filterVegan
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                  : 'bg-[#131315] border-white/20 text-zinc-300 hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ar' ? 'نباتي فقط' : lang === 'fr' ? 'Vegan Uniquement' : 'Vegan Only'}</span>
            </button>

            <button
              onClick={() => setFilterSpicy((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filterSpicy
                  ? 'bg-red-950 border-red-500 text-red-300 shadow'
                  : 'bg-[#131315] border-white/20 text-zinc-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>{lang === 'ar' ? 'أطباق حارة' : lang === 'fr' ? 'Plats Épicés' : 'Spicy Dishes'}</span>
            </button>
          </div>
        </div>

        {/* Menu Items Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#1A1A1E]/80 rounded-2xl border border-[#C9A15A]/30 p-8 space-y-4">
            <Utensils className="w-12 h-12 text-[#C9A15A]/60 mx-auto" />
            <h3 className="text-xl font-serif text-white font-bold">
              {lang === 'ar' ? 'لم يتم العثور على أطباق' : lang === 'fr' ? 'Aucun plat trouvé' : 'No dishes found'}
            </h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              {lang === 'ar'
                ? 'جرب تعديل كلمة البحث أو إعادة ضبط الفلاتر.'
                : lang === 'fr'
                ? 'Essayez de modifier votre recherche ou de réinitialiser vos filtres.'
                : 'Try modifying your search or clearing your filters.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFilterVegan(false);
                setFilterSpicy(false);
              }}
              className="px-5 py-2 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/50 text-[#C9A15A] text-xs font-bold hover:bg-[#C9A15A] hover:text-[#0B0B0C] transition-all"
            >
              {lang === 'ar' ? 'عرض القائمة الكاملة' : lang === 'fr' ? 'Voir tout le menu' : 'Show full menu'}
            </button>
          </div>
        ) : selectedCategory === 'all' && searchQuery === '' && !filterVegan && !filterSpicy ? (
          /* Categorized view when 'All' is selected */
          <div className="space-y-16">
            {CATEGORIES.map((category) => {
              const categoryDishes =
                category.id === 'popular'
                  ? MENU_ITEMS.filter((m) => POPULAR_ITEM_IDS.includes(m.id)).sort(
                      (a, b) => POPULAR_ITEM_IDS.indexOf(a.id) - POPULAR_ITEM_IDS.indexOf(b.id)
                    )
                  : MENU_ITEMS.filter((m) => m.categoryId === category.id);

              if (categoryDishes.length === 0) return null;

              const categoryName =
                lang === 'ar'
                  ? category.nameAr || category.nameEn
                  : lang === 'fr'
                  ? category.nameFr
                  : category.nameEn;

              return (
                <section key={category.id} id={category.id} className="space-y-6">
                  {/* Category Title Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#C9A15A]/30">
                    <span className="text-2xl">{category.emoji}</span>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
                      {categoryName}
                    </h3>
                    <span className="text-xs font-bold text-zinc-200 bg-[#0B0B0C] px-2.5 py-1 rounded-full border border-[#C9A15A]/30">
                      {categoryDishes.length}
                    </span>
                  </div>

                  {/* 3 Columns Desktop, 1 Mobile Card Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDishes.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        lang={lang}
                        quantity={
                          (Object.values(cartMap) as CartEntry[])
                            .filter((e) => e.menuItemId === item.id)
                            .reduce((sum, e) => sum + e.quantity, 0)
                        }
                        onUpdateQuantity={(newQty, selectedRiceId) =>
                          handleUpdateQuantity(item.id, newQty, selectedRiceId)
                        }
                        onQuickView={(item) => setQuickViewItem(item)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Filtered result grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                lang={lang}
                quantity={
                  (Object.values(cartMap) as CartEntry[])
                    .filter((e) => e.menuItemId === item.id)
                    .reduce((sum, e) => sum + e.quantity, 0)
                }
                onUpdateQuantity={(newQty, selectedRiceId) =>
                  handleUpdateQuantity(item.id, newQty, selectedRiceId)
                }
                onQuickView={(item) => setQuickViewItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Sticky Floating Cart Summary Bar */}
      <StickyCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onClearCart={handleClearCart}
        lang={lang}
      />

      {/* 6. Cart Drawer & WhatsApp Checkout Form Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cartList}
        cartTotal={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        lang={lang}
      />

      {/* 7. Quick Dish Preview Modal */}
      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        lang={lang}
        quantity={
          quickViewItem
            ? (Object.values(cartMap) as CartEntry[])
                .filter((e) => e.menuItemId === quickViewItem.id)
                .reduce((sum, e) => sum + e.quantity, 0)
            : 0
        }
        onUpdateQuantity={(newQty) => {
          if (quickViewItem) {
            handleUpdateQuantity(quickViewItem.id, newQty);
          }
        }}
      />

      {/* Bollywood Night Registration Modal */}
      <BollywoodModal
        lang={lang}
        isOpen={isBollywoodModalOpen}
        onClose={() => setIsBollywoodModalOpen(false)}
        totalRegistered={bollywoodRegisteredCount}
      />

      {/* 8. Google Review CTA */}
      <GoogleReviewSection lang={lang} />

      {/* 9. Footer */}
      <Footer lang={lang} />
    </div>
  );
}
