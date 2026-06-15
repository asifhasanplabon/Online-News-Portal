import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  getNewsBySlug,
  updateNews,
  deleteNews,
  submitForApproval,
  approveNews,
  rejectNews,
  toggleFeatured,
  toggleBreaking,
  incrementView,
} from "../controllers/news.controller.js";
import { verifyToken, isAdmin, isEditor, isEditorOrAdmin } from "../middleware/auth.middleware.js";
import { uploadNewsImages } from "../middleware/upload.middleware.js";

const router = express.Router();

// ── Public routes ──
router.get("/", getAllNews);                        // সব published news
router.get("/slug/:slug", getNewsBySlug);           // slug দিয়ে news
router.get("/:id", getNewsById);                    // id দিয়ে news
router.patch("/:id/view", incrementView);           // view count বাড়ানো

// ── Editor routes ──
router.post("/", verifyToken, isEditor, uploadNewsImages, createNews);           // news create
router.put("/:id", verifyToken, isEditorOrAdmin, uploadNewsImages, updateNews);  // news edit
router.patch("/:id/submit", verifyToken, isEditor, submitForApproval);           // approval এ submit
router.delete("/:id", verifyToken, isEditorOrAdmin, deleteNews);                 // news delete

// ── Admin routes ──
router.patch("/:id/approve", verifyToken, isAdmin, approveNews);         // approve
router.patch("/:id/reject", verifyToken, isAdmin, rejectNews);           // reject
router.patch("/:id/featured", verifyToken, isAdmin, toggleFeatured);     // featured toggle
router.patch("/:id/breaking", verifyToken, isAdmin, toggleBreaking);     // breaking toggle

export default router;