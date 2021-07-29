import {db} from '../../db.js';
import Pusher from 'pusher';
import { supabase } from '../../utils/supabase';

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

  const push = req.body;
  console.log(' [push] >>> Processing push', JSON.stringify(push, null, ''));

  const t0 = Date.now();
  try {
    await db.tx(async t => {
      const {nextval: version} = await db.one("SELECT nextval('version')");
      console.log("version", version)

      let lastMutationID = await getLastMutationID(t, push.clientID);

      console.log('[push] version', version, 'lastMutationID:', lastMutationID);

      for (const mutation of push.mutations) {
        const t1 = Date.now();

        const expectedMutationID = lastMutationID + 1;

        if (mutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`,
          );
          continue;
        }
        if (mutation.id > expectedMutationID) {
          console.warn(`Mutation ${mutation.id} is from the future - aborting`);
          break;
        }

        console.log('[push] Processing mutation:', JSON.stringify(mutation));

        switch (mutation.name) {
          case 'createPin':
            await createPin(t, mutation.args, version);
            break;
          case 'deletePin':
            await deletePin(t, mutation.args, version);
            break;
          default:
            throw new Error(`Unknown mutation: ${mutation.name}`);
        }

        lastMutationID = expectedMutationID;
        console.log('[push] Processed mutation in', Date.now() - t1);
      }

      await sendPoke();

      console.log(
        'setting', push.clientID, 'last_mutation_id to', lastMutationID
      );

      await t.none(
        'UPDATE replicache_client SET last_mutation_id = $2 WHERE id = $1',
        [push.clientID, lastMutationID],
      );
      res.send('{}');

      console.log("\n[push] RES:", res.statusCode)
    })
  } catch (e) {
    console.error("\n\n\n[push error] >>\n\n", e);
    res.status(500).send(e.toString());
  } finally {
    console.log('[push] >> Processed push in', Date.now() - t0);
    console.log("\n\n\n\n\n\n")
  }

}

async function createPin(db, {id, sender, text, description, ord, lat, lng, created_at, updated_at}, version) {
  try {
    console.log("[push] createpin payload:", { id, sender, text, description, lat, lng, ord, version, created_at, updated_at })
    const { data, error } = await supabase
      .from('pin')
      .insert({ id, sender, text, description, lat, lng, ord, version, created_at, updated_at })

  } catch (error) {
    console.log("!!!#### push error", error)
  }
}

async function deletePin(db, {id}, version) {
  let pinId = id.replace("pin/", "")
  const time = new Date().toISOString()
  const { data, error } = await supabase
    .from('pin')
    .upsert({ id: pinId, deleted_at: time })
    .match({ id: pinId })
    // .then(resp => {
    //   console.log("RESP", resp)
    // })
  console.log("[deleting] data", data)
  console.log("!!!####\n\n [deleting] in try error", error)

}

async function clearPins() {
}

async function getLastMutationID(t, clientID) {
  const clientRow = await t.oneOrNone(
    'SELECT last_mutation_id FROM replicache_client WHERE id = $1', clientID,
  );
  if (clientRow) {
    console.log("[push] Found client:", parseInt(clientRow.last_mutation_id))
    return parseInt(clientRow.last_mutation_id);
  }

  console.log('[push] No client, Creating new client', clientID);
  await t.none(
    'INSERT INTO replicache_client (id, last_mutation_id) VALUES ($1, 0)',
    clientID,
  );
  return 0;
}

async function sendPoke() {
  const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
    secret: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
    useTLS: true,
  });
  const t0 = Date.now();
  await pusher.trigger('default', 'poke', {});
  console.log('[push] Sent poke in', Date.now() - t0);
}