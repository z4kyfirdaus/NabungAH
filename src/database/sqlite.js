import { CapacitorSQLite } from '@capacitor-community/sqlite'

const sqlite = new CapacitorSQLite()

export async function initDB() {

  const db = await sqlite.createConnection(
    "nabungah",
    false,
    "no-encryption",
    1,
    false
  )

  await db.open()

await db.execute(`
CREATE TABLE IF NOT EXISTS wallet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    icon TEXT,
    saldo REAL DEFAULT 0,
    warna TEXT,
    created_at TEXT
);
`)
  
    return db

}
