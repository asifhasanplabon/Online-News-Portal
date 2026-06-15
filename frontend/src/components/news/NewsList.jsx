import NewsCard from "./NewsCard";
import Spinner from "../common/Spinner";

const NewsList = ({ news = [], loading = false, columns = 3 }) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No news articles found.
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-5`}>
      {news.map((item) => (
        <NewsCard key={item._id} news={item} />
      ))}
    </div>
  );
};

export default NewsList;
