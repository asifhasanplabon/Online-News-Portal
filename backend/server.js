import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── DB + Cloudinary connect ──
connectDB();
connectCloudinary();

// ── Middleware ──
app.use(
  cors({
    origin: process.env.CLIENT_URL, // netlify frontend URL
    credentials: true,              // cookie পাঠাতে হবে
  })
);
app.use(express.json({ limit: "10mb" }));       // JSON body parse
app.use(express.urlencoded({ extended: true })); // form data parse
app.use(cookieParser());                         // cookie parse

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ success: true, message: "News Portal API is running..." });
});

// ── Routes (later add korbe) ──
// import authRouter from "./routes/auth.routes.js";
// app.use("/api/auth", authRouter);

// ── Global error handler ──
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});