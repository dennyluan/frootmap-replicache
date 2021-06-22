import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { ICoords, IPin } from "../models/types";
import { v4 as uuidv4 } from "uuid";

import find from 'lodash/find'

// replace the 'state: any' with actual pin state
interface PinState {
  pins: IPin[]
}

const newPin = (pinCoords : ICoords, text : string) => {
  const id = uuidv4()
  return {
    coords: {
      lat: pinCoords.lat,
      lng: pinCoords.lng,
    },
    id: id,
    text: text
  }
}

const initialState : IPin[] = []

interface CreatePinPayload {
  pinCoords: ICoords,
  text: string
}

const pinSlice = createSlice({
  name: 'pins',
  initialState: initialState,
  reducers: {
    loadPins(state: any, action) {
      const localPins : string = localStorage.getItem('localPins') || '[]'
      const localPinsParsed : IPin[] = JSON.parse(localPins)

      console.log("[loading localstorage pins]", localPinsParsed)

      if (localPinsParsed) {
        const newPins : IPin[] = []
        const collected : IPin[] = newPins.concat(localPinsParsed)
        return collected
      } else {
        return []
      }
    },

    fetchAllPins(state, action) {
      // tbd
      return action.payload.pins
    },

    // ts: PayloadAction<> should be the shape of the payload?
    //    { pinCoords: ?, text: ?, rep: Replicache<MD> }
    // ts: Replicache<> should have the type what?
    createPin(state: any, action: PayloadAction<CreatePinPayload>) {
      const { pinCoords, text } = action.payload
      const newState = state.concat([newPin(pinCoords, text)])
      localStorage.setItem('localPins', JSON.stringify(newState));
      return newState
    },

    clearPins(state) {
      console.log(">>>>>>> clearing pins", state)
      console.log(">>>>> selectPins", pinsSelector(state))
      // localStorage.removeItem("localPins")
      return []
    },

    deletePin(state: any, action: PayloadAction<any>) {
      // console.log(">>>>>!", action.payload)
      // console.log("state", find(state, function(p){p.id = pin.id}))
      // console.log("pinsSelector", pinsSelector(state))
      const newState = state.filter((pin : any) => pin.id !== action.payload )
      localStorage.setItem('localPins', JSON.stringify(newState))
      return newState

      // console.log("state", state)

      // return state

    }
  }
})

const pinsSelector = (state: any | PinState) => state.pins

export const selectPins : any = createSelector(
  pinsSelector,
  pins => pins
)

export const {
  loadPins,
  fetchAllPins,
  createPin,
  clearPins,
  deletePin
} = pinSlice.actions

export default pinSlice.reducer
