// ============================================================================
//  routes/admin.js - activityLogs, stats, categories (read-only)
// ============================================================================

const express = require("express");
const { getDb, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/activity-logs - Audit log
router.get("/activity-logs", asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const logs = await getDb().collection("activityLogs")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  res.json(logs);
}));

// GET /api/categories
router.get("/categories", asyncHandler(async (req, res) => {
  const categories = await getDb().collection("categories").find({}).toArray();
  res.json(categories);
}));

// GET /api/stats - Dashboard tổng hợp
router.get("/stats", asyncHandler(async (req, res) => {
  const db = getDb();

  const [
    totalUsers, totalActive, totalBanned,
    totalPosts, totalPublished, totalDraft, totalArchived,
    totalComments, totalLikes, totalBookmarks, totalReportsPending,
    aggViews, aggLikes
  ] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("users").countDocuments({ status: "active" }),
    db.collection("users").countDocuments({ status: "banned" }),
    db.collection("posts").countDocuments(),
    db.collection("posts").countDocuments({ status: "published" }),
    db.collection("posts").countDocuments({ status: "draft" }),
    db.collection("posts").countDocuments({ status: "archived" }),
    db.collection("comments").countDocuments(),
    db.collection("likes").countDocuments(),
    db.collection("bookmarks").countDocuments(),
    db.collection("reports").countDocuments({ status: "pending" }),
    db.collection("posts").aggregate([{ $group: { _id: null, total: { $sum: "$stats.views" } } }]).toArray(),
    db.collection("posts").aggregate([{ $group: { _id: null, total: { $sum: "$stats.likes" } } }]).toArray()
  ]);

  // Top authors
  const topAuthors = await db.collection("users")
    .find({ "author.isAuthor": true, status: "active" })
    .sort({ "author.totalLikes": -1 })
    .limit(5)
    .toArray();

  // Trending posts
  const trendingPosts = await db.collection("posts").aggregate([
    { $match: { status: "published" } },
    {
      $addFields: {
        hotScore: {
          $add: [
            { $multiply: ["$stats.likes", 3] },
            { $multiply: ["$stats.comments", 5] },
            "$stats.views"
          ]
        }
      }
    },
    { $sort: { hotScore: -1 } },
    { $limit: 5 }
  ]).toArray();

  res.json({
    counts: {
      totalUsers, totalActive, totalBanned,
      totalPosts, totalPublished, totalDraft, totalArchived,
      totalComments, totalLikes, totalBookmarks, totalReportsPending,
      totalViews: aggViews[0]?.total || 0,
      totalLikesSum: aggLikes[0]?.total || 0
    },
    topAuthors,
    trendingPosts
  });
}));

module.exports = router;
