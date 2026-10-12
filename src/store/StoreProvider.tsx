"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { restoreSession } from "./slices/authSlice";
import { rehydrateTheme } from "./slices/themeSlice";

/**
 * Helper component that runs once when the app opens.
 * It checks if a user session or theme preference was previously stored in localStorage
 * and safely loads it back into Redux state on the client without SSR hydration errors.
 */
function AuthSessionLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Restore Auth session if present
    try {
      const savedUser = localStorage.getItem("campus_user");
      if (savedUser) {
        dispatch(restoreSession(JSON.parse(savedUser)));
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    }

    // 2. Restore Theme preference cleanly on client mount
    dispatch(rehydrateTheme());
  }, [dispatch]);

  return <>{children}</>;
}

/**
 * Top-level StoreProvider wrapper.
 * Wrap your application inside this provider so all pages and components
 * can access Redux state and actions.
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthSessionLoader>{children}</AuthSessionLoader>
    </Provider>
  );
}
