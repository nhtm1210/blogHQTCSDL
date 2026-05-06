//  routes/auth.js - Đăng nhập

const express = require("express");
const { getDb, asyncHandler } = require("../db");

const router = express.Router();

// POST /api/auth/login
router.post("/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập username và mật khẩu" });
  }

  const db = getDb();
  const user = await db.collection("users").findOne({ username });

  if (!user) {
    return res.status(401).json({ error: "Tên đăng nhập không tồn tại" });
  }

  // Demo: so sánh trực tiếp (thực tế dùng bcrypt.compare)
  if (password !== user.passwordHash) {
    return res.status(401).json({ error: "Mật khẩu không đúng" });
  }

  await db.collection("activityLogs").insertOne({
    userId: user._id,
    username: user.username,
    action: "user_login",
    targetType: "user",
    targetId: user._id,
    createdAt: new Date()
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
}));

module.exports = router;
