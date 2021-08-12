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
    created_at: string,
    updated_at: string,
    version: number,
  } ) {
    // console.log("[createPin] args:", args)
    await tx.put(`pin/${args['id']}`, args);
  },

  async deletePin(tx: WriteTransaction, args: {
    id: string,
  }) {
    // console.log('[deletePin] pin id:', args['id'])
    await tx.del(`pin/${args['id']}`)
  },

  async updatePin(tx: WriteTransaction, args: {
    id: string,
    sender: string,
    text: string,
    description: string,
    ord: number,
    lat: number,
    lng: number,
    version: number,
    created_at: string,
    updated_at: string,
  }) {
    // console.log("[updatePin] args:", args)
    await tx.put(`pin/${args['id']}`, args);
  },

  async clearPins(tx: WriteTransaction) {
    await Promise.all(
      (await tx.scan({ prefix: `pin` }).keys().toArray()).map((k) =>
        tx.del(k)
      )
    );
  }

  // async ...
}
