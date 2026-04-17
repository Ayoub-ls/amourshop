import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const baby = products.filter(p =>
    p.category.toLowerCase() === 'baby'
  );
  const kids = products.filter(p =>
    p.category.toLowerCase() === 'kids'
  );
  const accessories = products.filter(p =>
    p.category.toLowerCase() === 'accessories'
  );

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="./hero.jpg"
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
              Nouvelle Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
              Des tenues adorables pour vos <span className="text-primary italic">petits</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez notre sélection de vêtements doux, confortables et stylés pour bébés et enfants.
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
      {loading ? (
        <div className="flex justify-center p-12">Chargement des produits...</div>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-display font-bold mb-12">{t('categories')} - Baby</h2>
            <div className="flex overflow-x-scroll gap-6 md:gap-8">
              {baby.map(product => (
                <ProductCard className="min-w-1/2 w-1/2 md:w-1/3 md:min-w-1/3 lg:w-1/4 lg:min-w-1/4" key={product.id} product={product} />
              ))}
            </div>
            <h2 className="text-3xl font-display font-bold mb-12">{t('categories')} - Kids</h2>
            <div className="flex overflow-x-scroll gap-6 md:gap-8">
              {kids.map(product => (
                <ProductCard className="min-w-1/2 w-1/2 md:w-1/3 md:min-w-1/3 lg:w-1/4 lg:min-w-1/4" key={product.id} product={product} />
              ))}
            </div>
            <h2 className="text-3xl font-display font-bold mb-12">{t('categories')} - Accessories</h2>
            <div className="flex overflow-x-scroll gap-6 md:gap-8">
              {accessories.map(product => (
                <ProductCard className="min-w-1/2 w-1/2 md:w-1/3 md:min-w-1/3 lg:w-1/4 lg:min-w-1/4" key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Section Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 bg-white rounded-[40px] shadow-sm border border-pink-50">
        <h2 className="text-3xl font-display font-bold mb-4">{t('featured')}</h2>
        <p className="text-gray-500 mb-8">Découvrez nos pièces préférées cette saison !</p>
        <Link to="/shop" className="secondary-button inline-block">
          Voir tous les produits
        </Link>
      </section>
    </div>
  );
}
