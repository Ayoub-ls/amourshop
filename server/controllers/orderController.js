import { query } from '../config/db.js';

export const createOrder = async (req, res) => {
  const { items, total_price, shipping_address } = req.body;
  const user_id = req.user.id;

  try {
    // Start transaction
    await query('BEGIN');

    const orderResult = await query(
      'INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, $2, $3) RETURNING id',
      [user_id, total_price, JSON.stringify(shipping_address)]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await query('COMMIT');
    res.status(201).json({ id: orderId, message: 'Order placed successfully' });
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    let sql = 'SELECT * FROM orders';
    let params = [];

    if (req.user.role !== 'admin') {
      sql += ' WHERE user_id = $1';
      params.push(req.user.id);
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
