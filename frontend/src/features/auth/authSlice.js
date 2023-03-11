import { createSlice } from "@reduxjs/toolkit";
import { registerUser, userLogin, logout, profile } from "./authActions";

const userInfo = localStorage.getItem("userInfo")
  ? localStorage.getItem("userInfo")
  : null;

const initialState = {
  loading: false,
  userInfo,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
      localStorage.setItem("userInfo", JSON.stringify(payload));
    },
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      localStorage.setItem("userInfo", JSON.stringify(payload));
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // register user
    [registerUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      localStorage.setItem("userInfo", payload);
      // registration successful
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    [logout.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [logout.fulfilled]: (state) => {
      localStorage.removeItem("userInfo"); // delete token from storage
      state.loading = false;
      state.userInfo = null;

      state.error = null;
    },
    [logout.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
