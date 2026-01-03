import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Signup API
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData) => {
    const res = await axios.post(
      'http://localhost:3000/api/auth/register',
      formData,
      { withCredentials: true }
    );
    console.log('Signup response data:', res.data);
    return res.data.user;
  }
);

// Signin API
export const signinUser = createAsyncThunk(
  'auth/signinUser',
  async (credentials) => {
    const res = await axios.post(
      'http://localhost:3000/api/auth/login',
      credentials,
      { withCredentials: true }
    );
    return res.data.data;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await axios.post(
    'http://localhost:3000/api/auth/logout',
    {},
    {
      withCredentials: true,
    }
  );
});

export const bootstrapSession = createAsyncThunk(
  'auth/bootstrapSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:3000/api/auth/me', {
        withCredentials: true,
      });
      return res.data.data; // user object
    } catch (error) {
      console.error('Error bootstrapping session:', error);
      return rejectWithValue(null);
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone, { getState, rejectWithValue }) => {
    const { authFlow } = getState().auth;
    if (authFlow !== 'signup') {
      return rejectWithValue('OTP allowed only during signup');
    }
    const res = await fetch('http://localhost:3000/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      return rejectWithValue('Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phone, code }, { getState, rejectWithValue }) => {
    const { authFlow } = getState().auth;

    if (authFlow !== 'signup') {
      return rejectWithValue('OTP verification not allowed');
    }

    const res = await fetch('http://localhost:3000/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    if (!res.ok) {
      return rejectWithValue('Invalid code');
    }
  }
);

// export const verifyOtp = createAsyncThunk(
//   'auth/verifyOtp',
//   async ({ phone, otp }) => {
//     const { data } = await axios.post('/otp/verify', { phone, otp });
//     return data;
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    authFlow: null, // 'signup' | 'signin'
    otpSending: false,
    otpVerifying: false,
    otpVerified: false,
    initialized: false,
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
    startSignup(state) {
      state.authFlow = 'signup';
      state.otpVerified = false;
    },
    startSignin(state) {
      state.authFlow = 'signin';
      state.otpVerified = false;
    },
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
        state.user = action.payload;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.authFlow = null;
        state.otpVerified = false;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.initialized = true;
      })
      .addCase(sendOtp.pending, (state) => {
        state.otpSending = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.otpSending = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpSending = false;
        state.error = action.error.message;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpVerified = true;
      });
  },
});

export const { startSignup, startSignin, setFormData, resetFormData, logout } =
  authSlice.actions;
export default authSlice.reducer;
