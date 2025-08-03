import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const refresh = localStorage.getItem('refresh');
const user = localStorage.getItem('user');

// Async thunk to fetch user profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (username, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      const response = await fetch(`/api/profile/${username}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  token: token || null,
  refresh: refresh || null,
  user: user ? JSON.parse(user) : null,
  isAuthenticated: !!token,
  profile: null,
  profileLoading: false,
  profileError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('access', action.payload.token); // Save as 'access' for compatibility
      localStorage.setItem('refresh', action.payload.refresh);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      state.user = null;
      state.isAuthenticated = false;
      state.profile = null;
      state.profileLoading = false;
      state.profileError = null;
      localStorage.removeItem('token');
      localStorage.removeItem('access'); // Remove 'access' token as well
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || 'Failed to fetch profile';
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; 