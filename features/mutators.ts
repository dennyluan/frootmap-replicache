import { Replicache, ReadTransaction, WriteTransaction } from "replicache";
import { ICoords, IPin, IPoint, JSONValue } from "../models/types";

export const mutators = {
  async createPin(tx: WriteTransaction, args: {id: string} ) {
    console.log("hello there!", args)

    await tx.put(`pin/${args['id']}`, {
      args
    });

  },

  // async ...
}