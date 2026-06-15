import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewsBySlug, clearSelectedNews, incrementView } from "../../features/news/newsSlice";
import { formatFullDate } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";
import { Clock, User, Tag, Eye } from "lucide-react";

const NewsDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedNews: news, loading, error } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(clearSelectedNews());
    dispatch(fetchNewsBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (news?._id) {
      dispatch(incrementView(news._id));
    }
  }, [dispatch, news?._id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">News article not found.</p>
        <Link to="/" className="mt-4 inline-block text-red-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Category */}
      {news.category && (
        <Link
          to={`/category/${news.category.slug}`}
          className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase mb-3 hover:bg-red-700"
        >
          {news.category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-3">
        {news.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-200">
        {news.author?.name && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {news.author.name}
          </span>
        )}
        {news.publishedAt && (
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatFullDate(news.publishedAt)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {news.viewCount?.toLocaleString()} views
        </span>
      </div>

      {/* Thumbnail */}
      {news.thumbnail?.url && (
        <figure className="mb-6">
          <img
            src={news.thumbnail.url}
            alt={news.title}
            className="w-full rounded-xl object-cover max-h-96"
          />
        </figure>
      )}

      {/* Summary */}
      {news.summary && (
        <p className="text-lg text-gray-600 italic border-l-4 border-red-500 pl-4 mb-6">
          {news.summary}
        </p>
      )}

      {/* Content */}
      <div
        className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {/* Tags */}
      {news.tags?.length > 0 && (
        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" />
          {news.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
