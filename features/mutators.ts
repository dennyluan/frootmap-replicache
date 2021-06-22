import { Replicache, ReadTransaction, WriteTransaction } from "replicache";
import { ICoords, IPin, IPoint, JSONValue } from "../models/types";

export const mutators = {
  async createPin(tx: WriteTransaction, args: {id: string} ) {
    await tx.put(`pin/${args['id']}`, {
      args
    });
    console.log("hello there!")
  },
}