import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  source: {
    sourceCoords : [],
    sourceName: ''
  },
  destination: {
    destinationCoords: [],
    destinationName: ''
  },
  travelInfo: 'Today',
  count: 1,
};

export const passengerInfo = createSlice({
  name: 'passInfo',
  initialState,
  reducers: {
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
  },
});

export const {addSource, addDestination, addTravelInfo, addCount} = passengerInfo.actions;
export default passengerInfo.reducer;

