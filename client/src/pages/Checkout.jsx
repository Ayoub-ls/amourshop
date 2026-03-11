import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import API from '../services/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    city: '',
    address: ''
  });

  const algerianStates = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
    "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
    "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API + '/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
          total_price: total,
          shipping_address: formData
        })
      });

      if (res.ok) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/');
      } else {
        alert('Failed to place order. Please login first.');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-12 text-center">{t('checkout')}</h1>

      <div className="cute-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City (Wilaya)</label>
            <select
              required
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            >
              <option value="">Select your city</option>
              {algerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Address</label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="border-t border-pink-100 pt-6 mt-8">
            <div className="flex justify-between text-xl font-bold mb-8">
              <span>Total to Pay</span>
              <span className="text-primary">{total} DA</span>
            </div>
            <button type="submit" className="w-full primary-button py-4 text-lg">
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
