import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchAllUsers = createAsyncThunk("user/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await API.get("/users", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateUserRole = createAsyncThunk("user/updateRole", async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/users/${id}/role`, { role });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleUserStatus = createAsyncThunk("user/toggleStatus", async (id, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/users/${id}/status`);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteUser = createAsyncThunk("user/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
