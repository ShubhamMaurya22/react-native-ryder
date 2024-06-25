import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    source: null,
    destination: null,
    day: null,
    count: 1,
}

const rideSeachSlice = createSlice({
    name:'',
    initialState,
    reducers:{
        addRideSearch: (state, action) => {
            state.source = action.payload.source;
            state.destination = action.payload.destination
            state.day = action.payload.day
            state.count = action.payload.count
        }
    }

})