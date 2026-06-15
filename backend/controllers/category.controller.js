import Category from "../models/category.model.js";
import slugify from "slugify"; // npm install slugify

// ── Create category ──
export const createCategory = async (req, res, next) => {
  try {
    const { name, parent, description } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    // duplicate check
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists." });
    }

    // parent থাকলে valid কিনা check
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({ success: false, message: "Parent category not found." });
      }
    }

    const category = await Category.create({ name, slug, parent: parent || null, description });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// ── Get all categories (tree structure) ──
export const getAllCategories = async (req, res, next) => {
  try {
    // সব categories আনো
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // parent-child tree বানাও
    const rootCategories = categories.filter((c) => !c.parent);
    const buildTree = (parentId) =>
      categories
        .filter((c) => String(c.parent) === String(parentId))
        .map((c) => ({ ...c._doc, children: buildTree(c._id) }));

    const tree = rootCategories.map((c) => ({
      ...c._doc,
      children: buildTree(c._id),
    }));

    res.status(200).json({ success: true, categories: tree });
  } catch (error) {
    next(error);
  }
};

// ── Get single category ──
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent", "name slug");
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// ── Update category ──
export const updateCategory = async (req, res, next) => {
  try {
    const { name, parent, description, isActive } = req.body;

    const updateData = { description, isActive };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (parent !== undefined) updateData.parent = parent || null;

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// ── Delete category ──
export const deleteCategory = async (req, res, next) => {
  try {
    // subcategory আছে কিনা check
    const hasChildren = await Category.findOne({ parent: req.params.id });
    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: "Delete subcategories first before deleting this category.",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    next(error);
  }
};