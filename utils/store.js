import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import mapReducer from '../features/mapSlice'

const rootReducer = combineReducers({
  map: mapReducer,
})

export default configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
})
