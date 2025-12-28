import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Signup API
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData) => {
    const res = await axios.post('http://localhost:3000/api/auth/register', formData, { withCredentials: true });
    console.log('Signup response data:', res.data);
    return res.data;
  }
);

// Signin API
export const signinUser = createAsyncThunk(
  'auth/signinUser',
  async (credentials) => {
    const res = await axios.post('http://localhost:3000/api/auth/login', credentials, { withCredentials: true });
    console.log('Signin response data:', res.data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    formData: {
      name: '',
      email: '',
      password: '',
      phone: '',
      neighborhood: '',
      latitude: '',
      longitude: '',
      interests: [],
    },
  },
  reducers: {
    setFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData(state) {
      state.formData = {
        name: '',
        email: '',
        password: '',
        phone: '',
        neighborhood: '',
        latitude: '',
        longitude: '',
        interests: [],
      }; 
    },
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { setFormData, resetFormData, logout } = authSlice.actions;
export default authSlice.reducer;
