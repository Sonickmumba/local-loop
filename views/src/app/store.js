import { configureStore } from '@reduxjs/toolkit';
import locationReducer from '../features/location/locationPermissionSlice';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
  },
});

export default store;