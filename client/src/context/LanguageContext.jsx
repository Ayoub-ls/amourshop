import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    cart: 'Panier',
    login: 'Connexion',
    logout: 'Déconnexion',
    featured: 'Produits Vedettes',
    newArrivals: 'Nouveautés',
    categories: 'Catégories',
    addToCart: 'Ajouter au panier',
    checkout: 'Paiement',
    total: 'Total',
    search: 'Rechercher...',
    baby: 'Bébé',
    kids: 'Enfants',
    accessories: 'Accessoire',
    testimonials: 'Témoignages',
    newsletter: 'Newsletter',
    subscribe: 'S\'abonner',
    orderNow: 'Commander',
    quickView: 'Aperçu rapide',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    cart: 'السلة',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    featured: 'المنتجات المميزة',
    newArrivals: 'وصل حديثاً',
    categories: 'الفئات',
    addToCart: 'أضف إلى السلة',
    checkout: 'الدفع',
    total: 'الإجمالي',
    search: 'بحث...',
    baby: 'رضيع',
    kids: 'أطفال',
    accessories: 'إكسسوارات',
    testimonials: 'آراء العملاء',
    newsletter: 'النشرة الإخبارية',
    subscribe: 'اشتراك',
    orderNow: 'اطلب الآن',
    quickView: 'عرض سريع',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return ['fr', 'ar'].includes(storedLang) ? storedLang : 'fr';
  });

  const toggleLang = () => {
    const newLang = lang === 'fr' ? 'ar' : 'fr';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => {
    const translationSet = translations[lang] || translations.fr;
    return translationSet[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isRtl: lang === 'ar' }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
