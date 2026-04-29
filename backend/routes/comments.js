// ============================================================================
//  routes/comments.js - Collection comments
// ============================================================================

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/comments?postId=
router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.postId ? { postId: toObjectId(req.query.postId) } : {};
  const comments = await getDb().collection("comments").find(filter).sort({ createdAt: 1 }).toArray();
  res.json(comments);
}));

// POST /api/comments - User comment vào bài (chỉ cho bài published)
router.post("/", asyncHandler(async (req, res) => {
  const db = getDb();
  const postId = toObjectId(req.body.postId);
  const userId = toObjectId(req.body.userId);
  const { content, parentCommentId } = req.body;

  const post = await db.collection("posts").findOne({ _id: postId });
  if (!post) return res.status(404).json({ error: "Bài không tồn tại" });
  if (post.status !== "published") return res.status(403).json({ error: "Chỉ comment được bài đã đăng" });

  const user = await db.collection("users").findOne({ _id: userId });
  if (user.status !== "active") return res.status(403).json({ error: "Tài khoản đã bị khóa" });

  const newComment = {
    postId, userId,
    username: user.username,
    userAvatar: user.avatar,
    content,
    parentCommentId: parentCommentId ? toObjectId(parentCommentId) : null,
    status: "visible",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection("comments").insertOne(newComment);

  // Tăng commentsCount của post
  await db.collection("posts").updateOne({ _id: postId }, { $inc: { "stats.comments": 1 } });

  // Tạo notification cho author (nếu không phải comment bài của chính mình)
  if (!post.authorId.equals(userId)) {
    await db.collection("notifications").insertOne({
      userId: post.authorId,
      type: "comment",
      message: `${user.username} đã bình luận bài '${post.title}'`,
      isRead: false,
      createdAt: new Date()
    });
  }

  await db.collection("activityLogs").insertOne({
    userId, username: user.username,
    action: "comment_added",
    targetType: "comment",
    targetId: result.insertedId,
    createdAt: new Date()
  });

  res.json({ success: true, _id: result.insertedId });
}));

// PATCH /api/comments/:id/hide - Admin ẩn comment
router.patch("/:id/hide", asyncHandler(async (req, res) => {
  await getDb().collection("comments").updateOne(
    { _id: toObjectId(req.params.id) },
    { $set: { status: "hidden" } }
  );
  res.json({ success: true });
}));

module.exports = router;
