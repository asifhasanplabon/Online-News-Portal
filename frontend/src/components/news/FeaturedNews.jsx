import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { formatRelativeDate } from "../../utils/formatDate";
import Spinner from "../common/Spinner";

const FeaturedNews = ({ news = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!news.length) return null;

  const [main, ...rest] = news;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main featured */}
      <Link
        to={`/news/${main.slug}`}
        className="lg:col-span-2 relative group overflow-hidden rounded-xl bg-gray-900"
      >
        <div className="aspect-video">
          {main.thumbnail?.url ? (
            <img
              src={main.thumbnail.url}
              alt={main.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {main.category && (
            <span className="inline-block bg-red-600 text-xs font-bold px-2 py-0.5 rounded uppercase mb-2">
              {main.category.name}
            </span>
          )}
          <h2 className="text-xl lg:text-2xl font-bold leading-snug line-clamp-3">{main.title}</h2>
          {main.summary && (
            <p className="mt-1 text-sm text-gray-300 line-clamp-2 hidden sm:block">{main.summary}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            {main.author?.name && (
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{main.author.name}</span>
            )}
            {main.publishedAt && (
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeDate(main.publishedAt)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Secondary featured */}
      <div className="flex flex-col gap-3">
        {rest.slice(0, 3).map((item) => (
          <Link
            key={item._id}
            to={`/news/${item.slug}`}
            className="relative group overflow-hidden rounded-lg bg-gray-900 flex-1"
          >
            <div className="h-28">
              {item.thumbnail?.url ? (
                <img
                  src={item.thumbnail.url}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
                />
              ) : (
                <div className="w-full h-full bg-gray-700" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              {item.category && (
                <span className="text-xs text-red-400 font-semibold uppercase">{item.category.name}</span>
              )}
              <h3 className="text-sm font-bold line-clamp-2">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedNews;
