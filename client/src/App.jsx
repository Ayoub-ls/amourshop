import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';

// Main App Component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <footer className="bg-white border-t border-pink-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <p className="font-display font-bold text-primary text-xl mb-4">Amourshop</p>
                  <p className="text-gray-400 text-sm">© 2026 Amourshop Kids. Made with ❤️ for your little ones.</p>
                </div>
              </footer>
            </div>
          </Router>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
