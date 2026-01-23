import { USER_STATUS } from './userTypes';

export const selectUserById = (state, userId) =>
  state.user.entities[userId];

export const selectUserStatus = (state, userId) =>
  state.user.statusById[userId] ?? USER_STATUS.IDLE;

export const selectUserError = (state, userId) =>
  state.user.errorById[userId];

export const selectUserIsLoading = (state, userId) =>
  selectUserStatus(state, userId) === USER_STATUS.LOADING;
