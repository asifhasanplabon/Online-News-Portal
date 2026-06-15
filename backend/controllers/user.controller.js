import User from "../models/user.model.js";

// ── Get all users ──
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get single user ──
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ── Update user role (admin only) ──
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: `Role updated to ${role}.`, user });
  } catch (error) {
    next(error);
  }
};

// ── Toggle user active/inactive ──
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete user ──
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};