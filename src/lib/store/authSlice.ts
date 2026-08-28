import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, AuthState } from "@/types/auth/auth.types";

const getInitialAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || null;
  }
  return null;
};

const initialState: AuthState = {
  accessToken: getInitialAccessToken(),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload);
      }
    },
    setAuthUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },
  },
});

export const { setAccessToken, setAuthUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
