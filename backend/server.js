//  server.js - Entry point của backend

const express = require("express");
const cors = require("cors");
const { connect, getDb } = require("./db");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const likesRoutes = require("./routes/likes");
const bookmarksRoutes = require("./routes/bookmarks");
const notificationsRoutes = require("./routes/notifications");
const reportsRoutes = require("./routes/reports");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Mount routes — mỗi collection có file riêng
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api", likesRoutes);          // POST /api/posts/:id/like
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api", adminRoutes);          // /api/activity-logs, /api/stats, /api/categories

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));

async function start() {
  try {
    await connect();
    const userCount = await getDb().collection("users").countDocuments();
    if (userCount === 0) {
      console.warn("⚠ Database trống! Hãy chạy: mongosh < blog_system.js trước");
    } else {
      console.log(`✓ Found ${userCount} users in database`);
    }
    app.listen(PORT, () => {
      console.log(`\n  🚀 Backend API:  http://localhost:${PORT}/api\n`);
    });
  } catch (err) {
    console.error("✗ Lỗi khởi động:", err.message);
    console.error("  Đảm bảo MongoDB đang chạy ở localhost:27017");
    process.exit(1);
  }
}

start();
