import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
import * as schema from './schema';
export const db = drizzle(sql, {schema});