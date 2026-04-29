// ============================================================================
//  db.js - Module kết nối MongoDB
// ============================================================================

const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "blogManagementDB";

let dbInstance = null;

async function connect() {
  if (dbInstance) return dbInstance;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  dbInstance = client.db(DB_NAME);
  console.log(`✓ MongoDB connected: ${MONGO_URI}/${DB_NAME}`);
  return dbInstance;
}

function getDb() {
  if (!dbInstance) throw new Error("Database chưa được kết nối. Gọi connect() trước.");
  return dbInstance;
}

// Helper an toàn cho ObjectId
function toObjectId(id) {
  if (!id) return null;
  try {
    return typeof id === "string" ? new ObjectId(id) : id;
  } catch {
    return null;
  }
}

// Helper xử lý lỗi cho route handlers (loại bỏ try/catch lặp đi lặp lại)
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
  };
}

module.exports = { connect, getDb, toObjectId, asyncHandler, ObjectId };
