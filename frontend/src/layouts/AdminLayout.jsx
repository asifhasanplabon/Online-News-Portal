import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../features/category/categorySlice";
import { logoutUser } from "../features/auth/authSlice";
import useAuth from "../hook/useAuth";
import {
  LayoutDashboard, Users, Tag, Clock, LogOut, Newspaper,
} from "lucide-react";
import toast from "react-hot-toast";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pending-news", label: "Pending News", icon: Clock },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/users", label: "Users", icon: Users },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-700">
          <Newspaper className="h-5 w-5 text-red-400" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 px-3 mb-2 truncate">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <h1 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            The Daily Chronicle — Admin
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
