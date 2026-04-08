const express = require('express');
const cors = require('cors');
const { initDatabase, queryAll, queryGet, queryRun } = require('./database');

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

let db = null;

// Initialize DB before handling any requests
async function startServer() {
  db = await initDatabase();

  // GET all orders
  app.get('/api/orders', (req, res) => {
    try {
      const rows = queryAll(db, 'SELECT * FROM orders ORDER BY createdAt DESC');

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
      const lastId = queryRun(
        db,
        `INSERT INTO orders (customerName, items, status, category) VALUES (?, ?, ?, ?)`,
        [customerName, itemsJson, status, orderCategory]
      );

      // Fetch the newly created order
      const row = queryGet(db, `SELECT * FROM orders WHERE id = ?`, [lastId]);
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
      const row = queryGet(db, `SELECT status FROM orders WHERE id = ?`, [parseInt(id)]);
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

      db.run(`UPDATE orders SET status = ? WHERE id = ?`, [targetStatus, parseInt(id)]);

      const updatedRow = queryGet(db, `SELECT * FROM orders WHERE id = ?`, [parseInt(id)]);
      updatedRow.items = JSON.parse(updatedRow.items);
      res.json(updatedRow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
