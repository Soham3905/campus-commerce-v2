import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * 1. Define the User Profile structure
 * This matches the data returned by the backend after successful login.
 */
export interface UserProfile {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  token?: string;
  ssoToken?: string;
  profilePicture?: string;
  university?: string;
  department?: string;
  showTooltip?: boolean;
}

/**
 * 2. Define the shape of our Auth State in Redux
 */
export interface AuthState {
  user: UserProfile | null;     // Stores the logged-in user details (null when logged out)
  isAuthenticated: boolean;     // true when logged in, false when logged out
  authLoading: boolean;         // true when checking credentials or making login requests
  authError: string | null;     // stores any error message (e.g., "Invalid OTP")
}

/**
 * 3. Initial State (Default values when the app first opens)
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
};

/**
 * 4. Create the Auth Slice
 * Slices contain the state and the simple functions (reducers) to update that state.
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action called when user enters valid OTP and logs in successfully
    setLoginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authLoading = false;
      state.authError = null;

      // Save to localStorage so user stays logged in if they refresh the page
      if (typeof window !== "undefined") {
        localStorage.setItem("campus_user", JSON.stringify(action.payload));
      }
    },

    // Action called on app load to restore user from localStorage if already logged in
    restoreSession: (state, action: PayloadAction<UserProfile | null>) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
      state.authLoading = false;
    },

    // Action called when user clicks Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authLoading = false;
      state.authError = null;

      // Remove saved session from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("campus_user");
      }
    },

    // Action to set loading status (e.g. while verifying OTP)
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },

    // Action to set an error message
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.authError = action.payload;
      state.authLoading = false;
    },

    // Action to toggle or update the guided tooltip setting
    setShowTooltip: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.showTooltip = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("campus_user", JSON.stringify(state.user));
        }
      }
    },
  },
});

// Export actions so components can dispatch them
export const {
  setLoginSuccess,
  restoreSession,
  logout,
  setAuthLoading,
  setAuthError,
  setShowTooltip,
} = authSlice.actions;

// Export the reducer to plug into the store
export default authSlice.reducer;
