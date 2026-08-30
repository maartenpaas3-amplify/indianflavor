import React from 'react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';
import { MapPin, Phone, Clock, Flame, Navigation, MessageCircle } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-[#0B0B0C] border-t border-[#C9A15A]/30 pt-8 sm:pt-10 pb-24 md:pb-12 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pb-6 sm:pb-8 border-b border-[#C9A15A]/20">
          {/* Brand Info & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#131315] border border-[#C9A15A]/40 flex items-center justify-center text-[#C9A15A]">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold text-gold-gradient tracking-wider">
                INDIAN FLAVORS
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              {lang === 'ar'
                ? 'تجربة طعام هندية أصيلة في قلب الرباط - أقدال. مكونات طازجة، بهارات مطحونة محلياً ووصفات تقليدية.'
                : lang === 'fr'
                ? 'Une expérience culinaire indienne authentique au cœur de Rabat. Ingrédients frais, épices moulues maison et recettes traditionnelles.'
                : 'An authentic Indian dining experience in the heart of Rabat. Fresh ingredients, house-ground spices, and traditional recipes.'}
            </p>
          </div>

          {/* Contact & Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-[#C9A15A] text-sm uppercase tracking-widest font-bold mb-4">
              {lang === 'ar' ? 'التواصل والمواعيد' : lang === 'fr' ? 'Contact & Horaires' : 'Contact & Hours'}
            </h4>

            <div className="flex items-start gap-3 text-sm text-zinc-200">
              <MapPin className="w-4 h-4 text-[#C9A15A] flex-shrink-0 mt-1" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-200">
              <Phone className="w-4 h-4 text-[#C9A15A] flex-shrink-0" />
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="hover:text-white transition-colors"
              >
                {RESTAURANT_INFO.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-200">
              <MessageCircle className="w-4 h-4 text-[#25d366] flex-shrink-0" />
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp Direct: +212 7 74 44 74 44
              </a>
            </div>

            <div className="flex items-start gap-3 text-sm text-zinc-200 pt-2">
              <Clock className="w-4 h-4 text-[#C9A15A] flex-shrink-0 mt-1" />
              <span>
                {lang === 'ar' ? RESTAURANT_INFO.openingHoursAr : lang === 'fr' ? RESTAURANT_INFO.openingHoursFr : RESTAURANT_INFO.openingHoursEn}
              </span>
            </div>
          </div>

          {/* Location & Directions Button */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-[#C9A15A] text-sm uppercase tracking-widest font-bold mb-4">
              {lang === 'ar' ? 'الموقع' : lang === 'fr' ? 'Localisation' : 'Location'}
            </h4>

            <div className="bg-[#131315] border border-[#C9A15A]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-200">
                <span className="font-bold text-white">Rabat - Agdal</span>
                <span className="text-[#C9A15A] text-[10px] uppercase font-mono">
                  29 Jbel El Ayachi
                </span>
              </div>

              <p className="text-xs text-zinc-300">
                {lang === 'ar'
                  ? 'اطلب عبر واتساب أو تفضل بزيارتنا في المطعم بالرباط أقدال.'
                  : lang === 'fr'
                  ? 'Commandez sur WhatsApp ou passez déguster nos plats sur place.'
                  : 'Order on WhatsApp or come dine with us in Rabat-Agdal.'}
              </p>

              {/* Embedded Google Map */}
              <div className="relative w-full h-[200px] sm:h-[220px] rounded-xl overflow-hidden border border-[#C9A15A]/40 shadow-lg my-2">
                <iframe
                  title="Indian Flavors Location Map"
                  src="https://www.google.com/maps?q=33.9953923,-6.8492066&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  '29 Jbel El Ayachi Rabat Agdal Indian Flavors'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0B0B0C] hover:bg-gold-gradient text-zinc-200 hover:text-[#0B0B0C] border border-[#C9A15A]/40 text-xs font-bold px-3 py-2 rounded-lg transition-all duration-300 w-full justify-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'خرائط جوجل' : lang === 'fr' ? 'Itinéraire Google Maps' : 'Google Maps Directions'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-300/80 gap-4">
          <p>
            © {new Date().getFullYear()} Indian Flavors Rabat. All rights reserved.
          </p>
          <p className="text-zinc-300/80">
            Rabat-Agdal • Morocco
          </p>
        </div>
      </div>
    </footer>
  );
};
