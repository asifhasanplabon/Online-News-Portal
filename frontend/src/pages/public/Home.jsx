import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNews } from "../../features/news/newsSlice";
import FeaturedNews from "../../components/news/FeaturedNews";
import NewsList from "../../components/news/NewsList";
import Spinner from "../../components/common/Spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { newsList, total, totalPages, page, loading } = useSelector((s) => s.news);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    setFeaturedLoading(true);
    dispatch(fetchAllNews({ isFeatured: true, limit: 4 }))
      .then((res) => {
        if (fetchAllNews.fulfilled.match(res)) setFeaturedNews(res.payload.news);
      })
      .finally(() => setFeaturedLoading(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllNews({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);

  return (
    <div className="space-y-8">
      {/* Featured section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Featured</h2>
          <div className="flex-1 h-px bg-red-600" />
        </div>
        <FeaturedNews news={featuredNews} loading={featuredLoading} />
      </section>

      {/* Latest news */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Latest News</h2>
          <div className="flex-1 h-px bg-red-600" />
        </div>

        <NewsList news={newsList} loading={loading} columns={3} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                    currentPage === pg
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
