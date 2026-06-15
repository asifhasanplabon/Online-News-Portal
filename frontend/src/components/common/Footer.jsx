import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Newspaper } from "lucide-react";

const Footer = () => {
  const { categories } = useSelector((s) => s.category);
  const rootCategories = categories.filter((c) => !c.parent).slice(0, 6);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-5 w-5 text-red-500" />
            <span className="text-white font-bold text-lg">The Daily Chronicle</span>
          </div>
          <p className="text-sm leading-relaxed">
            Your trusted source for breaking news, analysis, and in-depth reporting from around the world.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Sections</h4>
          <ul className="space-y-1">
            {rootCategories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-sm hover:text-red-400 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-red-400">Home</Link></li>
            <li><Link to="/search" className="hover:text-red-400">Search</Link></li>
            <li><Link to="/login" className="hover:text-red-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-red-400">Register</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} The Daily Chronicle. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
