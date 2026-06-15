import News from "../models/News.model.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

// ── Create news (editor) ──
export const createNews = async (req, res, next) => {
  try {
    const { title, content, summary, category, tags } = req.body;

    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();

    // multer-cloudinary থেকে uploaded file info
    const thumbnail =
      req.files?.thumbnail?.[0]
        ? { public_id: req.files.thumbnail[0].filename, url: req.files.thumbnail[0].path }
        : { public_id: "", url: "" };

    const images =
      req.files?.images?.map((file) => ({
        public_id: file.filename,
        url: file.path,
      })) || [];

    const news = await News.create({
      title,
      slug,
      content,
      summary,
      category,
      tags: tags ? JSON.parse(tags) : [],  // frontend থেকে JSON string আসবে
      author: req.user._id,
      thumbnail,
      images,
      status: "draft",
    });

    res.status(201).json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

// ── Get all published news (public) ──
export const getAllNews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      isFeatured,
      isBreaking,
    } = req.query;

    const filter = { status: "published" };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (isFeatured) filter.isFeatured = true;
    if (isBreaking) filter.isBreaking = true;
    if (search) filter.$text = { $search: search };  // text index use

    const skip = (page - 1) * limit;

    const [newsList, total] = await Promise.all([
      News.find(filter)
        .populate("category", "name slug")
        .populate("author", "name avatar")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-content"),  // list এ content দরকার নেই, detail page এ লাগবে
      News.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      news: newsList,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get news by ID ──
export const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id)
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .populate("approvedBy", "name");

    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    res.status(200).json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

// ── Get news by slug (public detail page) ──
export const getNewsBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug, status: "published" })
      .populate("category", "name slug")
      .populate("author", "name avatar");

    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    res.status(200).json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

// ── Update news ──
export const updateNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    // editor শুধু নিজের news edit করতে পারবে
    if (req.user.role === "editor" && String(news.author) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "You can only edit your own news." });
    }

    const { title, content, summary, category, tags } = req.body;

    if (title) {
      news.title = title;
      news.slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now();
    }
    if (content) news.content = content;
    if (summary) news.summary = summary;
    if (category) news.category = category;
    if (tags) news.tags = JSON.parse(tags);

    // নতুন thumbnail আসলে পুরনো cloudinary থেকে delete করো
    if (req.files?.thumbnail?.[0]) {
      if (news.thumbnail.public_id) {
        await cloudinary.uploader.destroy(news.thumbnail.public_id);
      }
      news.thumbnail = {
        public_id: req.files.thumbnail[0].filename,
        url: req.files.thumbnail[0].path,
      };
    }

    // নতুন images আসলে পুরনোগুলো delete করো
    if (req.files?.images?.length > 0) {
      for (const img of news.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      news.images = req.files.images.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    // edit করলে আবার pending তে যাবে (re-approval দরকার)
    if (req.user.role === "editor") news.status = "draft";

    await news.save();
    res.status(200).json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

// ── Submit for approval (editor) ──
export const submitForApproval = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    if (String(news.author) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "You can only submit your own news." });
    }

    if (news.status === "published") {
      return res.status(400).json({ success: false, message: "News is already published." });
    }

    news.status = "pending";
    await news.save();

    res.status(200).json({ success: true, message: "News submitted for approval." });
  } catch (error) {
    next(error);
  }
};

// ── Approve news (admin) ──
export const approveNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    news.status = "published";
    news.approvedBy = req.user._id;
    news.publishedAt = new Date();
    await news.save();

    res.status(200).json({ success: true, message: "News approved and published." });
  } catch (error) {
    next(error);
  }
};

// ── Reject news (admin) ──
export const rejectNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    news.status = "rejected";
    await news.save();

    res.status(200).json({ success: true, message: "News rejected." });
  } catch (error) {
    next(error);
  }
};

// ── Toggle featured ──
export const toggleFeatured = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    news.isFeatured = !news.isFeatured;
    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${news.isFeatured ? "marked as featured" : "removed from featured"}.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Toggle breaking ──
export const toggleBreaking = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    news.isBreaking = !news.isBreaking;
    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${news.isBreaking ? "marked as breaking" : "removed from breaking"}.`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Increment view count ──
export const incrementView = async (req, res, next) => {
  try {
    await News.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// ── Get editor's own news ──
export const getMyNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { author: req.user._id };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
      News.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      News.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, total, page: Number(page), totalPages: Math.ceil(total / limit), news });
  } catch (error) {
    next(error);
  }
};

// ── Get pending news (admin) ──
export const getPendingNews = async (req, res, next) => {
  try {
    const news = await News.find({ status: "pending" })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: news.length, news });
  } catch (error) {
    next(error);
  }
};

// ── Delete news ──
export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found." });
    }

    // editor শুধু নিজেরটা delete করতে পারবে
    if (req.user.role === "editor" && String(news.author) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "You can only delete your own news." });
    }

    // cloudinary থেকে সব image delete করো
    if (news.thumbnail.public_id) {
      await cloudinary.uploader.destroy(news.thumbnail.public_id);
    }
    for (const img of news.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await news.deleteOne();
    res.status(200).json({ success: true, message: "News deleted successfully." });
  } catch (error) {
    next(error);
  }
};