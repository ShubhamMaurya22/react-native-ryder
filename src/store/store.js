import {configureStore} from '@reduxjs/toolkit'
import passengerInfoSlice from '../features/passengerInfoSlice'
import carPublishInfoSlice from '../features/carPublishInfoSlice'
import driverInfoSlice from '../features/driverInfoSlice'

export const store = configureStore({
   reducer: {
    passInfo : passengerInfoSlice,
    vehicleDetails : carPublishInfoSlice,
    driverInfo: driverInfoSlice
   }
})