import {db} from '../../db.js';

import { createClient } from '@supabase/supabase-js'
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

// args
// coords: {lat: 21.285943786816162, lng: -157.78801502971592}
// id: "b5ekgn522jo"
// order: 1
// text: "pandan"


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

  } catch (e) {
    console.error(" [push error] >>", e);
    res.status(500).send(e.toString());
  } finally {
    console.log(' [push] >> Processed push in', Date.now() - t0);
  }

}



async function createPin(db, {id, from, text, order}, version) {
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