import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, ShoppingBag, LayoutDashboard, LogOut, Search, TrendingUp, DollarSign, Users, X, UploadCloud } from 'lucide-react';
import { fetchProducts, fetchOrders, createProduct, deleteProduct, uploadImage, updateOrder } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Baby',
    sizes: ['0-3m', '3-6m', '6-12m'],
    image_url: ''
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    } else {
      setDashboardLoading(true);
      Promise.all([fetchProducts(), fetchOrders()])
        .then(([productsData, ordersData]) => {
          setProducts(productsData);
          setOrders(ordersData);
        })
        .catch(err => console.error(err))
        .finally(() => setDashboardLoading(false));
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = newProduct.image_url;

    if (imageFile) {
        try {
            const data = await uploadImage(imageFile);
            finalImageUrl = data.image_url;
        } catch (err) {
            alert("Error uploading image");
            setIsUploading(false);
            return;
        }
    }

    createProduct({ ...newProduct, image_url: finalImageUrl })
      .then(savedProduct => {
        setProducts([savedProduct, ...products]);
        setShowAddModal(false);
        setNewProduct({ name: '', description: '', price: '', category: 'Baby', sizes: ['0-3m', '3-6m', '6-12m'], image_url: '' });
        setImageFile(null);
      })
      .catch(err => alert("Error adding product"))
      .finally(() => setIsUploading(false));
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    deleteProduct(id).then(() => {
        setProducts(products.filter(p => p.id !== id));
    }).catch(err => alert("Error deleting product"));
  };

  const handleUpdateOrderStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Processing' ? 'Shipped' : 'Processing';
    try {
        const updated = await updateOrder(id, { status: newStatus });
        setOrders(orders.map(o => (o.id || o._id) === id ? updated : o));
    } catch (err) {
        alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return (o.status || 'Processing') === orderFilter;
  });

  // Stats for the dashboard tab
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;

  if (authLoading || dashboardLoading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white border-r border-gray-100 flex-shrink-0 hidden md:flex flex-col relative z-20"
      >
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <span className="text-white font-bold font-display text-xl">A</span>
            </div>
            <h2 className="font-display font-bold text-xl text-gray-900">AdminPanel</h2>
          </div>
        </div>
        
        <div className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
          
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-pink-500' : ''} />
              {item.label}
              {activeTab === item.id && (
                <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 h-8 bg-pink-500 rounded-r-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu button could go here */}
            <h1 className="text-2xl font-display font-bold text-gray-900 capitalize">
              {activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm w-48" />
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=fbcfe8&color=be185d`} alt="Admin" className="w-10 h-10 rounded-full border border-pink-100" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
          
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                      <DollarSign size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} DA</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Package size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-display font-bold text-lg text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                          <th className="p-4 pl-6">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id || o._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 pl-6 font-mono font-medium">#{o.id || o._id}</td>
                            <td className="p-4">User {o.user_id}</td>
                            <td className="p-4 font-bold text-gray-900">{o.total_price} DA</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${(o.status || 'Processing') === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {o.status || 'Processing'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">
                              {new Date(o.createdAt || o.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div 
                key="products"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                    <p className="text-sm text-gray-500">Manage your store's products</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    <Plus size={20} /> Add Product
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {products.map(p => (
                      <motion.div 
                        key={p.id} 
                        layout
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <img src={p.image_url || 'https://picsum.photos/seed/kids/400/400'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 rounded-lg shadow-sm">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-white/90 backdrop-blur text-gray-700 hover:text-red-500 rounded-lg shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-800 shadow-sm capitalize">
                            {p.category}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 truncate mb-1" title={p.name}>{p.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-pink-500 font-bold text-lg">{p.price} DA</p>
                            <p className="text-xs text-gray-400">{p.sizes.length} variants</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg text-gray-900">All Orders</h3>
                  <div className="bg-gray-100 rounded-xl p-1 flex">
                    {['All', 'Processing', 'Shipped'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setOrderFilter(f)} 
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${orderFilter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Customer ID</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {filteredOrders.map(o => (
                        <tr key={o.id || o._id} className="hover:bg-pink-50/30 transition-colors">
                          <td className="p-4 pl-6 font-mono font-medium text-gray-900">#{o.id || o._id}</td>
                          <td className="p-4 text-gray-600">{o.user_id}</td>
                          <td className="p-4 font-bold text-gray-900">{o.total_price} DA</td>
                          <td className="p-4">
                            <button 
                              onClick={() => handleUpdateOrderStatus(o.id || o._id, o.status || 'Processing')}
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity ${(o.status || 'Processing') === 'Shipped' ? 'bg-green-100 text-green-700 shadow-green-500/20' : 'bg-yellow-100 text-yellow-700 shadow-yellow-500/20'}`}
                              title="Click to toggle status"
                            >
                              {o.status || 'Processing'}
                            </button>
                          </td>
                          <td className="p-4 text-gray-500">
                            {new Date(o.createdAt || o.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Add Product Modal (AnimatePresence allows exit animations) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-display font-bold text-gray-900">Create Product</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="add-product-form" onSubmit={handleAddProduct} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Name</label>
                      <input
                        type="text" required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
                        placeholder="e.g. Vintage Leather Jacket"
                        value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Price (DA)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400">DA</span>
                        <input
                          type="number" required
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
                          placeholder="0.00"
                          value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white appearance-none"
                        value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option value="Baby">Baby</option>
                        <option value="Kids">Kids</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Image Upload</label>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-pink-400 transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-1 text-sm text-gray-500"><span className="font-bold">Click to upload</span></p>
                            <p className="text-xs text-gray-500">{imageFile ? imageFile.name : "PNG, JPG or WEBP"}</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={e => {
                            if(e.target.files && e.target.files[0]) {
                              setImageFile(e.target.files[0]);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white resize-none"
                        rows="3"
                        placeholder="Brief product description..."
                        value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" form="add-product-form" disabled={isUploading} className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all ${isUploading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 shadow-pink-500/30 hover:-translate-y-0.5'}`}>
                  {isUploading ? 'Uploading & Publishing...' : 'Publish Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
