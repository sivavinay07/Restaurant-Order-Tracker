const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Fixed status flow order
const STATUS_FLOW = {
  'Preparing': 'Ready',
  'Ready': 'Completed',
  'Completed': null
};

// GET all orders
app.get('/api/orders', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    
    // Parse items back to JSON
    const orders = rows.map(row => ({
      ...row,
      items: JSON.parse(row.items)
    }));
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new order
app.post('/api/orders', (req, res) => {
  const { customerName, items, category } = req.body;
  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name and an array of items are required.' });
  }

  const status = 'Preparing';
  const orderCategory = category || 'Veg';
  const itemsJson = JSON.stringify(items);

  try {
    const insert = db.prepare(`INSERT INTO orders (customerName, items, status, category) VALUES (?, ?, ?, ?)`);
    const info = insert.run(customerName, itemsJson, status, orderCategory);
    
    // Fetch the newly created order
    const row = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(info.lastInsertRowid);
    row.items = JSON.parse(row.items);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update order status
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  
  try {
    const row = db.prepare(`SELECT status FROM orders WHERE id = ?`).get(id);
    if (!row) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    
    const currentStatus = row.status;
    
    if (newStatus) {
      if (STATUS_FLOW[currentStatus] !== newStatus) {
        return res.status(400).json({ error: `Invalid status transition from ${currentStatus} to ${newStatus}` });
      }
    }
    
    const targetStatus = newStatus || STATUS_FLOW[currentStatus];
    if (!targetStatus) {
      return res.status(400).json({ error: 'Order is already completed or cannot be updated further.' });
    }

    db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(targetStatus, id);
    
    const updatedRow = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(id);
    updatedRow.items = JSON.parse(updatedRow.items);
    res.json(updatedRow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
