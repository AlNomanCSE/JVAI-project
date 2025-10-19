import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access?: string; refresh?: string; accessToken?: string; idToken?: string }>
    ) => {
      // Handle both field name formats
      state.token = action.payload.accessToken || action.payload.access || null;
      state.refreshToken = action.payload.idToken || action.payload.refresh || null;
      state.isAuthenticated = !!state.token;
      
      // Save to localStorage
      if (typeof window !== 'undefined' && state.token && state.refreshToken) {
        localStorage.setItem('token', state.token);
        localStorage.setItem('refreshToken', state.refreshToken);
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
    hydrate: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) => {
      state.token = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
    },
  },
});

export const { setCredentials, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;