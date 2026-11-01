import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'kasvualusta.db')
const SCHEMA_PATH = path.join(process.cwd(), 'lib', 'schema.sql')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'))
  }
  return db
}
