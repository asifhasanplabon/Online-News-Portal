import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// সব route এ admin only
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, isAdmin, getUserById);
router.patch("/:id/role", verifyToken, isAdmin, updateUserRole);       // role change
router.patch("/:id/status", verifyToken, isAdmin, toggleUserStatus);   // activate/deactivate
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;