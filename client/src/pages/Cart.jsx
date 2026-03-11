import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { t } = useLanguage();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet!</p>
        <Link to="/shop" className="primary-button inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-12">{t('cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cute-card p-4 flex gap-6 items-center">
              <img
                src={item.image_url || 'https://picsum.photos/seed/kids/200/200'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-2xl"
              />
              <div className="flex-grow">
                <h3 className="font-display font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-2">Size: {item.size || 'N/A'}</p>
                <p className="text-primary font-bold">{item.price} DA</p>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 rounded-full px-3 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="cute-card p-8 sticky top-24">
            <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{total} DA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="border-t border-pink-100 pt-4 flex justify-between text-xl font-bold">
                <span>{t('total')}</span>
                <span className="text-primary">{total} DA</span>
              </div>
            </div>
            <Link to="/checkout" className="primary-button w-full text-center block py-3">
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
