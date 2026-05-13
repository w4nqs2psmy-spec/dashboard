import Database from 'better-sqlite3'
import path from 'path'
import { CREATE_TABLES } from './schema'

const DB_PATH = path.join(process.cwd(), 'kasvualusta.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.exec(CREATE_TABLES)
  }
  return db
}
