import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";
import useAuth from "../../hook/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useSelector((s) => s.category);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const rootCategories = categories.filter((c) => !c.parent);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin" ? "/admin/dashboard" : "/editor/dashboard";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Category links (desktop) */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            <Link
              to="/"
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-600 whitespace-nowrap"
            >
              Home
            </Link>
            {rootCategories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-red-600 whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-1 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Search + Auth */}
          <div className="flex items-center gap-2 ml-auto">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="text-sm border border-gray-300 rounded-l px-3 py-1 outline-none focus:border-red-400 w-40 lg:w-52"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-3 py-1 rounded-r hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={dashboardLink}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-red-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <Link to="/" className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            {rootCategories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="flex items-center px-3 py-2 gap-2 sm:hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 outline-none"
              />
              <button type="submit" className="bg-red-600 text-white px-2 py-1 rounded">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
