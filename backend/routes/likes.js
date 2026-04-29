// ============================================================================
//  routes/likes.js - Collection likes (mỗi like = +1 view)
// ============================================================================

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// POST /api/posts/:id/like
router.post("/posts/:id/like", asyncHandler(async (req, res) => {
  const db = getDb();
  const postId = toObjectId(req.params.id);
  const userId = toObjectId(req.body.userId);

  const post = await db.collection("posts").findOne({ _id: postId });
  if (!post) return res.status(404).json({ error: "Bài không tồn tại" });
  if (post.status !== "published") return res.status(403).json({ error: "Chỉ like được bài đã đăng" });

  const user = await db.collection("users").findOne({ _id: userId });
  if (user.status !== "active") return res.status(403).json({ error: "Tài khoản đã bị khóa" });

  const existing = await db.collection("likes").findOne({ userId, postId });
  if (existing) return res.status(400).json({ error: "Đã like rồi" });

  await db.collection("likes").insertOne({ userId, postId, createdAt: new Date() });

  // Mỗi like = +1 like + 1 view (theo yêu cầu)
  await db.collection("posts").updateOne(
    { _id: postId },
    {
      $inc: { "stats.likes": 1, "stats.views": 1 },
      $addToSet: { likedBy: userId }
    }
  );

  // Cập nhật totalLikes của author
  await db.collection("users").updateOne(
    { _id: post.authorId },
    { $inc: { "author.totalLikes": 1, "author.totalViews": 1 } }
  );

  // Tạo notification
  if (!post.authorId.equals(userId)) {
    await db.collection("notifications").insertOne({
      userId: post.authorId,
      type: "like",
      message: `${user.username} đã thích bài '${post.title}'`,
      isRead: false,
      createdAt: new Date()
    });
  }

  await db.collection("activityLogs").insertOne({
    userId, username: user.username,
    action: "post_liked",
    targetType: "post",
    targetId: postId,
    createdAt: new Date()
  });

  res.json({ success: true });
}));

// DELETE /api/posts/:id/like - Bỏ like
router.delete("/posts/:id/like", asyncHandler(async (req, res) => {
  const db = getDb();
  const postId = toObjectId(req.params.id);
  const userId = toObjectId(req.body.userId);

  const result = await db.collection("likes").deleteOne({ userId, postId });
  if (result.deletedCount === 0) return res.status(400).json({ error: "Chưa like" });

  await db.collection("posts").updateOne(
    { _id: postId },
    { $inc: { "stats.likes": -1 }, $pull: { likedBy: userId } }
  );

  res.json({ success: true });
}));

module.exports = router;
