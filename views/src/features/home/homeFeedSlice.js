import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createListing } from '../listings/listingsSlice';

export const fetchHomeFeed = createAsyncThunk(
  'homeFeed/fetchHomeFeed',
  async (_, { rejectWithValue }) => {
    try {
      // const user = useSelector((s) => s.auth.user);
      const res = await axios.get('http://localhost:3000/api/listings/', {
        withCredentials: true,
      });

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirect to login will be handled by RequireAuth
        return rejectWithValue('Authentication required');
      }
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
  reducers: {
    addListingRealtime: (state, action) => {
      const exists = state.listings.some((l) => l.id === action.payload.id);
      if (!exists) {
        state.listings.unshift(action.payload);
      }
    },
  },
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
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.listings.unshift(action.payload);
      });
  },
});
export const { addListingRealtime } = homeFeedSlice.actions;
export default homeFeedSlice.reducer;
