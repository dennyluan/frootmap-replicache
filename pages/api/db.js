import pgInit from 'pg-promise';

export async function getDB() {
  const pgp = pgInit();
  const db = pgp({
    connectionString: process.env.NEXT_PUBLIC_REPLICHAT_DB_CONNECTION_STRING,
  });
  await db.connect();
  return db;
}