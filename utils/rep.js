import * as Pusher from 'pusher-js';


export function listen(rep, config) {
  console.log('[rep] listening');
  // Listen for pokes, and pull whenever we get one.
  Pusher.logToConsole = false;
  // Pusher.logToConsole = true;
  const pusher = new Pusher.default(config.key, { cluster: config.cluster });
  const channel = pusher.subscribe('default');
  channel.bind('poke', () => {
    console.log('got poked');
    rep.pull();
  });
}

