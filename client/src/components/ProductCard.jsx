import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="cute-card overflow-hidden group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.image_url || 'https://picsum.photos/seed/kids/400/500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors"
            title={t('addToCart')}
          >
            <ShoppingCart size={20} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-accent-blue hover:text-white transition-colors"
            title={t('quickView')}
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">{product.category}</p>
        <h3 className="font-display font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        <p className="text-primary font-bold text-lg">{product.price} DA</p>
      </div>
    </motion.div>
  );
}
