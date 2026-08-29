import { Pool } from 'pg';

let pool: Pool;

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: process.env.NODE_ENV === 'production' ? 20 : 10,
  min: 2,                         // keep 2 connections warm
  idleTimeoutMillis: 10000,       // release idle connections faster (Neon serverless)
  connectionTimeoutMillis: 5000,  // fail fast
  allowExitOnIdle: false,
};

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  if (!global.__pgPool) {
    global.__pgPool = new Pool(poolConfig);
  }
  pool = global.__pgPool;
}

// Silence connection errors so they don't crash the server
pool.on('error', (err) => {
  console.error('[pg pool] idle client error:', err.message);
});

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  const client = await pool.connect();
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

export default pool;

