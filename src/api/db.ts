import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import { sql } from 'drizzle-orm';
import { serverEnv } from '../utils/env/server';

export const db = drizzle(new Database(serverEnv.DATABASE_URL), {
  schema,
  logger: Bun.env.NODE_ENV === 'development',
});

db.run(
  sql`CREATE TABLE IF NOT EXISTS todo (id TEXT PRIMARY KEY, data TEXT NOT NULL);`
);
