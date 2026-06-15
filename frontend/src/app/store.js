import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import newsReducer from "../features/news/newsSlice";
import categoryReducer from "../features/category/categorySlice";
import userReducer from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    category: categoryReducer,
    user: userReducer,
  },
});

export default store;
