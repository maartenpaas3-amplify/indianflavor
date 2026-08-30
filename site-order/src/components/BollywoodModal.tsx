import React, { useState, useEffect } from 'react';
import { X, User, Phone, Users, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { addDoc, collection, doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RESTAURANT_INFO } from '../data/menuData';
import { Language } from '../types';

interface BollywoodModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  totalRegistered: number;
}

export const BollywoodModal: React.FC<BollywoodModalProps> = ({
  lang,
  isOpen,
  onClose,
  totalRegistered,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t =
    {
      fr: {
        close: 'Fermer',
        title: 'Soirée Bollywood',
        subtitle: "Inscription & Réservation d'intérêt",
        infoTextPrefix: 'Dès que nous atteignons ',
        infoTextTarget: '20 inscrits',
        infoTextSuffix: ', nous fixons la date et vous serez averti par WhatsApp.',
        currentRegistrations: 'Inscriptions actuelles :',
        counterLabel: `${totalRegistered}/20 inscrits`,
        successTitle: 'Inscription Réussie !',
        successSubtitle:
          'Merci ! Vous allez être redirigé vers WhatsApp pour valider votre demande auprès de notre équipe.',
        nameLabel: 'Nom complet',
        namePlaceholder: 'Ex: Youssef Benjelloun',
        phoneLabel: 'Téléphone / WhatsApp',
        phonePlaceholder: 'Ex: +212 6 00 00 00 00',
        guestCountLabel: 'Nombre de personnes',
        submitButton: "S'inscrire à la Soirée Bollywood",
        submitting: 'Inscription en cours...',
        errorMsg: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        waMessage: (n: string, p: string, g: number) =>
          `Bonjour Indian Flavors, je souhaite m'inscrire à la Soirée Bollywood :\nNom : ${n}\nTéléphone : ${p}\nNombre de personnes : ${g}`,
      },
      en: {
        close: 'Close',
        title: 'Bollywood Night',
        subtitle: 'Registration & Pre-booking',
        infoTextPrefix: 'As soon as we reach ',
        infoTextTarget: '20 sign-ups',
        infoTextSuffix: ', we will set the date and notify you via WhatsApp.',
        currentRegistrations: 'Current registrations:',
        counterLabel: `${totalRegistered}/20 registered`,
        successTitle: 'Registration Successful!',
        successSubtitle:
          'Thank you! You will be redirected to WhatsApp to confirm your request with our team.',
        nameLabel: 'Full Name',
        namePlaceholder: 'Ex: John Doe',
        phoneLabel: 'Phone / WhatsApp',
        phonePlaceholder: 'Ex: +212 6 00 00 00 00',
        guestCountLabel: 'Number of guests',
        submitButton: 'Register for Bollywood Night',
        submitting: 'Registering...',
        errorMsg: 'An error occurred during registration. Please try again.',
        waMessage: (n: string, p: string, g: number) =>
          `Hello Indian Flavors, I would like to register for Bollywood Night:\nName: ${n}\nPhone: ${p}\nNumber of guests: ${g}`,
      },
      ar: {
        close: 'إغلاق',
        title: 'أمسية بوليوود',
        subtitle: 'التسجيل وحجز الاهتمام',
        infoTextPrefix: 'بمجرد الوصول إلى ',
        infoTextTarget: '20 مسجلاً',
        infoTextSuffix: '، سنحدد الموعد ونبلغكم عبر واتساب.',
        currentRegistrations: 'المسجلون حالياً:',
        counterLabel: `${totalRegistered}/20 مسجلاً`,
        successTitle: 'تم التسجيل بنجاح!',
        successSubtitle: 'شكراً لك! سيتم توجيهك إلى واتساب لتأكيد طلبك مع فريقنا.',
        nameLabel: 'الاسم الكامل',
        namePlaceholder: 'مثال: يوسف بن جلون',
        phoneLabel: 'الهاتف / واتساب',
        phonePlaceholder: 'مثال: 00 00 00 6 212+',
        guestCountLabel: 'عدد الأشخاص',
        submitButton: 'التسجيل في أمسية بوليوود',
        submitting: 'جاري التسجيل...',
        errorMsg: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.',
        waMessage: (n: string, p: string, g: number) =>
          `مرحباً Indian Flavors، أود التسجيل في أمسية بوليوود:\nالاسم: ${n}\nالهاتف: ${p}\nعدد الأشخاص: ${g}`,
      },
    }[lang] || {
      close: 'Fermer',
      title: 'Soirée Bollywood',
      subtitle: "Inscription & Réservation d'intérêt",
      infoTextPrefix: 'Dès que nous atteignons ',
      infoTextTarget: '20 inscrits',
      infoTextSuffix: ', nous fixons la date et vous serez averti par WhatsApp.',
      currentRegistrations: 'Inscriptions actuelles :',
      counterLabel: `${totalRegistered}/20 inscrits`,
      successTitle: 'Inscription Réussie !',
      successSubtitle:
        'Merci ! Vous allez être redirigé vers WhatsApp pour valider votre demande auprès de notre équipe.',
      nameLabel: 'Nom complet',
      namePlaceholder: 'Ex: Youssef Benjelloun',
      phoneLabel: 'Téléphone / WhatsApp',
      phonePlaceholder: 'Ex: +212 6 00 00 00 00',
      guestCountLabel: 'Nombre de personnes',
      submitButton: "S'inscrire à la Soirée Bollywood",
      submitting: 'Inscription en cours...',
      errorMsg: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      waMessage: (n: string, p: string, g: number) =>
        `Bonjour Indian Flavors, je souhaite m'inscrire à la Soirée Bollywood :\nNom : ${n}\nTéléphone : ${p}\nNombre de personnes : ${g}`,
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || guestCount < 1) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const guests = Math.max(1, Number(guestCount));

      // 1. Add document to bollywood_night_registrations
      await addDoc(collection(db, 'bollywood_night_registrations'), {
        name: name.trim(),
        phone: phone.trim(),
        guestCount: guests,
        timestamp: serverTimestamp(),
      });

      // 2. Increment event_stats/bollywood_night by actual guest count
      const statsRef = doc(db, 'event_stats', 'bollywood_night');
      await setDoc(
        statsRef,
        {
          totalRegistered: increment(guests),
        },
        { merge: true }
      );

      // 3. Open WhatsApp with pre-filled localized message
      const whatsappMessage = t.waMessage(name.trim(), phone.trim(), guests);

      const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, '_blank');

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        setGuestCount(1);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error registering for Bollywood Night:', err);
      setErrorMsg(t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showCounter = totalRegistered >= 5;
  const target = 20;
  const progressPercent = Math.min(100, Math.round((totalRegistered / target) * 100));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        className="relative w-full max-w-md border border-[#C9A15A]/40 rounded-2xl p-6 shadow-2xl text-white my-8 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url("https://i.ibb.co/k2rpHy96/ifbollywood.webp")`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark overlay layer to protect text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(58, 10, 11, 0.75)',
          }}
        />

        {/* Content wrapper sitting above overlay */}
        <div className="relative z-10">
          {/* Glow ambient background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A15A]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-8 h-8 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/40 text-zinc-200 hover:text-white hover:border-[#C9A15A] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg`}
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pr-10 rtl:pr-0 rtl:pl-10 bg-[#131315]/90 border border-[#C9A15A]/40 rounded-xl p-3 shadow-lg backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-[#0B0B0C] border border-[#C9A15A]/60 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-xl">🎬</span>
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-white leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.95)]">
                {t.title}
              </h3>
              <p className="text-xs text-[#C9A15A] font-medium flex items-center gap-1 mt-0.5 [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
                <Sparkles className="w-3 h-3" />
                <span>{t.subtitle}</span>
              </p>
            </div>
          </div>

        {/* Info Box */}
        <div className="bg-[#131315]/95 border border-[#C9A15A]/35 rounded-xl p-3.5 mb-5 text-xs text-zinc-200 leading-relaxed shadow-md backdrop-blur-sm">
          <p>
            {t.infoTextPrefix}
            <span className="text-[#C9A15A] font-bold">{t.infoTextTarget}</span>
            {t.infoTextSuffix}
          </p>

          {/* Progress Bar (if totalRegistered >= 5) */}
          {showCounter && (
            <div className="mt-3 pt-3 border-t border-[#C9A15A]/20">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <span className="text-zinc-300">{t.currentRegistrations}</span>
                <span className="font-bold text-[#C9A15A]">{t.counterLabel}</span>
              </div>
              <div className="w-full h-2 bg-[#0B0B0C] rounded-full overflow-hidden border border-[#C9A15A]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A15A] to-[#E8D4A8] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form or Success State */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3 bg-[#131315]/95 border border-[#C9A15A]/40 rounded-xl p-6 backdrop-blur-sm">
            <CheckCircle2 className="w-12 h-12 text-[#C9A15A] mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">{t.successTitle}</h4>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">{t.successSubtitle}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Nom complet */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 mb-1 block [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                {t.nameLabel} <span className="text-[#C9A15A]">*</span>
              </label>
              <div className="relative">
                <User
                  className={`w-4 h-4 text-zinc-400 absolute ${
                    lang === 'ar' ? 'right-3' : 'left-3'
                  } top-3`}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className={`w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl ${
                    lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  } py-2 text-sm text-white focus:outline-none shadow-sm placeholder:text-zinc-400`}
                  required
                />
              </div>
            </div>

            {/* Téléphone / WhatsApp */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 mb-1 block [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                {t.phoneLabel} <span className="text-[#C9A15A]">*</span>
              </label>
              <div className="relative">
                <Phone
                  className={`w-4 h-4 text-zinc-400 absolute ${
                    lang === 'ar' ? 'right-3' : 'left-3'
                  } top-3`}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className={`w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl ${
                    lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  } py-2 text-sm text-white focus:outline-none shadow-sm placeholder:text-zinc-400`}
                  required
                />
              </div>
            </div>

            {/* Nombre de personnes */}
            <div>
              <label className="text-xs font-semibold text-zinc-200 mb-1 block [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
                {t.guestCountLabel} <span className="text-[#C9A15A]">*</span>
              </label>
              <div className="relative">
                <Users
                  className={`w-4 h-4 text-zinc-400 absolute ${
                    lang === 'ar' ? 'right-3' : 'left-3'
                  } top-3`}
                />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full bg-[#0B0B0C] border border-white/20 focus:border-[#C9A15A] rounded-xl ${
                    lang === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  } py-2 text-sm text-white focus:outline-none shadow-sm`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A15A] via-[#B08D48] to-[#8C7040] text-[#0B0B0C] font-extrabold text-sm py-3 px-5 rounded-xl shadow-lg hover:brightness-110 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <span>{t.submitButton}</span>
                </>
              )}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};
