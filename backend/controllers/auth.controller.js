import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ── Token generate + cookie set helper ──
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    httpOnly: true,                                    // JS থেকে access করা যাবে না
    secure: process.env.NODE_ENV === "production",     // production এ HTTPS only
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,                 // 7 days
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// ── Register ──
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // already exists check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // role registration এ শুধু "user" allow — admin/editor পরে admin set করবে
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// ── Login ──
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // password select false ছিল, তাই manually select করতে হবে
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ── Logout ──
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // cookie expire করে দাও
  });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// ── Get current logged in user ──
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
