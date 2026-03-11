import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-40">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[40px] overflow-hidden bg-white shadow-sm border border-pink-50"
        >
          <img
            src={product.image_url || 'https://picsum.photos/seed/kids/800/1000'}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">{product.price} DA</p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description || "This adorable piece is perfect for your little one's daily adventures. Made with soft, breathable fabric to ensure maximum comfort all day long."}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-full border-2 transition-all font-bold ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-pink-100 text-gray-400 hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-4 bg-white border border-pink-100 rounded-full px-4 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-primary">-</button>
              <span className="font-bold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-primary">+</button>
            </div>

            <button
              onClick={() => addToCart(product, quantity, selectedSize)}
              className="flex-grow primary-button py-4 flex items-center justify-center gap-3 text-lg"
            >
              <ShoppingCart size={24} /> {t('addToCart')}
            </button>

            <button className="p-4 rounded-full border border-pink-100 text-gray-300 hover:text-primary hover:border-primary transition-all">
              <Heart size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
