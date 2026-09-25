import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Custom Redux hooks with built-in TypeScript support.
 * Instead of plain `useDispatch` and `useSelector`, use these throughout your components:
 *
 * Example:
 * const dispatch = useAppDispatch();
 * const { user, isAuthenticated } = useAppSelector((state) => state.auth);
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
