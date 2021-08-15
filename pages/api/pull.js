import {db} from '../../db.js';
import {supabase} from '../../utils/supabase.js';


// op:put, op:del, op:clear

export default async (req, res) => {
  console.log("\n\n\n")
  const pull = req.body;
  // console.log(`[pull] Processing pull`, JSON.stringify(pull, null, ''));
  const t0 = Date.now();

  try {
    db.tx(async t => {
      const lastMutationID = parseInt(
        (
          await db.oneOrNone(
            'select last_mutation_id from replicache_client where id = $1',
            pull.clientID,
          )
        )?.last_mutation_id ?? '0',
      );


      // get all the later or newer changes after version
      const changed = await db.manyOrNone(
        `
          select id, sender, text, description, lat, lng, created_at, updated_at, version
            from pin
            where version > $1
        `,
        parseInt(pull.cookie ?? 0),
      );

      // now get the latest transaction from the db
      const cookie = (
        await db.one('select max(version) as version from pin')
      ).version;


      // console.log("\n[pull]", {cookie, lastMutationID, changed});

      const patch = [];

      if (pull.cookie === null) {
        patch.push({
          op: 'clear',
        });
      }

      // push all pending changes as patches
      // todo: deserialize data here
      patch.push(...changed.map(row => ({
        op: 'put',
        key: `pin/${row.id}`,
        value: {
          from: row.sender,
          text: row.text,
          lat: row.lat,
          lng: row.lng,
          version: row.version,
          created_at: row.created_at,
          updated_at: row.updated_at,
          description: row.description,
          id: row.id,
        },
          // order: parseInt(row.ord),
      })));


      // delete
      const deleted = await supabase
        .from('pin')
        .select('*')
        .not("deleted_at", "is", null)
        .then(resp => {
          return resp.body
        })

      deleted.forEach((pin) => {
        patch.push({
          op: 'del',
          key: `pin/${pin.id}`,
        })
      })

      console.log("[pull] cookie", cookie)

      res.json({
        lastMutationID,
        cookie,
        patch,
      })

      res.end()

      console.log("[pull] END RES", res.statusCode)
    })
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('[pull] >>>> Processed pull in', Date.now() - t0);
  }
}