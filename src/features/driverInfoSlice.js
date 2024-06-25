import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    source: {
      sourceCoords : [],
      sourceName: ''
    },
    destination: {
      destinationCoords: [],
      destinationName: ''
    },
    travelInfo: null,
    count: 1,
    isRideAdded: false,
    distance: null,
    time: null,
    day: null,
    startTime: null
} 

const driverInfoSlice = createSlice({
    name: 'driverInfo',
    initialState,
    reducers:{
          addSource: (state, action) => {
            state.source = action.payload;
           
          },
      
          addDestination: (state, action) => {
            state.destination = action.payload;
          },
      
          addTravelInfo: (state, action) => {
            state.travelInfo = action.payload;
          },
      
          addCount: (state, action) => {
            state.count = action.payload; 
            },

          addIsRideAdded: (state, action) => {
              state.isRideAdded = action.payload;
            },

          addDistance: (state, action) => {
              state.distance = action.payload;
          },

          addTime: (state, action) => {
              state.time = action.payload;
          },
          addDay: (state, action) => {
            state.day = action.payload
          },
          addStartTime: (state, action) => {
            state.startTime = action.payload
          },
        },

})

export const {addCount, addStartTime,addDestination,addDay,addDistance, addTime,addSource, addTravelInfo, addIsRideAdded, d} = driverInfoSlice.actions
export default driverInfoSlice.reducer

