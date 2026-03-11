import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, ShoppingBag, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'baby',
    sizes: ['0-3m', '3-6m', '6-12m'],
    image_url: ''
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const prodRes = await fetch('/api/products');
      setProducts(await prodRes.json());

      const orderRes = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(await orderRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
        setNewProduct({ name: '', description: '', price: '', category: 'baby', sizes: ['0-3m', '3-6m', '6-12m'], image_url: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-4 bg-white p-1 rounded-full shadow-sm border border-pink-50">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-pink-50'}`}
          >
            <Package size={18} /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-pink-50'}`}
          >
            <ShoppingBag size={18} /> Orders
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold">Manage Products</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="primary-button flex items-center gap-2"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="cute-card p-4 flex gap-4">
                <img src={p.image_url || 'https://picsum.photos/seed/kids/100/100'} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-grow">
                  <h3 className="font-bold truncate">{p.name}</h3>
                  <p className="text-primary font-bold">{p.price} DA</p>
                  <div className="flex gap-2 mt-2">
                    <button className="p-2 text-gray-400 hover:text-accent-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="cute-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-pink-50 text-gray-600 font-bold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="p-4 font-mono text-sm">#{o.id}</td>
                  <td className="p-4 font-bold">{o.total_price} DA</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-display font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-pink-100"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Price (DA)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-xl border border-pink-100"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-pink-100"
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="baby">Baby</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Image URL (Cloudinary)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-xl border border-pink-100"
                    value={newProduct.image_url}
                    onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    placeholder="Paste Cloudinary URL here"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-xl border border-pink-100"
                    rows="3"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-grow cute-button bg-gray-100 text-gray-500">Cancel</button>
                <button type="submit" className="flex-grow primary-button">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
