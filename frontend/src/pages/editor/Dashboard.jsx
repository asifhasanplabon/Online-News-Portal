import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyNews } from "../../features/news/newsSlice";
import useAuth from "../../hook/useAuth";
import { FileText, Clock, CheckCircle, XCircle, PenSquare } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const EditorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { myNewsList } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(fetchMyNews({ limit: 100 }));
  }, [dispatch]);

  const counts = {
    total: myNewsList.length,
    draft: myNewsList.filter((n) => n.status === "draft").length,
    pending: myNewsList.filter((n) => n.status === "pending").length,
    published: myNewsList.filter((n) => n.status === "published").length,
    rejected: myNewsList.filter((n) => n.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <p className="text-sm text-gray-500 mt-1">Here's your writing overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Articles" value={counts.total} color="bg-blue-500" />
        <StatCard icon={Clock} label="Pending Review" value={counts.pending} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} label="Published" value={counts.published} color="bg-green-500" />
        <StatCard icon={XCircle} label="Rejected" value={counts.rejected} color="bg-red-500" />
      </div>

      <div className="flex gap-4">
        <Link
          to="/editor/create-news"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          <PenSquare className="h-4 w-4" /> Write New Article
        </Link>
        <Link
          to="/editor/my-news"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          <FileText className="h-4 w-4" /> View All Articles
        </Link>
      </div>
    </div>
  );
};

export default EditorDashboard;
