import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { formatRelativeDate } from "../../utils/formatDate";

const NewsCard = ({ news }) => {
  if (!news) return null;

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/news/${news.slug}`}>
        <div className="aspect-video overflow-hidden bg-gray-100">
          {news.thumbnail?.url ? (
            <img
              src={news.thumbnail.url}
              alt={news.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {news.category && (
          <Link
            to={`/category/${news.category.slug}`}
            className="text-xs font-semibold text-red-600 uppercase tracking-wide hover:text-red-700"
          >
            {news.category.name}
          </Link>
        )}

        <Link to={`/news/${news.slug}`}>
          <h3 className="mt-1 text-base font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition-colors">
            {news.title}
          </h3>
        </Link>

        {news.summary && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{news.summary}</p>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
          {news.author?.name && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {news.author.name}
            </span>
          )}
          {news.publishedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(news.publishedAt)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
