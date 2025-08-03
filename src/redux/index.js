import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Example: import your reducers here
// import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // user: userReducer,
  },
}); 