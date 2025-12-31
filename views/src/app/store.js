import { configureStore } from '@reduxjs/toolkit';
import locationReducer from '../features/location/locationPermissionSlice';
import authReducer from '../features/auth/authSlice';
import homeFeedReducer from '../features/home/homeFeedSlice';
import listingsReducer from '../features/listings/listingsSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    homeFeed: homeFeedReducer,
    listings: listingsReducer,
  },
});

export default store;