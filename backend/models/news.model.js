import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // example: "dhaka-flood-2025-07-10"
    },
    content: {
      type: String,
      required: [true, "News content is required"],
      // rich text editor er HTML content store hobe
    },
    summary: {
      type: String,
      default: "",
      // short description for card/preview
    },
    thumbnail: {
      public_id: { type: String, default: "" }, // cloudinary
      url: { type: String, default: "" },
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ], // content er moddhe multiple image
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    tags: [{ type: String, trim: true }], // ["flood", "dhaka", "2025"]

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // editor je likheche
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      // admin je approve koreche
    },

    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
      // draft    → editor save koreche, submit kore ni
      // pending  → editor submit koreche, admin approval baaki
      // published→ admin approve koreche, live
      // rejected → admin reject koreche
    },

    isFeatured: {
      type: Boolean,
      default: false, // homepage hero/featured section
    },
    isBreaking: {
      type: Boolean,
      default: false, // breaking news ticker
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
      default: null, // admin approve korle set hobe
    },
  },
  { timestamps: true }
);

// ── Text search index (title + content) ──
newsSchema.index({ title: "text", content: "text", tags: "text" });

const News = mongoose.model("News", newsSchema);
export default News;