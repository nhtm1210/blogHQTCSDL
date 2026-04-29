// ============================================================================
//  routes/bookmarks.js - Collection bookmarks
// ============================================================================

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/bookmarks?userId=
router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.userId ? { userId: toObjectId(req.query.userId) } : {};
  const bookmarks = await getDb().collection("bookmarks").find(filter).sort({ createdAt: -1 }).toArray();
  res.json(bookmarks);
}));

// POST /api/bookmarks - Toggle bookmark
router.post("/", asyncHandler(async (req, res) => {
  const db = getDb();
  const userId = toObjectId(req.body.userId);
  const postId = toObjectId(req.body.postId);

  const existing = await db.collection("bookmarks").findOne({ userId, postId });
  if (existing) {
    await db.collection("bookmarks").deleteOne({ _id: existing._id });
    return res.json({ success: true, action: "removed" });
  }

  await db.collection("bookmarks").insertOne({
    userId, postId,
    note: req.body.note || "",
    createdAt: new Date()
  });

  res.json({ success: true, action: "added" });
}));

module.exports = router;
