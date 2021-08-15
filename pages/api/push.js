import {db} from '../../db.js';
import Pusher from 'pusher';
import { supabase } from '../../utils/supabase';

// |pins|
// id                 varchar
// text               text
// description        text
// version            int8
// sender             varchar
// lat                float8
// lng                float8

// This strategy has to act as a kind of lock, using nextval(version)

export default async (req, res) => {

  const push = req.body;
  console.log(' [push] >>> Processing push', JSON.stringify(push, null, ''));

  const t0 = Date.now();
  try {
    await db.tx(async t => {
      // gets next global atomic time stamp from database
      const {nextval: version} = await db.one("SELECT nextval('version')");

      // return the clients latest mutation integer
      let lastMutationID = await getLastMutationID(t, push.clientID);

      console.log('[push] global version:', version, ', lastMutationID:', lastMutationID)

      for (const mutation of push.mutations) {
        const t1 = Date.now();

        console.log("::mutation", mutation)


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
            await createPin(t, mutation.args, version)
            break
          case 'deletePin':
            await deletePin(t, mutation.args)
            break
          case 'updatePin':
            await updatePin(t, mutation.args, version, mutation.id)
            break
          case 'clearPins':
            await clearPins(t)
            break
          default:
            throw new Error(`Unknown mutation: ${mutation.name}`)
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

async function createPin(db, {id, sender, text, description, lat, lng, created_at, updated_at}, version) {
  try {
    console.log("[push] createpin payload:", { id, sender, text, description, lat, lng, version, created_at, updated_at })
    const { data, error } = await supabase
      .from('pin')
      .insert({ id, sender, text, description, lat, lng, version, created_at, updated_at })
  } catch (error) {
    console.log("!!!#### push error", error)
  }
}

async function deletePin(db, {id}) {
  let pinId = id.replace("pin/", "")
  const time = new Date().toISOString()
  const { data, error } = await supabase
    .from('pin')
    .upsert({ id: pinId, deleted_at: time })
    .match({ id: pinId })
}

async function updatePin(db, args, version, id) {
  console.log(">>>>> updating pin", args, "version: ", version, "id: ", id)

  let pinId = args.id.replace("pin/", "")

  let newArgs = {
    ...args,
    version: id + 1,
  }

  try {
    const { data, error } = await supabase
      .from('pin')
      .upsert(newArgs)
      .match({ id: pinId })
    console.log("[updating pin data]", data)
  } catch (error) {
    console.log("[updating pin error]", error)
  }
}

async function clearPins(db) {
  const time = new Date().toISOString()
  const {data, error } = await supabase
    .from('pin')
    .update({ deleted_at: time })
    .is("deleted_at", null)
}

async function getLastMutationID(t, clientID) {
  const clientRow = await t.oneOrNone(
    'SELECT last_mutation_id FROM replicache_client WHERE id = $1', clientID,
  );

  if (clientRow) {
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