import React, {useEffect, useRef, useState} from 'react';
import { Replicache, WriteTransaction, MutatorDefs } from 'replicache';

import { listen } from './../utils/rep';

import { mutators } from './../features/mutators'

const repConfig = {
  key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER
}

// todo: form props
const RepContainer = (props: any) => {

  let isProd

  useEffect(()=> {
    isProd = location.host.indexOf(".vercel.app") > -1;

    const rep = new Replicache<MutatorDefs>({
      pushURL: '/api/supa-push',
      pullURL: '/api/supa-pull',
      wasmModule: isProd ? "/replicache.wasm" : "/replicache.dev.wasm",
      name: "fruit",
      mutators
    });
    listen(rep, repConfig);
    props.setRep(rep);
  },[])


  // console.log("rep c props", props)
  // console.log("setting rep", rep)

  return null
}

export default RepContainer