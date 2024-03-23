import Database from 'better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from '@wsh-2024/schema/src/models';

import { DATABASE_PATH } from '../constants/paths';

let sqlite: Database.Database | null = null;
let database: BetterSQLite3Database<typeof schema> | null = null;

export function initializeDatabase() {
  if (sqlite != null) {
    sqlite.close();
    sqlite = null;
    database = null;
  }

  sqlite = new Database(DATABASE_PATH, {
    readonly: false,
  });
  database = drizzle(sqlite, { schema });
}

export function getDatabase() {
  if (sqlite == null || database == null) {
    throw new Error('Database is not initialized');
  }

  return database;
}
