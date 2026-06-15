import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ── 1. Verify Token (must be logged in) ──
export const verifyToken = async (req, res, next) => {
  try {
    // cookie অথবা Authorization header থেকে token নাও
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // token verify koro
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB থেকে fresh user data নাও (deactivated user handle করতে)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    req.user = user; // পরের middleware/controller এ user পাবে
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// ── 2. Admin only ──
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

// ── 3. Editor only ──
export const isEditor = (req, res, next) => {
  if (req.user?.role !== "editor") {
    return res.status(403).json({ success: false, message: "Access denied. Editors only." });
  }
  next();
};

// ── 4. Editor অথবা Admin (দুইজনই access পাবে) ──
export const isEditorOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "editor" && role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Editors or Admins only." });
  }
  next();
};
