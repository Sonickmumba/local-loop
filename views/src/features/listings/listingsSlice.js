import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/listings',
        listingData,
        { withCredentials: true } // cookie-based auth
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create listing'
      );
    }
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState: {
    listings: [],
    creating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createListing.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.creating = false;
        state.listings.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });
  },
});

export default listingsSlice.reducer;