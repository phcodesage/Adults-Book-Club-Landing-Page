/**
 * lib/mongodb.ts
 *
 * Singleton MongoDB client for Next.js serverless API routes.
 * Re-uses the same connection across hot-reloads in development
 * and across invocations in production (module-level caching).
 */

import { MongoClient, type Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    'MONGO_URI environment variable is not set. Add it to .env.local:\n  MONGO_URI=mongodb://localhost:27017/book-club'
  );
}

// Module-level cache — persists across hot reloads in dev
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGO_URI!, { serverSelectionTimeoutMS: 5000 });
    await client.connect();

    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB in lib/mongodb.ts:');
    console.error(error);
    throw error;
  }
}
