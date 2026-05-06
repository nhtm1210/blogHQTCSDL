//  routes/posts.js - CRUD cho collection posts

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/posts?status=&search=&authorId=
router.get("/", asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.authorId) filter.authorId = toObjectId(req.query.authorId);
  if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };

  const posts = await getDb().collection("posts").find(filter).sort({ createdAt: -1 }).toArray();
  res.json(posts);
}));

// GET /api/posts/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const post = await getDb().collection("posts").findOne({ _id: toObjectId(req.params.id) });
  if (!post) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(post);
}));

// POST /api/posts - User đăng bài (auto-activate author sub-document)
router.post("/", asyncHandler(async (req, res) => {
  const db = getDb();
  const { authorId, title, content, category, tags, thumbnail, status } = req.body;

  const userId = toObjectId(authorId);
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) return res.status(404).json({ error: "User không tồn tại" });
  if (user.status !== "active") return res.status(403).json({ error: "Tài khoản không hợp lệ" });
  if (user.role === "admin") return res.status(403).json({ error: "Admin không được đăng bài" });

  const newPost = {
    title, content,
    category: category || "Tổng hợp",
    tags: tags || [],
    thumbnail: thumbnail || "",
    authorId: userId,
    authorName: user.fullName,
    status: status || "draft",
    stats: { views: 0, likes: 0, comments: 0 },
    likedBy: [],
    publishedAt: status === "published" ? new Date() : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection("posts").insertOne(newPost);

  // Auto-activate author sub-document khi đăng bài đầu tiên
  if (!user.author?.isAuthor) {
    await db.collection("users").updateOne({ _id: userId }, {
      $set: {
        "author.isAuthor": true,
        "author.authorSince": new Date(),
        "author.specialization": category || "Tổng hợp",
        "author.totalLikes": 0,
        "author.totalViews": 0
      },
      $inc: { "author.totalPosts": 1 }
    });
  } else {
    await db.collection("users").updateOne({ _id: userId }, { $inc: { "author.totalPosts": 1 } });
  }

  await db.collection("activityLogs").insertOne({
    userId, username: user.username,
    action: "post_created",
    targetType: "post",
    targetId: result.insertedId,
    metadata: { title, status },
    createdAt: new Date()
  });

  res.json({ success: true, _id: result.insertedId });
}));

// PATCH /api/posts/:id/status - Admin đổi trạng thái
router.patch("/:id/status", asyncHandler(async (req, res) => {
  const db = getDb();
  const postId = toObjectId(req.params.id);
  const { status, adminId, adminUsername } = req.body;

  const update = { status, updatedAt: new Date() };
  if (status === "published") update.publishedAt = new Date();
  if (status === "archived") update.archivedAt = new Date();

  await db.collection("posts").updateOne({ _id: postId }, { $set: update });

  await db.collection("activityLogs").insertOne({
    userId: toObjectId(adminId),
    username: adminUsername || "admin",
    action: `post_${status}`,
    targetType: "post",
    targetId: postId,
    createdAt: new Date()
  });

  res.json({ success: true, status });
}));

// DELETE /api/posts/:id - Xóa bài (cascade)
router.delete("/:id", asyncHandler(async (req, res) => {
  const db = getDb();
  const postId = toObjectId(req.params.id);
  const userId = toObjectId(req.body.userId);

  const post = await db.collection("posts").findOne({ _id: postId });
  if (!post) return res.status(404).json({ error: "Bài không tồn tại" });

  const user = await db.collection("users").findOne({ _id: userId });
  const canDelete = user.role === "admin" || post.authorId.equals(userId);
  if (!canDelete) return res.status(403).json({ error: "Không có quyền xóa" });

  await Promise.all([
    db.collection("comments").deleteMany({ postId }),
    db.collection("likes").deleteMany({ postId }),
    db.collection("bookmarks").deleteMany({ postId }),
    db.collection("posts").deleteOne({ _id: postId })
  ]);

  // Cập nhật stats author
  await db.collection("users").updateOne(
    { _id: post.authorId },
    {
      $inc: {
        "author.totalPosts": -1,
        "author.totalLikes": -(post.stats?.likes || 0),
        "author.totalViews": -(post.stats?.views || 0)
      }
    }
  );

  await db.collection("activityLogs").insertOne({
    userId, username: user.username,
    action: user.role === "admin" && !post.authorId.equals(userId) ? "post_deleted_by_admin" : "post_deleted_by_owner",
    targetType: "post",
    targetId: postId,
    metadata: { title: post.title },
    createdAt: new Date()
  });

  res.json({ success: true });
}));

module.exports = router;
