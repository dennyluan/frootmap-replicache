// import React, {useEffect, useRef, useState} from 'react';
// import { Replicache, WriteTransaction, MutatorDefs } from 'replicache';

// import { listen } from './../utils/rep';
// import { mutators } from './../features/mutators'

// const repConfig = {
//   key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
//   cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
// }

// // todo: form props
const RepContainer = (props: any) => {

//   useEffect(()=> {
//     const isProd = location.host.indexOf("fruit.camera") > -1;
//     console.log('isProd', isProd)

//     const rep = new Replicache<MutatorDefs>({
//       pushURL: '/api/push',
//       pullURL: '/api/pull',
//       wasmModule: isProd ? "/replicache.wasm" : "/replicache.dev.wasm",
//       name: "fruit",
//       mutators
//     });

//     listen(rep, repConfig);

//     props.setRep(rep);
//   },[])

//   return null
}

export default RepContainer