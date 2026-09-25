import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

/**
 * Configure the central Redux Store
 * Add your slices to the reducer object below.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // (You can easily add product: productReducer, ui: uiReducer here later!)
  },
});

// Infer types for RootState and AppDispatch for TypeScript autocomplete
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
