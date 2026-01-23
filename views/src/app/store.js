import { configureStore } from '@reduxjs/toolkit';
import locationReducer from '../features/location/locationPermissionSlice';
import authReducer from '../features/auth/authSlice';
import homeFeedReducer from '../features/home/homeFeedSlice';
import listingsReducer from '../features/listings/listingsSlice';
import notificationsReducer from '../features/notification/notificationsSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    homeFeed: homeFeedReducer,
    listings: listingsReducer,
    notifications: notificationsReducer,
    user: userReducer,
    
  },
});

export default store;
