import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import process from 'node:process';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

export const client = postgres(connectionString!, { prepare: false });
export const db = drizzle(client);
