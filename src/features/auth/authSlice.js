
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userId: null,
    username: null,
    email: null,
    role: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.username = null;
      state.email = null;
      state.role = null;

      localStorage.removeItem('token');
    },
  },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
