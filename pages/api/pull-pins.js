import {db} from '../../db.js';


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
    console.log("[pull]!", pull)
    db.tx(async t => {


      // get the lastmutationID
      const lastMutationID = parseInt(
        (
          await db.oneOrNone(
            'select last_mutation_id from replicache_client where id = $1',
            pull.clientID,
          )
        )?.last_mutation_id ?? '0',
      );

      // get any new txs
      const changed = await db.manyOrNone(
        'select id, sender, text, ord from pin where version > $1',
        parseInt(pull.cookie ?? 0),
      );
      const cookie = (
        await db.one('select max(version) as version from pin')
      ).version;
      console.log({cookie, lastMutationID, changed});

      // if no cookie, then clear
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
            order: parseInt(row.ord),
          },
        })));

      res.json({
        lastMutationID,
        cookie,
        patch,
      });
      res.end();
    });

  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log(' [pull] >>>> Processed pull in', Date.now() - t0);
  }
};