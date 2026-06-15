import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNews } from "../../features/news/newsSlice";
import RichTextEditor from "../../components/editor/RichTextEditor";
import toast from "react-hot-toast";
import { X, Upload } from "lucide-react";

const CreateNews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((s) => s.category);
  const { loading } = useSelector((s) => s.news);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "",
    tags: "",
  });
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const flatCategories = [];
  const flatten = (cats, depth = 0) => {
    cats.forEach((c) => {
      flatCategories.push({ ...c, depth });
      if (c.children?.length) flatten(c.children, depth + 1);
    });
  };
  flatten(categories.filter((c) => !c.parent));

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!form.category) return toast.error("Please select a category");

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("summary", form.summary.trim());
    fd.append("content", content);
    fd.append("category", form.category);
    if (form.tags.trim()) {
      fd.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)));
    }
    if (thumbnail) fd.append("thumbnail", thumbnail);

    const result = await dispatch(createNews(fd));
    if (createNews.fulfilled.match(result)) {
      toast.success("Article saved as draft!");
      navigate("/editor/my-news");
    } else {
      toast.error(result.payload || "Failed to create article");
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Write New Article</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            placeholder="Enter article title..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
          >
            <option value="">Select category</option>
            {flatCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {"—".repeat(c.depth)} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400 resize-none"
            placeholder="Short description shown in news cards..."
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
          {thumbnailPreview ? (
            <div className="relative inline-block">
              <img src={thumbnailPreview} alt="thumbnail" className="h-40 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => { setThumbnail(null); setThumbnailPreview(""); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-red-400 w-fit">
              <Upload className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload thumbnail</span>
              <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
            </label>
          )}
        </div>

        {/* Content (Rich Editor) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            placeholder="flood, politics, economy (comma separated)"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/editor/my-news")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNews;
