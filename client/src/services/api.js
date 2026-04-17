const BASE_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_SERVER_URL}/api`;

export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    const baseUrl = BASE_SERVER_URL;
    return data.map(product => ({
        ...product,
        image_url: product.image_url.startsWith('/') ? `${baseUrl}${product.image_url}` : product.image_url
    }));
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    const baseUrl = BASE_SERVER_URL;
    return {
        ...data,
        image_url: data.image_url.startsWith('/') ? `${baseUrl}${data.image_url}` : data.image_url
    };
};

export const createProduct = async (product) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
};

export const fetchOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export const updateOrder = async (id, orderData) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
};

export const createOrder = async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to upload image');
    
    // Cloudinary URLs are fully external (http/https). Local fallback URLs start with '/'
    const baseUrl = BASE_SERVER_URL;
    return { 
        ...data, 
        image_url: data.image_url.startsWith('/') ? `${baseUrl}${data.image_url}` : data.image_url 
    };
};
