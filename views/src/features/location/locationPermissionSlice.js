import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permission: 'unknown', // 'unknown' | 'granted' | 'denied'
  coords: null,
  city: null,
  country: null,
};

const locationPermissionSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPermission(state, action) {
      state.permission = action.payload;
    },
    setCoords(state, action) {
      state.coords = action.payload;
    },
    setCityCountry(state, action) {
      const { city, country } = action.payload;
      state.city = city;
      state.country = country;
    },
    clearLocation(state) {
      state.permission = 'unknown';
      state.coords = null;
    },
  },
});

export const { setPermission, setCoords, setCityCountry, clearLocation } = locationPermissionSlice.actions;
export default locationPermissionSlice.reducer;