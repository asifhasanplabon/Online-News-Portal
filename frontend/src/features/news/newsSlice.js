import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchAllNews = createAsyncThunk("news/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await API.get("/news", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchNewsBySlug = createAsyncThunk("news/fetchBySlug", async (slug, { rejectWithValue }) => {
  try {
    const res = await API.get(`/news/slug/${slug}`);
    return res.data.news;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchNewsById = createAsyncThunk("news/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/news/${id}`);
    return res.data.news;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyNews = createAsyncThunk("news/fetchMyNews", async (params, { rejectWithValue }) => {
  try {
    const res = await API.get("/news/my", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchPendingNews = createAsyncThunk("news/fetchPending", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/news/pending");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createNews = createAsyncThunk("news/create", async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post("/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.news;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateNews = createAsyncThunk("news/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/news/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.news;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteNews = createAsyncThunk("news/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/news/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const submitForApproval = createAsyncThunk("news/submit", async (id, { rejectWithValue }) => {
  try {
    await API.patch(`/news/${id}/submit`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const approveNews = createAsyncThunk("news/approve", async (id, { rejectWithValue }) => {
  try {
    await API.patch(`/news/${id}/approve`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const rejectNews = createAsyncThunk("news/reject", async (id, { rejectWithValue }) => {
  try {
    await API.patch(`/news/${id}/reject`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleFeatured = createAsyncThunk("news/toggleFeatured", async (id, { rejectWithValue }) => {
  try {
    await API.patch(`/news/${id}/featured`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleBreaking = createAsyncThunk("news/toggleBreaking", async (id, { rejectWithValue }) => {
  try {
    await API.patch(`/news/${id}/breaking`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const incrementView = createAsyncThunk("news/incrementView", async (id) => {
  await API.patch(`/news/${id}/view`).catch(() => {});
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    newsList: [],
    myNewsList: [],
    pendingList: [],
    selectedNews: null,
    total: 0,
    totalPages: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedNews: (state) => { state.selectedNews = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList = action.payload.news;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchAllNews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchNewsBySlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => { state.loading = false; state.selectedNews = action.payload; })
      .addCase(fetchNewsBySlug.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchNewsById.fulfilled, (state, action) => { state.selectedNews = action.payload; })

      .addCase(fetchMyNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyNews.fulfilled, (state, action) => {
        state.loading = false;
        state.myNewsList = action.payload.news;
      })
      .addCase(fetchMyNews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchPendingNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPendingNews.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingList = action.payload.news;
      })
      .addCase(fetchPendingNews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createNews.fulfilled, (state, action) => { state.myNewsList.unshift(action.payload); })

      .addCase(updateNews.fulfilled, (state, action) => {
        const idx = state.myNewsList.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.myNewsList[idx] = action.payload;
      })

      .addCase(deleteNews.fulfilled, (state, action) => {
        state.myNewsList = state.myNewsList.filter((n) => n._id !== action.payload);
      })

      .addCase(submitForApproval.fulfilled, (state, action) => {
        const item = state.myNewsList.find((n) => n._id === action.payload);
        if (item) item.status = "pending";
      })

      .addCase(approveNews.fulfilled, (state, action) => {
        state.pendingList = state.pendingList.filter((n) => n._id !== action.payload);
      })

      .addCase(rejectNews.fulfilled, (state, action) => {
        state.pendingList = state.pendingList.filter((n) => n._id !== action.payload);
      });
  },
});

export const { clearSelectedNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
