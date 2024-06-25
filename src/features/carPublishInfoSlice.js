import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  type: null,
  brandName: null,
  modelName: null,
  registerNumber: null,
  isVehiclePublished: false,
};

export const carPublishInfoSlice = createSlice({
  name: 'vehicleDetails',
  initialState,
  reducers: {
    addVehicle: (state, action) => {
      console.log('action', action)
      state.type = action.payload.type;
      state.brandName = action.payload.brandName;
      state.modelName = action.payload.modelName;
      state.registerNumber = action.payload.registerNumber;
      state.isVehiclePublished = true;
    },
    removeVehicle: (state, action) => {
      state.type = null;
      state.brandName = null;
      state.modelName = null;
      state.registerNumber = null;
      state.isVehiclePublished = false;
    },
    editVehicle: (state, action) => {
      // Assuming action.payload contains updated values
      if (action.payload.type) state.type = action.payload.type;
      if (action.payload.brandName) state.brandName = action.payload.brandName;
      if (action.payload.modelName) state.modelName = action.payload.modelName;
      if (action.payload.registerNumber)
        state.registerNumber = action.payload.registerNumber;
    },
  },
});

export const {addVehicle, removeVehicle, editVehicle} = carPublishInfoSlice.actions
export default carPublishInfoSlice.reducer;

