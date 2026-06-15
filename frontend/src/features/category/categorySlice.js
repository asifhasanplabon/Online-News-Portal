import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchCategories = createAsyncThunk("category/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/categories");
    return res.data.categories;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createCategory = createAsyncThunk("category/create", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/categories", data);
    return res.data.category;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCategory = createAsyncThunk("category/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/categories/${id}`, data);
    return res.data.category;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteCategory = createAsyncThunk("category/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/categories/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.categories[idx] = action.payload;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
