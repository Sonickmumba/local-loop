import { configureStore } from '@reduxjs/toolkit';
import locationReducer from '../features/location/locationPermissionSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
  },
});

export default store;