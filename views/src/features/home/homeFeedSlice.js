import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHomeFeed = createAsyncThunk(
  'homeFeed/fetchHomeFeed',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/listings/',
        { withCredentials: true }
      );
      return res.data.data; // array of listings
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load feed'
      );
    }
  }
);
const homeFeedSlice = createSlice({
  name: 'homeFeed',
  initialState: {
    listings: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeFeed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHomeFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = action.payload;
      })
      .addCase(fetchHomeFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default homeFeedSlice.reducer;