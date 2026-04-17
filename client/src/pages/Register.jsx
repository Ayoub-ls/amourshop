import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { initialUsers } from '../services/demoData';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (initialUsers.find(u => u.email === email)) {
      setError('L\\'utilisateur existe déjà');
      return;
    }
    const newUser = { id: Date.now(), name, email, password, role: 'user' };
    login(newUser, `mock-token-${newUser.id}`);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-sm border border-pink-50"
      >
        <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900">Créer un compte</h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full primary-button py-3 text-lg">
            S'inscrire
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Connectez-vous ici
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
