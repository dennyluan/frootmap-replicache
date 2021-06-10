import { createSlice } from "@reduxjs/toolkit";
import { ICoords, IPin } from "../models/pins";

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    map: {
      center: {
        lat: 21.284084348268202,
        lng: -157.7855795839304,
      },
      zoom: 16
    }
  },
  reducers: {
    setMap: {
      reducer(state, action) {
        const { lat, lng, zoom, map } = action.payload
        map.panTo({lat: lat, lng: lng})
      },
    }
  }
})

export const { setMap } = mapSlice.actions

export default mapSlice.reducer