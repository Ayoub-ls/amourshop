import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { createOrder } from '../services/api';


export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    city: ''
  });
  const [shippingFee, setShippingFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saharaCities = [
    "Adrar", "Tamanrasset", "Illizi", "Tindouf", "Ghardaïa", "Béchar", "Ouargla", "El Oued", "Naâma", "El Bayadh", "Biskra", "Laghouat"
  ];

  const handleCityChange = (city) => {
    setFormData({ ...formData, city });
    if (!city) {
      setShippingFee(0);
    } else if (city === "Alger") {
      setShippingFee(400);
    } else if (["Boumerdès", "Blida", "Tipaza"].includes(city)) {
      setShippingFee(500);
    } else if (saharaCities.includes(city)) {
      setShippingFee(1000);
    } else {
      setShippingFee(600);
    }
  };

  const algerianStates = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
    "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annabba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
    "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createOrder({
        user_id: user ? (user.id || user._id) : 'guest',
        total_price: total + shippingFee,
        shipping_address: formData,
        items: cart
      });
      alert('Commande effectuée avec succès !');
      clearCart();
      navigate('/');
    } catch (error) {
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-12 text-center">{t('checkout')}</h1>

      <div className="cute-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville (Wilaya)</label>
            <select
              required
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Sélectionnez votre ville</option>
              {algerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>


          <div className="border-t border-pink-100 pt-6 mt-8 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span className="font-medium">{total} DA</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de livraison</span>
              <span className="font-medium">{shippingFee} DA</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-dashed border-pink-50">
              <span>Total à payer</span>
              <span className="text-primary">{total + shippingFee} DA</span>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-lg transition-all mt-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed rounded-full text-white font-bold' : 'primary-button'}`}>
              {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
