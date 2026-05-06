//  routes/users.js - CRUD cho collection users

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/users - Lấy tất cả users
router.get("/", asyncHandler(async (req, res) => {
  const users = await getDb().collection("users").find({}).toArray();
  res.json(users);
}));

// GET /api/users/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const user = await getDb().collection("users").findOne({ _id: toObjectId(req.params.id) });
  if (!user) return res.status(404).json({ error: "User không tồn tại" });
  res.json(user);
}));

// PATCH /api/users/:id/ban - Admin khóa/mở khóa user
router.patch("/:id/ban", asyncHandler(async (req, res) => {
  const db = getDb();
  const userId = toObjectId(req.params.id);
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) return res.status(404).json({ error: "User không tồn tại" });
  if (user.role === "admin") return res.status(403).json({ error: "Không thể khóa admin" });

  const newStatus = user.status === "banned" ? "active" : "banned";
  await db.collection("users").updateOne({ _id: userId }, { $set: { status: newStatus } });

  // Log
  await db.collection("activityLogs").insertOne({
    userId: toObjectId(req.body.adminId),
    username: req.body.adminUsername || "admin",
    action: newStatus === "banned" ? "user_banned" : "user_unbanned",
    targetType: "user",
    targetId: userId,
    createdAt: new Date()
  });

  res.json({ success: true, status: newStatus });
}));

// DELETE /api/users/:id - Admin xóa user (cascade)
router.delete("/:id", asyncHandler(async (req, res) => {
  const db = getDb();
  const userId = toObjectId(req.params.id);
  const user = await db.collection("users").findOne({ _id: userId });
  if (!user) return res.status(404).json({ error: "User không tồn tại" });
  if (user.role === "admin") return res.status(403).json({ error: "Không thể xóa admin" });

  // Cascade delete
  const userPosts = await db.collection("posts").find({ authorId: userId }).toArray();
  const postIds = userPosts.map(p => p._id);

  await Promise.all([
    db.collection("comments").deleteMany({ $or: [{ userId }, { postId: { $in: postIds } }] }),
    db.collection("likes").deleteMany({ $or: [{ userId }, { postId: { $in: postIds } }] }),
    db.collection("bookmarks").deleteMany({ $or: [{ userId }, { postId: { $in: postIds } }] }),
    db.collection("posts").deleteMany({ authorId: userId }),
    db.collection("notifications").deleteMany({ userId }),
    db.collection("users").deleteOne({ _id: userId })
  ]);

  await db.collection("activityLogs").insertOne({
    userId: toObjectId(req.body.adminId),
    username: req.body.adminUsername || "admin",
    action: "user_deleted",
    targetType: "user",
    targetId: userId,
    metadata: { username: user.username, deletedPosts: postIds.length },
    createdAt: new Date()
  });

  res.json({ success: true, deletedPosts: postIds.length });
}));

module.exports = router;
