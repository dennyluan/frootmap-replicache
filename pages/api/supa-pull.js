import {db} from '../../db.js';

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

// |pins|
// id                 varchar
// text               text
// description        text
// version            int8
// sender             varchar
// ord                int8
// lat                float8
// lng                float8

export default async (req, res) => {

  const pull = req.body;
  console.log(`[pull] Processing pull`, JSON.stringify(pull, null, ''));
  const t0 = Date.now();


  try {
    // console.log("")
    db.tx(async t => {

      const lastMutationID = parseInt(
        (
          await db.oneOrNone(
            'select last_mutation_id from replicache_client where id = $1',
            pull.clientID,
          )
        )?.last_mutation_id ?? '0',
      );

      const changed = await db.manyOrNone(
        'select id, sender, text, description, lat, lng, ord from pin where version > $1',
        parseInt(pull.cookie ?? 0),
      );


      const cookie = (
        await db.one('select max(version) as version from pin')
      ).version;


      // console.log({cookie, lastMutationID, changed});


      const patch = [];
      if (pull.cookie === null) {
        patch.push({
          op: 'clear',
        });
      }

      // push all pending changes as patches
      patch.push(...changed.map(row => ({
          op: 'put',
          key: `pin/${row.id}`,
          value: {
            from: row.sender,
            text: row.text,
            lat: row.lat,
            lng: row.lng,
            order: parseInt(row.ord),
          },
        })));

      res.json({
        lastMutationID,
        cookie,
        patch,
      })

    })
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('[pull] >>>> Processed pull in', Date.now() - t0);
  }

}