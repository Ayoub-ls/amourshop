import { query } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM products';
    let params = [];

    if (category || search) {
      sql += ' WHERE';
      if (category) {
        params.push(category);
        sql += ` category = $${params.length}`;
      }
      if (search) {
        if (category) sql += ' AND';
        params.push(`%${search}%`);
        sql += ` name ILIKE $${params.length}`;
      }
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, category, sizes, image_url } = req.body;
  try {
    const result = await query(
      'INSERT INTO products (name, description, price, category, sizes, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category, JSON.stringify(sizes), image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, price, category, sizes, image_url } = req.body;
  try {
    const result = await query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, sizes = $5, image_url = $6 WHERE id = $7 RETURNING *',
      [name, description, price, category, JSON.stringify(sizes), image_url, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
