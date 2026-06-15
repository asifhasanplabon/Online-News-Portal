import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyNews, deleteNews, submitForApproval } from "../../features/news/newsSlice";
import Spinner from "../../components/common/Spinner";
import { formatShortDate } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { Pencil, Trash2, Send, Plus } from "lucide-react";

const statusStyles = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MyNews = () => {
  const dispatch = useDispatch();
  const { myNewsList, loading } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(fetchMyNews({ limit: 50 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    const result = await dispatch(deleteNews(id));
    if (deleteNews.fulfilled.match(result)) toast.success("Article deleted");
    else toast.error(result.payload || "Delete failed");
  };

  const handleSubmit = async (id) => {
    const result = await dispatch(submitForApproval(id));
    if (submitForApproval.fulfilled.match(result)) toast.success("Submitted for approval!");
    else toast.error(result.payload || "Submit failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Articles ({myNewsList.length})</h2>
        <Link
          to="/editor/create-news"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      {!myNewsList.length ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <p className="mb-3">No articles yet.</p>
          <Link to="/editor/create-news" className="text-red-600 font-medium hover:underline">
            Write your first article →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myNewsList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-800 line-clamp-2">{item.title}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {item.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[item.status] || statusStyles.draft}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatShortDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(item.status === "draft" || item.status === "rejected") && (
                          <button
                            onClick={() => handleSubmit(item._id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Submit for approval"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <Link
                          to={`/editor/edit-news/${item._id}`}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNews;
