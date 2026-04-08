const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'orders.db');
const db = new Database(dbPath);

console.log('Connected to the better-sqlite3 database.');

// Create table synchronously
db.exec(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    items TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT DEFAULT 'Veg',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Ensure category column exists (ALTER TABLE handles this)
try {
    db.exec(`ALTER TABLE orders ADD COLUMN category TEXT DEFAULT 'Veg'`);
} catch (err) {
    // Column likely already exists
}

console.log('Orders table ready.');

module.exports = db;
