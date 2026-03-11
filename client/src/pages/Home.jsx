import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useLanguage();

  const categories = [
    { id: 'baby', name: t('baby'), color: 'bg-secondary', img: 'https://picsum.photos/seed/baby/400/400' },
    { id: 'kids', name: t('kids'), color: 'bg-accent-blue', img: 'https://picsum.photos/seed/kids/400/400' },
    { id: 'accessories', name: t('accessories'), color: 'bg-accent-purple', img: 'https://picsum.photos/seed/toy/400/400' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/amourshop/1920/1080"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-soft via-bg-soft/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold mb-6">
              New Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
              Adorable Outfits for Your <span className="text-primary italic">Little Ones</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover our curated collection of soft, comfortable, and stylish clothing for babies and kids.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="primary-button flex items-center gap-2">
                {t('shop')} <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-center mb-12">{t('categories')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative h-64 rounded-3xl overflow-hidden group cursor-pointer ${cat.color}`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-display font-bold text-white drop-shadow-md">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Section Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 bg-white rounded-[40px] shadow-sm border border-pink-50">
        <h2 className="text-3xl font-display font-bold mb-4">{t('featured')}</h2>
        <p className="text-gray-500 mb-8">Check out our most loved pieces this season!</p>
        <Link to="/shop" className="secondary-button inline-block">
          View All Products
        </Link>
      </section>
    </div>
  );
}
