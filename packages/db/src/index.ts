import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';
export { sql, eq, and, or, ilike, desc, asc, inArray, isNull, isNotNull } from 'drizzle-orm';

let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  if (!client) {
    client = postgres(url, { prepare: false });
  }
  return drizzle(client, { schema, logger: process.env.NODE_ENV !== 'production' });
}

export type Database = ReturnType<typeof getDb>;
