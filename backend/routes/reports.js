//  routes/reports.js - Collection reports

const express = require("express");
const { getDb, toObjectId, asyncHandler } = require("../db");

const router = express.Router();

// GET /api/reports?status=
router.get("/", asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const reports = await getDb().collection("reports").find(filter).sort({ createdAt: -1 }).toArray();
  res.json(reports);
}));

// POST /api/reports - User báo cáo nội dung vi phạm
router.post("/", asyncHandler(async (req, res) => {
  const { reporterId, targetType, targetId, reason, description } = req.body;

  await getDb().collection("reports").insertOne({
    reporterId: toObjectId(reporterId),
    targetType,
    targetId: toObjectId(targetId),
    reason,
    description,
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date()
  });

  res.json({ success: true });
}));

// PATCH /api/reports/:id - Admin xử lý báo cáo
router.patch("/:id", asyncHandler(async (req, res) => {
  const db = getDb();
  const { status, adminId, adminNote } = req.body;

  await db.collection("reports").updateOne(
    { _id: toObjectId(req.params.id) },
    {
      $set: {
        status,
        reviewedBy: toObjectId(adminId),
        reviewedAt: new Date(),
        adminNote: adminNote || ""
      }
    }
  );

  await db.collection("activityLogs").insertOne({
    userId: toObjectId(adminId),
    username: "admin",
    action: "report_resolved",
    targetType: "report",
    targetId: toObjectId(req.params.id),
    metadata: { status },
    createdAt: new Date()
  });

  res.json({ success: true });
}));

module.exports = router;
