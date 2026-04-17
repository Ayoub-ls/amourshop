import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <nav className={`fixed w-screen top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 md:gap-8 min-w-0">
            <Link to="/" className="text-xl md:text-2xl font-display font-bold text-primary truncate">
              Amourshop
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">{t('home')}</Link>
              <Link to="/shop" className="text-gray-600 hover:text-primary transition-colors">{t('shop')}</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">

            <Link to="/cart" className="p-2 hover:bg-pink-50 rounded-full transition-colors relative">
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-[10px] md:text-xs font-bold text-accent-purple hover:underline">Admin</Link>
                )}
                <button onClick={logout} className="text-sm text-gray-600 hover:text-primary">{t('logout')}</button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-pink-50 rounded-full transition-colors">
                <User size={22} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
