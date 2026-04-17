import { assets } from "../assets/assets";


export const initialProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    description: 'A premium cotton classic white t-shirt, perfect for everyday wear.',
    price: 29.99,
    category: 'Baby',
    sizes: ['S', 'M', 'L', 'XL'],
    image_url: assets.baby1,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Classic White T-Shirt',
    description: 'A premium cotton classic white t-shirt, perfect for everyday wear.',
    price: 29.99,
    category: 'Baby',
    sizes: ['S', 'M', 'L', 'XL'],
    image_url: assets.baby2,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Classic White T-Shirt',
    description: 'A premium cotton classic white t-shirt, perfect for everyday wear.',
    price: 29.99,
    category: 'Baby',
    sizes: ['S', 'M', 'L', 'XL'],
    image_url: assets.baby3,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket with a vintage finish and comfortable lining.',
    price: 199.99,
    category: 'kids',
    sizes: ['M', 'L'],
    image_url: assets.kids1,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Slim Fit Denim Jeans',
    description: 'Comfortable stretch denim jeans tailored for a modern slim fit.',
    price: 59.99,
    category: 'Kids',
    sizes: ['30', '32', '34'],
    image_url: assets.kids2,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Slim Fit Denim Jeans',
    description: 'Comfortable stretch denim jeans tailored for a modern slim fit.',
    price: 59.99,
    category: 'Kids',
    sizes: ['30', '32', '34'],
    image_url: assets.kids3,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'Slim Fit Denim Jeans',
    description: 'Comfortable stretch denim jeans tailored for a modern slim fit.',
    price: 59.99,
    category: 'Kids',
    sizes: ['30', '32', '34'],
    image_url: assets.kids4,
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    name: 'Slim Fit Denim Jeans',
    description: 'Comfortable stretch denim jeans tailored for a modern slim fit.',
    price: 59.99,
    category: 'Kids',
    sizes: ['30', '32', '34'],
    image_url: assets.kids5,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Minimalist Handbag',
    description: 'Sleek and versatile leather handbag for every occasion.',
    price: 89.99,
    category: 'Accessories',
    sizes: ['One Size'],
    image_url: assets.acc1,
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    name: 'Minimalist Handbag',
    description: 'Sleek and versatile leather handbag for every occasion.',
    price: 89.99,
    category: 'Accessories',
    sizes: ['One Size'],
    image_url: assets.acc2,
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    name: 'Minimalist Handbag',
    description: 'Sleek and versatile leather handbag for every occasion.',
    price: 89.99,
    category: 'Accessories',
    sizes: ['One Size'],
    image_url: assets.acc3,
    created_at: new Date().toISOString()
  },
];

export const initialOrders = [
  {
    id: 1,
    user_id: 2,
    total_price: 229.98,
    status: 'Accessories',
    shipping_address: { street: '123 Fake St', city: 'Mockville', zip: '12345' },
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const initialUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@amourshop.com',
    password: 'password123',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Test Customer',
    email: 'test@amourshop.com',
    password: 'password123',
    role: 'user',
    created_at: new Date().toISOString()
  }
];
