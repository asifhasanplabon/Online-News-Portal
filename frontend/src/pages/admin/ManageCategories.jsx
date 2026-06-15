import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../features/category/categorySlice";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

const ManageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((s) => s.category);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", parent: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const rootCategories = categories.filter((c) => !c.parent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Category name is required");
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      parent: form.parent || null,
    };

    let result;
    if (editId) {
      result = await dispatch(updateCategory({ id: editId, data: payload }));
    } else {
      result = await dispatch(createCategory(payload));
    }

    if (createCategory.fulfilled.match(result) || updateCategory.fulfilled.match(result)) {
      toast.success(editId ? "Category updated!" : "Category created!");
      resetForm();
    } else {
      toast.error(result.payload || "Failed");
    }
    setSubmitting(false);
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, parent: cat.parent?._id || cat.parent || "", description: cat.description || "" });
    setEditId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const result = await dispatch(deleteCategory(id));
    if (deleteCategory.fulfilled.match(result)) toast.success("Deleted!");
    else toast.error(result.payload || "Delete failed");
  };

  const resetForm = () => {
    setForm({ name: "", parent: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const renderCategory = (cat, depth = 0) => (
    <div key={cat._id}>
      <div
        className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 border-b border-gray-100"
        style={{ paddingLeft: `${16 + depth * 20}px` }}
      >
        <div>
          <span className="font-medium text-gray-800">{cat.name}</span>
          {cat.description && (
            <p className="text-xs text-gray-500">{cat.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(cat)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(cat._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {cat.children?.map((child) => renderCategory(child, depth + 1))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Categories</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">{editId ? "Edit Category" : "New Category"}</h3>
            <button onClick={resetForm}><X className="h-4 w-4 text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="e.g. Politics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent (optional)</label>
              <select
                value={form.parent}
                onChange={(e) => setForm({ ...form, parent: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
              >
                <option value="">None (root category)</option>
                {rootCategories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="Optional description"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> {editId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : !categories.length ? (
          <p className="text-center py-10 text-gray-500">No categories yet.</p>
        ) : (
          rootCategories.map((cat) => renderCategory(cat))
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
