import { Replicache, ReadTransaction, WriteTransaction } from "replicache";
import { ICoords, IPin, IPoint, JSONValue } from "../models/types";

export const mutators = {
  async createPin(tx: WriteTransaction, args: {
    id: string,
    sender: string,
    text: string,
    description: string,
    ord: number,
    lat: number,
    lng: number,
  } ) {
    console.log("hello there!", args)
    console.log("sender!", args['sender'])
    await tx.put(`pin/${args['id']}`, {
      args
      // args,
      // text,
      // description,
      // ord,
      // lat,
      // lng
    });

  },

  // async ...
}


// async createMessage(tx, {id, from, content, order}) {
//  await tx.put(`message/${id}`, {
//    from,
//    content,
//    order,
//  });
// },