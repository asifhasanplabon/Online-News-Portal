import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingNews, approveNews, rejectNews, toggleFeatured, toggleBreaking } from "../../features/news/newsSlice";
import Spinner from "../../components/common/Spinner";
import { formatFullDate } from "../../utils/formatDate";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Star, Zap } from "lucide-react";

const PendingNews = () => {
  const dispatch = useDispatch();
  const { pendingList, loading } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(fetchPendingNews());
  }, [dispatch]);

  const handle = async (action, id, label) => {
    const result = await dispatch(action(id));
    if (action.fulfilled.match(result)) toast.success(label);
    else toast.error("Action failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Pending News ({pendingList.length})</h2>

      {!pendingList.length ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          No pending news to review.
        </div>
      ) : (
        <div className="space-y-4">
          {pendingList.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start gap-4">
                {item.thumbnail?.url && (
                  <img
                    src={item.thumbnail.url}
                    alt={item.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {item.category && (
                    <span className="text-xs text-red-600 font-semibold uppercase">{item.category.name}</span>
                  )}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mt-0.5">{item.title}</h3>
                  {item.summary && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{item.summary}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    By {item.author?.name} · {formatFullDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handle(approveNews, item._id, "News approved!")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={() => handle(rejectNews, item._id, "News rejected.")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
                <button
                  onClick={() => handle(toggleFeatured, item._id, "Featured toggled.")}
                  className="flex items-center gap-1 px-3 py-1.5 border border-yellow-400 text-yellow-600 text-xs rounded-lg hover:bg-yellow-50"
                >
                  <Star className="h-3.5 w-3.5" /> {item.isFeatured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => handle(toggleBreaking, item._id, "Breaking toggled.")}
                  className="flex items-center gap-1 px-3 py-1.5 border border-orange-400 text-orange-600 text-xs rounded-lg hover:bg-orange-50"
                >
                  <Zap className="h-3.5 w-3.5" /> {item.isBreaking ? "Unbreak" : "Breaking"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingNews;
