import { createSlice } from '@reduxjs/toolkit';
import { fetchUserById } from './userThunks';
import { USER_STATUS } from './userTypes';

const initialState = {
  entities: {},          // { [userId]: user }
  statusById: {},        // { [userId]: 'idle' | 'loading' | ... }
  errorById: {},         // { [userId]: { code, message } }
  lastFetchedAt: {},     // { [userId]: timestamp }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    invalidateUser(state, action) {
      const userId = action.payload;
      delete state.lastFetchedAt[userId];
    },
    clearUsers(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state, action) => {
        const userId = action.meta.arg;
        state.statusById[userId] = USER_STATUS.LOADING;
        state.errorById[userId] = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        state.entities[userId] = user;
        state.statusById[userId] = USER_STATUS.SUCCEEDED;
        state.lastFetchedAt[userId] = Date.now();
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.statusById[userId] = USER_STATUS.FAILED;
        state.errorById[userId] = action.payload;
      });
  },
});

export const { invalidateUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;
