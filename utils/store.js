import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import mapReducer from '../features/mapSlice'
import pinReducer from '../features/pinSlice'

const rootReducer = combineReducers({
  map: mapReducer,
  pins: pinReducer
})

export default configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
})
