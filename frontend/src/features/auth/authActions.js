import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// const backendURL = 'https://redux-user-auth.up.railway.app'
const backendURL = "http://127.0.0.1:4000";

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/api/v1/login`,
        { email, password },
        config
      );

      // store user's token in local storage

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password, file }, { rejectWithValue }) => {
    // const file = files[0];
    console.log(file);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendURL}/api/v1/register`,
        { name, email, password, file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        config
      );

      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (thunkAPI) => {
  try {
    await axios.get(`${backendURL}/api/v1/logout`);
  } catch (error) {
    thunkAPI.dispatch({ payload: error.message });
  }
});

// export const profile = createAsyncThunk(
//   "user/profile",
//   async (rejectWithValue, thunkAPI) => {
//     try {
//       const { data } = await axios.get(`${backendURL}/api/v1/me`);
//       thunkAPI.dispatch({ payload: data.user });
//     } catch (error) {
//       if (error.response && error.response.data.message) {
//         return rejectWithValue(error.response.data.message);
//       } else {
//         return rejectWithValue(error.message);
//       }
//     }
//   }
// );
