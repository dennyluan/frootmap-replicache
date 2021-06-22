import {db} from '../../db.js';

export default async (req, res) => {
  const push = req.body;
  console.log("i am pushing! 1")

  console.log(' [push] >>> Processing push', JSON.stringify(push, null, ''));

  const t0 = Date.now();
  try {
    await db.tx(async t => {
      const {nextval: version} = await db.one("SELECT nextval('version')");

      // 1 set a lastMutationID
      let lastMutationID = parseInt(
        (
          await db.oneOrNone(
            'SELECT last_mutation_id FROM replicache_client WHERE id = $1',
            push.clientID,
          )
        )?.last_mutation_id ?? '0',
      );

      // 1a if there is no lastMutationID, then create a new replicache_client
      if (!lastMutationID) {
        await db.none(
          'INSERT INTO replicache_client (id, last_mutation_id) VALUES ($1, $2)',
          [push.clientID, lastMutationID],
        );
      }

      console.log('[push] version', version, 'lastMutationID:', lastMutationID);

      for (let i = 0; i < push.mutations.length; i++) {
        const t1 = Date.now();

        const localMutation = push.mutations[i];
        const expectedMutationID = lastMutationID + 1;

        if (localMutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`,
          );
          continue;
        }
        if (localMutation.id > expectedMutationID) {
          console.warn(`Mutation ${localMutation.id} is from the future - aborting`);
          break;
        }

        console.log('[push] Processing mutation:', JSON.stringify(localMutation, null, ''));

        switch (localMutation.name) {
          case 'createMessage':
            await createMessage(db, localMutation.args, version);
            break;
          default:
            throw new Error(`Unknown mutation: ${localMutation.name}`);
        }

        lastMutationID = expectedMutationID;
        console.log('Processed mutation in', Date.now() - t1);
      }

      // await sendPoke();

      console.log(
        'setting',
        push.clientID,
        'last_mutation_id to',
        lastMutationID,
      );
      await db.none(
        'UPDATE replicache_client SET last_mutation_id = $2 WHERE id = $1',
        [push.clientID, lastMutationID],
      );
      res.send('{}');
    });
  } catch (e) {
    console.error(" [push error] >>", e);
    res.status(500).send(e.toString());
  } finally {
    console.log(' [push] >> Processed push in', Date.now() - t0);
  }
};

async function createMessage(db, {id, from, text, order}, version) {
  await db.none(
    `INSERT INTO message (
    id, sender, text, ord, version) values
    ($1, $2, $3, $4, $5)`,
    [id, from, text, order, version],
  );
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
  console.log('Sent poke in', Date.now() - t0);
}