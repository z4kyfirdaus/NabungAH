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

  return db

}