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
  } ) {
    console.log("[createPin] args:", args)
    await tx.put(`pin/${args['id']}`, args);
  },

  async deletePin(tx: WriteTransaction, args: {
    id: string,
  }) {
    console.log('[deletePin] pin id:', args['id'])
    const del = await tx.del(`pin/${args['id']}`)
  },

  async updatePin(tx: WriteTransaction, args: {
    id: string,
    sender: string,
    text: string,
    description: string,
    ord: number,
    lat: number,
    lng: number,
    created_at: string,
    updated_at: string,
  }) {
    console.log("[updatePin] args:", args)
    await tx.put(`pin/${args['id']}`, args);
  },

  // async ...
}
