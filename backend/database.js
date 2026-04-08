const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'orders.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        items TEXT NOT NULL,
        status TEXT NOT NULL,
        category TEXT DEFAULT 'Veg',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating orders table', err.message);
        } else {
            console.log('Orders table ready.');
            // Add category column if it doesn't exist (in case table already existed)
            db.run(`ALTER TABLE orders ADD COLUMN category TEXT DEFAULT 'Veg'`, (err) => {
                // Ignore error if column already exists
            });
        }
    });
  }
});

module.exports = db;
