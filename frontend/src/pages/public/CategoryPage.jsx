import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../api/axios";
import NewsList from "../../components/news/NewsList";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { slug } = useParams();
  const { categories } = useSelector((s) => s.category);
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    API.get("/news", { params: { category: category._id, page: currentPage, limit: 9 } })
      .then((res) => {
        setNews(res.data.news);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, category, currentPage]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          {category?.name || slug}
        </h1>
        <div className="flex-1 h-px bg-red-600" />
        <span className="text-sm text-gray-500">{total} articles</span>
      </div>

      <NewsList news={news} loading={loading} columns={3} />

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
                className={`px-3 py-1 rounded border text-sm font-medium ${
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
    </div>
  );
};

export default CategoryPage;
