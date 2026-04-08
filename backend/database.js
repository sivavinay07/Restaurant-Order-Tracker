const initSqlJs = require('sql.js');

let db = null;

// Initialize the database (async)
async function initDatabase() {
  if (db) return db;

  const SQL = await initSqlJs();
  db = new SQL.Database();

  // Create orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    items TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT DEFAULT 'Veg',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('SQLite (sql.js) database initialized.');
  return db;
}

// Helper: run a query and return all rows as objects
function queryAll(database, sql, params = []) {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: run a query and return the first row
function queryGet(database, sql, params = []) {
  const rows = queryAll(database, sql, params);
  return rows[0] || null;
}

// Helper: run an INSERT/UPDATE/DELETE, return lastInsertRowid
function queryRun(database, sql, params = []) {
  database.run(sql, params);
  const result = database.exec('SELECT last_insert_rowid() as id');
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0];
  }
  return null;
}

module.exports = { initDatabase, queryAll, queryGet, queryRun };
