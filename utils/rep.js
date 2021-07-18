import * as Pusher from 'pusher-js';

export function listen(rep) {
  const config = {
    key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
  }
  console.log('[rep] listening');
  Pusher.logToConsole = false;
  // Pusher.logToConsole = true;
  const pusher = new Pusher.default(config.key, { cluster: config.cluster });
  const channel = pusher.subscribe('default');
  channel.bind('poke', () => {
    rep.pull();
  });
}

