import { Pool } from 'pg';

let pool: Pool | undefined;

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('Database is not configured. Set DATABASE_URL before using store data.');
  }

  const createPool = () => {
    const instance = new Pool({
      connectionString,
      // Neon requires TLS. Keep certificate validation enabled in production;
      // the connection URL is the source of truth for its SSL requirements.
      ssl: process.env.NODE_ENV === 'development' ? { rejectUnauthorized: false } : undefined,
      max: process.env.NODE_ENV === 'production' ? 10 : 5,
      min: 0,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      allowExitOnIdle: true,
    });

    instance.on('error', (error) => {
      console.error('[database] idle pool error:', error.message);
    });
    return instance;
  };

  if (process.env.NODE_ENV === 'production') {
    pool = createPool();
  } else {
    global.__pgPool ??= createPool();
    pool = global.__pgPool;
  }

  return pool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  let client;
  try {
    client = await getPool().connect();
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown connection error';
    throw new Error(`Unable to connect to the store database: ${detail}`, { cause: error });
  }
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 200) {
      console.log(`[SQL Slow Query] (${duration}ms) ${text.slice(0, 120)}`);
    }
    return res;
  } finally {
    client.release();
  }
}

export default getPool;
