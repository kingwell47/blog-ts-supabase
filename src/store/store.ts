import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "../slices/authSlice";
import blogsReducer from "../slices/blogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogsReducer,
  },
  // middleware and devTools are enabled by default
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks to use throughout your app instead of plain `useDispatch`/`useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
