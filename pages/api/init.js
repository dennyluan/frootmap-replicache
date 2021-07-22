import {db} from '../../db.js';

import {supabase} from '../../utils/supabase.js';

export default async (_, res) => {
  await db.task(async t => {
    await t.none('DROP TABLE IF EXISTS fruit');
    await t.none('DROP TABLE IF EXISTS pin');
    await t.none('DROP TABLE IF EXISTS replicache_client');
    await t.none('DROP SEQUENCE IF EXISTS version');

    // Stores chat messages
    await t.none(`CREATE TABLE pin (
      id VARCHAR(20) PRIMARY KEY NOT NULL,
      text TEXT null,
      description TEXT null,
      ord BIGINT null,
      sender VARCHAR(255) null,
      lat NUMERIC null,
      lng NUMERIC null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
      deleted_at timestamp with time zone null,
      version BIGINT null)`);
    // Stores last mutation ID for each Replicache client
    await t.none(`CREATE TABLE replicache_client (
      id VARCHAR(36) PRIMARY KEY NOT NULL,
      last_mutation_id BIGINT NOT NULL)`);
    // Will be used for computing diffs for pull response
    await t.none('CREATE SEQUENCE version');
  });
  res.send('ok');
};



