// ============================================================================
//  routes/notifications.js - Collection notifications
// ============================================================================

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/notifications?userId=
router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.userId ? { userId: toObjectId(req.query.userId) } : {};
  const notifications = await getDb().collection("notifications")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  res.json(notifications);
}));

// PATCH /api/notifications/:id/read
router.patch("/:id/read", asyncHandler(async (req, res) => {
  await getDb().collection("notifications").updateOne(
    { _id: toObjectId(req.params.id) },
    { $set: { isRead: true } }
  );
  res.json({ success: true });
}));

// PATCH /api/notifications/read-all - Đánh dấu tất cả là đã đọc
router.patch("/read-all", asyncHandler(async (req, res) => {
  await getDb().collection("notifications").updateMany(
    { userId: toObjectId(req.body.userId), isRead: false },
    { $set: { isRead: true } }
  );
  res.json({ success: true });
}));

module.exports = router;
