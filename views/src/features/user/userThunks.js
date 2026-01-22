import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/user/${userId}`,
        { credentials: 'include' }
      );

      if (res.status === 401) {
        return rejectWithValue({ code: 401, message: 'Unauthorized' });
      }

      if (res.status === 404) {
        return rejectWithValue({ code: 404, message: 'User not found' });
      }

      if (!res.ok) {
        return rejectWithValue({ code: 500, message: 'Server error' });
      }

      const data = await res.json();
      return { userId, user: data.data };
    } catch (err) {
      return rejectWithValue({ code: 'NETWORK', message: err.message });
    }
  }
);
