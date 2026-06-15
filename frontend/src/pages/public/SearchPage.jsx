import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/axios";
import NewsList from "../../components/news/NewsList";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
    if (!query.trim()) return;
    setLoading(true);
    API.get("/news", { params: { search: query, limit: 12 } })
      .then((res) => {
        setNews(res.data.news);
        setTotal(res.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) setSearchParams({ q: inputValue.trim() });
  };

  return (
    <div>
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for news..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {query && !loading && (
          <p className="mt-3 text-sm text-gray-600">
            {total} result{total !== 1 ? "s" : ""} for <strong>&quot;{query}&quot;</strong>
          </p>
        )}
      </div>

      {query ? (
        <NewsList news={news} loading={loading} columns={3} />
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg">Enter a keyword to search for news</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
