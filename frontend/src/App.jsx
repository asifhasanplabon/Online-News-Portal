import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMe } from "./features/auth/authSlice";
import useAuth from "./hook/useAuth";

// layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import EditorLayout from "./layouts/EditorLayout";

// common
import ProtectedRoute from "./components/common/ProtectedRoute";
import Spinner from "./components/common/Spinner";

// public pages
import Home from "./pages/public/Home";
import NewsDetails from "./pages/public/NewsDetails";
import CategoryPage from "./pages/public/CategoryPage";
import SearchPage from "./pages/public/SearchPage";

// auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCategories from "./pages/admin/ManageCategories";
import PendingNews from "./pages/admin/PendingNews";

// editor pages
import EditorDashboard from "./pages/editor/Dashboard";
import MyNews from "./pages/editor/MyNews";
import CreateNews from "./pages/editor/CreateNews";
import EditNews from "./pages/editor/EditNews";

const App = () => {
  const dispatch = useDispatch();
  const { initialized, loading } = useAuth();

  // app load হলে token থেকে user data আনো
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getMe());
  }, [dispatch]);

  // getMe call শেষ না হওয়া পর্যন্ত spinner দেখাও
  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news/:slug" element={<NewsDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        {/* ── Auth Routes (already logged in হলে redirect) ── */}
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />

        {/* ── Admin Routes ── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/pending-news" element={<PendingNews />} />
        </Route>

        {/* ── Editor Routes ── */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["editor"]}>
              <EditorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/editor" element={<Navigate to="/editor/dashboard" replace />} />
          <Route path="/editor/dashboard" element={<EditorDashboard />} />
          <Route path="/editor/my-news" element={<MyNews />} />
          <Route path="/editor/create-news" element={<CreateNews />} />
          <Route path="/editor/edit-news/:id" element={<EditNews />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

// ── Already logged in হলে dashboard এ পাঠাও ──
const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth();

  if (!user) return children;

  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "editor") return <Navigate to="/editor/dashboard" replace />;
  return <Navigate to="/" replace />;
};

// ── Simple 404 page ──
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-500">Page not found.</p>
    <a href="/" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
      Go Home
    </a>
  </div>
);

export default App;