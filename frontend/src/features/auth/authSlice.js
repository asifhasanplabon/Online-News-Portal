import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// ── Async thunks ──
export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await API.post("/auth/logout");
    localStorage.removeItem("token");
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/auth/me");
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

// ── Slice ──
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialized: false, // app load এ getMe call হয়েছে কিনা
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // logout
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; })
      // getMe
      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.initialized = true; })
      .addCase(getMe.rejected, (state) => { state.loading = false; state.user = null; state.initialized = true; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;