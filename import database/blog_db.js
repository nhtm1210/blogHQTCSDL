// ============================================================================
//  HỆ THỐNG QUẢN LÝ BLOG - MONGODB
//  Chạy: mongosh < blog_db.js
// ============================================================================

use("blogManagementDB");
db.dropDatabase();

print("======= KHỞI TẠO HỆ THỐNG BLOG =======");

//  PHẦN A: TẠO COLLECTIONS VỚI VALIDATION

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "passwordHash", "fullName", "role", "status", "createdAt"],
      properties: {
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        passwordHash: { bsonType: "string" },
        fullName: { bsonType: "string" },
        role: { enum: ["admin", "user"] },
        status: { enum: ["active", "banned", "inactive"] },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "content", "authorId", "status", "createdAt"],
      properties: {
        title: { bsonType: "string" },
        content: { bsonType: "string" },
        authorId: { bsonType: "objectId" },
        status: { enum: ["draft", "published", "archived"] },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection("comments");
db.createCollection("likes");
db.createCollection("categories");
db.createCollection("bookmarks");
db.createCollection("notifications");
db.createCollection("reports");
db.createCollection("activityLogs");

print(">> Đã tạo 9 collections.");

//  PHẦN B: TẠO INDEXES


// Users
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Posts
db.posts.createIndex({ authorId: 1, status: 1 });
db.posts.createIndex({ status: 1, publishedAt: -1 });
db.posts.createIndex({ title: "text", content: "text" });

// Comments
db.comments.createIndex({ postId: 1, createdAt: 1 });

// Likes
db.likes.createIndex({ userId: 1, postId: 1 }, { unique: true });

// Bookmarks
db.bookmarks.createIndex({ userId: 1, postId: 1 }, { unique: true });

// Categories
db.categories.createIndex({ slug: 1 }, { unique: true });

// Notifications: TTL — tự xóa sau 30 ngày
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// ActivityLogs
db.activityLogs.createIndex({ userId: 1, createdAt: -1 });

print(">> Đã tạo indexes.");

//  PHẦN C: CHÈN DỮ LIỆU MẪU

// === USERS (22) ===
db.users.insertMany([
  { _id: ObjectId("507f1f77bcf86cd799439001"), username: "admin_master", email: "admin@blog.com", passwordHash: "hash1", fullName: "Admin Master", role: "admin", status: "active", createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439002"), username: "mod_helper", email: "mod@blog.com", passwordHash: "hash2", fullName: "Moderator", role: "admin", status: "active", createdAt: new Date("2024-03-20T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", email: "nguyenvana@gmail.com", passwordHash: "hash3", fullName: "Nguyễn Văn An", role: "user", status: "active", author: { isAuthor: true, totalPosts: 3, totalLikes: 1, totalViews: 1 }, createdAt: new Date("2024-05-09T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439004"), username: "tranthib", email: "tranthib@gmail.com", passwordHash: "hash4", fullName: "Trần Thị Bích", role: "user", status: "active", author: { isAuthor: true, totalPosts: 2 }, createdAt: new Date("2024-06-08T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439005"), username: "lehoangc", email: "lehoangc@gmail.com", passwordHash: "hash5", fullName: "Lê Hoàng Cường", role: "user", status: "active", author: { isAuthor: true, totalPosts: 3, totalLikes: 1, totalViews: 1 }, createdAt: new Date("2024-06-28T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439006"), username: "phamminhd", email: "phamminhd@gmail.com", passwordHash: "hash6", fullName: "Phạm Minh Đức", role: "user", status: "active", author: { isAuthor: true, totalPosts: 2 }, createdAt: new Date("2024-07-18T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439007"), username: "dothie", email: "dothie@gmail.com", passwordHash: "hash7", fullName: "Đỗ Thị Hồng", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1 }, createdAt: new Date("2024-08-07T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439008"), username: "hoangvanf", email: "hoangvanf@gmail.com", passwordHash: "hash8", fullName: "Hoàng Văn Phúc", role: "user", status: "active", author: { isAuthor: true, totalPosts: 2 }, createdAt: new Date("2024-08-17T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439009"), username: "vutrong", email: "vutrong@gmail.com", passwordHash: "hash9", fullName: "Vũ Trọng Nghĩa", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1 }, createdAt: new Date("2024-08-27T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900a"), username: "buithanh", email: "buithanh@gmail.com", passwordHash: "hash10", fullName: "Bùi Thanh Hà", role: "user", status: "active", createdAt: new Date("2024-10-06T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", email: "dangminh@gmail.com", passwordHash: "hash11", fullName: "Đặng Minh", role: "user", status: "active", createdAt: new Date("2024-10-16T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900c"), username: "lethu", email: "lethu@gmail.com", passwordHash: "hash12", fullName: "Lê Thu", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1, totalLikes: 1, totalViews: 1 }, createdAt: new Date("2024-09-26T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900d"), username: "truongan", email: "truongan@gmail.com", passwordHash: "hash13", fullName: "Trương An", role: "user", status: "active", createdAt: new Date("2024-10-26T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900e"), username: "nguyenkhoi", email: "nguyenkhoi@gmail.com", passwordHash: "hash14", fullName: "Nguyễn Khôi", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1 }, createdAt: new Date("2024-10-21T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79943900f"), username: "mai_thanh", email: "mai@gmail.com", passwordHash: "hash15", fullName: "Mai Thanh", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1 }, createdAt: new Date("2024-10-31T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439010"), username: "quanghuy", email: "quanghuy@gmail.com", passwordHash: "hash16", fullName: "Quang Huy", role: "user", status: "active", createdAt: new Date("2024-11-10T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439011"), username: "ngocanh", email: "ngocanh@gmail.com", passwordHash: "hash17", fullName: "Ngọc Ánh", role: "user", status: "active", author: { isAuthor: true, totalPosts: 2 }, createdAt: new Date("2024-11-05T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439012"), username: "duchanh", email: "duchanh@gmail.com", passwordHash: "hash18", fullName: "Đức Hạnh", role: "user", status: "active", createdAt: new Date("2024-11-25T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439013"), username: "thuylinh", email: "thuylinh@gmail.com", passwordHash: "hash19", fullName: "Thùy Linh", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1, totalLikes: 1, totalViews: 1 }, createdAt: new Date("2024-11-20T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439014"), username: "tuanvu", email: "tuanvu@gmail.com", passwordHash: "hash20", fullName: "Tuấn Vũ", role: "user", status: "active", createdAt: new Date("2024-12-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439015"), username: "hongnhung", email: "hongnhung@gmail.com", passwordHash: "hash21", fullName: "Hồng Nhung", role: "user", status: "active", author: { isAuthor: true, totalPosts: 1 }, createdAt: new Date("2024-12-05T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799439016"), username: "spam_user", email: "spam@temp.com", passwordHash: "hash22", fullName: "Spam", role: "user", status: "banned", createdAt: new Date("2024-12-30T17:00:00.000Z") }
]);
print(">> Đã insert 22 users.");

db.categories.insertMany([
  { _id: ObjectId("507f1f77bcf86cd799440001"), name: "Lập trình", slug: "lap-trinh", postsCount: 5, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440002"), name: "Du lịch", slug: "du-lich", postsCount: 3, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440003"), name: "Ẩm thực", slug: "am-thuc", postsCount: 2, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440004"), name: "Công nghệ", slug: "cong-nghe", postsCount: 3, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440005"), name: "Tài chính", slug: "tai-chinh", postsCount: 2, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440006"), name: "Sức khỏe", slug: "suc-khoe", postsCount: 3, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440007"), name: "Giáo dục", slug: "giao-duc", postsCount: 2, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440008"), name: "Giải trí", slug: "giai-tri", postsCount: 1, createdAt: new Date("2024-01-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799440009"), name: "Văn hóa", slug: "van-hoa", postsCount: 1, createdAt: new Date("2024-01-15T17:00:00.000Z") }
]);
print(">> Đã insert 9 categories.");

db.posts.insertMany([
  { _id: ObjectId("507f1f77bcf86cd799441001"), title: "Hướng dẫn MongoDB", content: "MongoDB là CSDL NoSQL...", authorId: ObjectId("507f1f77bcf86cd799439003"), authorName: "Nguyễn Văn An", status: "published", stats: { views: 246, likes: 19, comments: 4 }, likedBy: [ObjectId("507f1f77bcf86cd79943900a"), ObjectId("507f1f77bcf86cd79943900b"), ObjectId("507f1f77bcf86cd799439003")], publishedAt: new Date("2024-08-17T17:00:00.000Z"), createdAt: new Date("2024-08-15T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441002"), title: "Ẩm thực Hà Nội", content: "Hà Nội có ẩm thực phong phú...", authorId: ObjectId("507f1f77bcf86cd799439004"), authorName: "Trần Thị Bích", status: "published", stats: { views: 420, likes: 42, comments: 5 }, publishedAt: new Date("2024-08-27T17:00:00.000Z"), createdAt: new Date("2024-08-25T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441003"), title: "Du lịch Đà Lạt", content: "Đà Lạt là thành phố mộng mơ...", authorId: ObjectId("507f1f77bcf86cd799439005"), authorName: "Lê Hoàng Cường", status: "published", stats: { views: 380, likes: 35, comments: 3 }, publishedAt: new Date("2024-09-06T17:00:00.000Z"), createdAt: new Date("2024-09-04T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441004"), title: "Xu hướng AI 2026", content: "AI đang phát triển nhanh...", authorId: ObjectId("507f1f77bcf86cd799439006"), authorName: "Phạm Minh Đức", status: "published", stats: { views: 520, likes: 55, comments: 4 }, publishedAt: new Date("2024-09-16T17:00:00.000Z"), createdAt: new Date("2024-09-14T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441005"), title: "Học tiếng Anh", content: "Phương pháp học hiệu quả...", authorId: ObjectId("507f1f77bcf86cd79943900c"), authorName: "Lê Thu", status: "published", stats: { views: 291, likes: 29, comments: 3 }, likedBy: [ObjectId("507f1f77bcf86cd79943900b")], publishedAt: new Date("2024-10-11T17:00:00.000Z"), createdAt: new Date("2024-10-09T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441006"), title: "Đầu tư chứng khoán", content: "Cách đầu tư an toàn...", authorId: ObjectId("507f1f77bcf86cd799439008"), authorName: "Hoàng Văn Phúc", status: "published", stats: { views: 465, likes: 40, comments: 3 }, publishedAt: new Date("2024-09-26T17:00:00.000Z"), createdAt: new Date("2024-09-24T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441007"), title: "iPhone 17 Pro Max", content: "Review chi tiết...", authorId: ObjectId("507f1f77bcf86cd799439006"), authorName: "Phạm Minh Đức", status: "published", stats: { views: 580, likes: 40, comments: 3 }, publishedAt: new Date("2024-10-06T17:00:00.000Z"), createdAt: new Date("2024-10-04T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441008"), title: "Du lịch Nhật Bản", content: "Hành trình 7 ngày...", authorId: ObjectId("507f1f77bcf86cd799439005"), authorName: "Lê Hoàng Cường", status: "published", stats: { views: 640, likes: 48, comments: 4 }, publishedAt: new Date("2024-10-21T17:00:00.000Z"), createdAt: new Date("2024-10-19T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441009"), title: "Framework JavaScript", content: "So sánh các framework...", authorId: ObjectId("507f1f77bcf86cd79943900e"), authorName: "Nguyễn Khôi", status: "published", stats: { views: 395, likes: 40, comments: 3 }, publishedAt: new Date("2024-11-10T17:00:00.000Z"), createdAt: new Date("2024-11-08T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100a"), title: "Nấu phở bò", content: "Công thức phở Hà Nội...", authorId: ObjectId("507f1f77bcf86cd799439004"), authorName: "Trần Thị Bích", status: "published", stats: { views: 470, likes: 36, comments: 3 }, publishedAt: new Date("2024-10-31T17:00:00.000Z"), createdAt: new Date("2024-10-29T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100b"), title: "Sách phát triển bản thân", content: "5 cuốn sách kinh điển...", authorId: ObjectId("507f1f77bcf86cd799439011"), authorName: "Ngọc Ánh", status: "published", stats: { views: 310, likes: 30, comments: 2 }, publishedAt: new Date("2024-11-25T17:00:00.000Z"), createdAt: new Date("2024-11-23T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100c"), title: "VinFast VF8", content: "Trải nghiệm xe điện...", authorId: ObjectId("507f1f77bcf86cd799439015"), authorName: "Hồng Nhung", status: "published", stats: { views: 220, likes: 15, comments: 2 }, publishedAt: new Date("2024-12-25T17:00:00.000Z"), createdAt: new Date("2024-12-23T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100d"), title: "Giao tiếp công sở", content: "Kỹ năng giao tiếp...", authorId: ObjectId("507f1f77bcf86cd799439011"), authorName: "Ngọc Ánh", status: "published", stats: { views: 340, likes: 30, comments: 2 }, publishedAt: new Date("2024-11-30T17:00:00.000Z"), createdAt: new Date("2024-11-28T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100e"), title: "Chăm sóc da mùa đông", content: "Quy trình skincare...", authorId: ObjectId("507f1f77bcf86cd799439007"), authorName: "Đỗ Thị Hồng", status: "published", stats: { views: 420, likes: 34, comments: 2 }, publishedAt: new Date("2024-12-10T17:00:00.000Z"), createdAt: new Date("2024-12-08T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd79944100f"), title: "Cuộc sống freelancer", content: "3 năm làm freelancer...", authorId: ObjectId("507f1f77bcf86cd799439013"), authorName: "Thùy Linh", status: "published", stats: { views: 491, likes: 39, comments: 3 }, likedBy: [ObjectId("507f1f77bcf86cd799439003")], publishedAt: new Date("2024-12-20T17:00:00.000Z"), createdAt: new Date("2024-12-18T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441010"), title: "Khám phá Sapa", content: "Lịch trình 3N2Đ...", authorId: ObjectId("507f1f77bcf86cd799439005"), authorName: "Lê Hoàng Cường", status: "published", stats: { views: 391, likes: 38, comments: 2 }, likedBy: [ObjectId("507f1f77bcf86cd799439003")], publishedAt: new Date("2024-12-30T17:00:00.000Z"), createdAt: new Date("2024-12-28T17:00:00.000Z") },
  // Draft
  { _id: ObjectId("507f1f77bcf86cd799441011"), title: "Node.js REST API", content: "Hướng dẫn Node.js...", authorId: ObjectId("507f1f77bcf86cd799439003"), authorName: "Nguyễn Văn An", status: "draft", stats: { views: 0, likes: 0, comments: 0 }, publishedAt: null, createdAt: new Date("2025-01-09T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441012"), title: "React Native 30 ngày", content: "Lộ trình React...", authorId: ObjectId("507f1f77bcf86cd79943900e"), authorName: "Nguyễn Khôi", status: "draft", stats: { views: 0, likes: 0, comments: 0 }, publishedAt: null, createdAt: new Date("2025-01-11T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441013"), title: "Phân tích kỹ thuật", content: "PTKT chứng khoán...", authorId: ObjectId("507f1f77bcf86cd799439008"), authorName: "Hoàng Văn Phúc", status: "draft", stats: { views: 0, likes: 0, comments: 0 }, publishedAt: null, createdAt: new Date("2025-01-07T17:00:00.000Z") },
  // Archived
  { _id: ObjectId("507f1f77bcf86cd799441014"), title: "Giảm cân khoa học", content: "Bí quyết giảm cân...", authorId: ObjectId("507f1f77bcf86cd79943900f"), authorName: "Mai Thanh", status: "archived", stats: { views: 310, likes: 22, comments: 2 }, publishedAt: new Date("2024-06-28T17:00:00.000Z"), createdAt: new Date("2024-06-26T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441015"), title: "Game offline 2025", content: "Top game hay...", authorId: ObjectId("507f1f77bcf86cd799439009"), authorName: "Vũ Trọng", status: "archived", stats: { views: 380, likes: 28, comments: 2 }, publishedAt: new Date("2024-07-18T17:00:00.000Z"), createdAt: new Date("2024-07-16T17:00:00.000Z") },
  { _id: ObjectId("507f1f77bcf86cd799441016"), title: "Lịch sử Việt Nam", content: "Lịch sử qua các triều đại...", authorId: ObjectId("507f1f77bcf86cd799439003"), authorName: "Nguyễn Văn An", status: "archived", stats: { views: 275, likes: 27, comments: 1 }, publishedAt: new Date("2024-03-20T17:00:00.000Z"), createdAt: new Date("2024-03-18T17:00:00.000Z") }
]);
print(">> Đã insert 22 posts (16 published + 3 draft + 3 archived).");

// COMMENTS (20)
db.comments.insertMany([
  { _id: ObjectId("69ef2e4fe053db217c1aa8f4"), postId: ObjectId("507f1f77bcf86cd799441001"), userId: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", content: "Bài hay quá anh ơi!", parentCommentId: null, status: "visible", createdAt: new Date("2024-08-19T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8f5"), postId: ObjectId("507f1f77bcf86cd799441001"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", content: "Cảm ơn em!", parentCommentId: null, status: "visible", createdAt: new Date("2024-08-20T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8f6"), postId: ObjectId("507f1f77bcf86cd799441002"), userId: ObjectId("507f1f77bcf86cd79943900a"), username: "buithanh", content: "Đói bụng quá 😭", parentCommentId: null, status: "visible", createdAt: new Date("2024-08-29T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8f7"), postId: ObjectId("507f1f77bcf86cd799441002"), userId: ObjectId("507f1f77bcf86cd799439004"), username: "tranthib", content: "Haha cảm ơn bạn!", parentCommentId: null, status: "visible", createdAt: new Date("2024-08-30T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8f8"), postId: ObjectId("507f1f77bcf86cd799441003"), userId: ObjectId("507f1f77bcf86cd799439004"), username: "tranthib", content: "Đà Lạt tuyệt vời!", parentCommentId: null, status: "visible", createdAt: new Date("2024-09-08T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8f9"), postId: ObjectId("507f1f77bcf86cd799441004"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", content: "AI đang hot quá!", parentCommentId: null, status: "visible", createdAt: new Date("2024-09-18T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8fa"), postId: ObjectId("507f1f77bcf86cd799441005"), userId: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", content: "Phương pháp shadowing hay", parentCommentId: null, status: "visible", createdAt: new Date("2024-10-13T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8fb"), postId: ObjectId("507f1f77bcf86cd799441006"), userId: ObjectId("507f1f77bcf86cd79943900d"), username: "truongan", content: "Nguyên tắc 3 rất hữu ích", parentCommentId: null, status: "visible", createdAt: new Date("2024-09-28T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8fc"), postId: ObjectId("507f1f77bcf86cd799441007"), userId: ObjectId("507f1f77bcf86cd799439009"), username: "vutrong", content: "Camera 200MP khủng quá!", parentCommentId: null, status: "visible", createdAt: new Date("2024-10-08T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8fd"), postId: ObjectId("507f1f77bcf86cd799441008"), userId: ObjectId("507f1f77bcf86cd799439004"), username: "tranthib", content: "Mình cũng muốn đi", parentCommentId: null, status: "visible", createdAt: new Date("2024-10-23T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8fe"), postId: ObjectId("507f1f77bcf86cd799441009"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", content: "Astro là tương lai", parentCommentId: null, status: "visible", createdAt: new Date("2024-11-12T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa8ff"), postId: ObjectId("507f1f77bcf86cd79944100a"), userId: ObjectId("507f1f77bcf86cd79943900a"), username: "buithanh", content: "Thử công thức rồi, tuyệt!", parentCommentId: null, status: "visible", createdAt: new Date("2024-11-02T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa900"), postId: ObjectId("507f1f77bcf86cd79944100b"), userId: ObjectId("507f1f77bcf86cd79943900c"), username: "lethu", content: "Atomic Habits đúng hay", parentCommentId: null, status: "visible", createdAt: new Date("2024-11-27T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa901"), postId: ObjectId("507f1f77bcf86cd79944100c"), userId: ObjectId("507f1f77bcf86cd799439008"), username: "hoangvanf", content: "Chi phí sạc tháng bao nhiêu?", parentCommentId: null, status: "visible", createdAt: new Date("2024-12-27T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa902"), postId: ObjectId("507f1f77bcf86cd79944100d"), userId: ObjectId("507f1f77bcf86cd79943900a"), username: "buithanh", content: "Email chuyên nghiệp quan trọng", parentCommentId: null, status: "visible", createdAt: new Date("2024-12-02T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa903"), postId: ObjectId("507f1f77bcf86cd79944100e"), userId: ObjectId("507f1f77bcf86cd799439007"), username: "unknown", content: "Hyaluronic Acid must-have", parentCommentId: null, status: "visible", createdAt: new Date("2024-12-12T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa904"), postId: ObjectId("507f1f77bcf86cd79944100f"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", content: "Cân nhắc chuyển freelance", parentCommentId: null, status: "visible", createdAt: new Date("2024-12-22T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa905"), postId: ObjectId("507f1f77bcf86cd799441010"), userId: ObjectId("507f1f77bcf86cd799439004"), username: "tranthib", content: "Sapa tuyệt vời lắm!", parentCommentId: null, status: "visible", createdAt: new Date("2025-01-01T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa906"), postId: ObjectId("507f1f77bcf86cd799441001"), userId: ObjectId("507f1f77bcf86cd799439016"), username: "spam_user", content: "MUA HÀNG GIÁ RẺ NGAY", parentCommentId: null, status: "hidden", createdAt: new Date("2025-01-04T17:00:00.000Z") },
  { _id: ObjectId("69f026cb71a7ec741a814916"), postId: ObjectId("507f1f77bcf86cd799441005"), userId: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", content: ".", parentCommentId: null, status: "visible", createdAt: new Date("2026-04-28T03:17:31.611Z"), updatedAt: new Date("2026-04-28T03:17:31.611Z") }
]);
print(">> Đã insert 20 comments.");

// LIKES (8)
db.likes.insertMany([
  { _id: ObjectId("69ef2e4fe053db217c1aa907"), userId: ObjectId("507f1f77bcf86cd79943900a"), postId: ObjectId("507f1f77bcf86cd799441001"), createdAt: new Date("2024-08-19T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa908"), userId: ObjectId("507f1f77bcf86cd79943900b"), postId: ObjectId("507f1f77bcf86cd799441001"), createdAt: new Date("2024-08-20T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa909"), userId: ObjectId("507f1f77bcf86cd79943900c"), postId: ObjectId("507f1f77bcf86cd799441002"), createdAt: new Date("2024-08-29T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa90a"), userId: ObjectId("507f1f77bcf86cd79943900d"), postId: ObjectId("507f1f77bcf86cd799441003"), createdAt: new Date("2024-09-08T17:00:00.000Z") },
  { _id: ObjectId("69f0265e71a7ec741a81490b"), userId: ObjectId("507f1f77bcf86cd799439003"), postId: ObjectId("507f1f77bcf86cd79944100f"), createdAt: new Date("2026-04-28T03:15:42.909Z") },
  { _id: ObjectId("69f0267471a7ec741a81490e"), userId: ObjectId("507f1f77bcf86cd799439003"), postId: ObjectId("507f1f77bcf86cd799441010"), createdAt: new Date("2026-04-28T03:16:04.417Z") },
  { _id: ObjectId("69f0269e71a7ec741a814911"), userId: ObjectId("507f1f77bcf86cd799439003"), postId: ObjectId("507f1f77bcf86cd799441001"), createdAt: new Date("2026-04-28T03:16:46.338Z") },
  { _id: ObjectId("69f026c871a7ec741a814913"), userId: ObjectId("507f1f77bcf86cd79943900b"), postId: ObjectId("507f1f77bcf86cd799441005"), createdAt: new Date("2026-04-28T03:17:28.276Z") }
]);
print(">> Đã insert 8 likes.");

// BOOKMARKS (3)
db.bookmarks.insertMany([
  { _id: ObjectId("69ef2e4fe053db217c1aa90b"), userId: ObjectId("507f1f77bcf86cd79943900a"), postId: ObjectId("507f1f77bcf86cd799441001"), note: "Học MongoDB", createdAt: new Date("2024-08-19T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa90c"), userId: ObjectId("507f1f77bcf86cd79943900b"), postId: ObjectId("507f1f77bcf86cd799441001"), note: "Xem lại", createdAt: new Date("2024-08-22T17:00:00.000Z") },
  { _id: ObjectId("69f0265771a7ec741a81490a"), userId: ObjectId("507f1f77bcf86cd799439003"), postId: ObjectId("507f1f77bcf86cd799441010"), note: "", createdAt: new Date("2026-04-28T03:15:35.707Z") }
]);
print(">> Đã insert 3 bookmarks.");

// NOTIFICATIONS (6)
db.notifications.insertMany([
  { _id: ObjectId("69ef2e4fe053db217c1aa90d"), userId: ObjectId("507f1f77bcf86cd799439003"), type: "like", message: "dangminh thích bài của bạn", isRead: true, createdAt: new Date("2024-08-19T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa90e"), userId: ObjectId("507f1f77bcf86cd799439004"), type: "comment", message: "buithanh bình luận", isRead: false, createdAt: new Date("2024-08-29T17:00:00.000Z") },
  { _id: ObjectId("69f0265e71a7ec741a81490c"), userId: ObjectId("507f1f77bcf86cd799439013"), type: "like", message: "nguyenvana đã thích bài 'Cuộc sống freelancer'", isRead: false, createdAt: new Date("2026-04-28T03:15:42.935Z") },
  { _id: ObjectId("69f0267471a7ec741a81490f"), userId: ObjectId("507f1f77bcf86cd799439005"), type: "like", message: "nguyenvana đã thích bài 'Khám phá Sapa'", isRead: false, createdAt: new Date("2026-04-28T03:16:04.425Z") },
  { _id: ObjectId("69f026c871a7ec741a814913"), userId: ObjectId("507f1f77bcf86cd79943900c"), type: "like", message: "dangminh đã thích bài 'Học tiếng Anh'", isRead: true, createdAt: new Date("2026-04-28T03:17:28.279Z") },
  { _id: ObjectId("69f026cb71a7ec741a814917"), userId: ObjectId("507f1f77bcf86cd79943900c"), type: "comment", message: "dangminh đã bình luận bài 'Học tiếng Anh'", isRead: true, createdAt: new Date("2026-04-28T03:17:31.616Z") }
]);
print(">> Đã insert 6 notifications.");

// REPORTS (2)
db.reports.insertMany([
  { _id: ObjectId("69ef2e4fe053db217c1aa90f"), reporterId: ObjectId("507f1f77bcf86cd79943900a"), targetType: "comment", targetId: ObjectId("507f1f77bcf86cd799442001"), reason: "spam", description: "Spam quảng cáo", status: "resolved", createdAt: new Date("2025-01-09T17:00:00.000Z") },
  { _id: ObjectId("69ef2e4fe053db217c1aa910"), reporterId: ObjectId("507f1f77bcf86cd79943900d"), targetType: "user", targetId: ObjectId("507f1f77bcf86cd799439016"), reason: "spam", description: "Tài khoản spam", status: "resolved", createdAt: new Date("2025-01-10T17:00:00.000Z") }
]);
print(">> Đã insert 2 reports.");

// ACTIVITY LOGS (5)
db.activityLogs.insertMany([
  { _id: ObjectId("69f0265e71a7ec741a81490d"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", action: "post_liked", targetType: "post", targetId: ObjectId("507f1f77bcf86cd79944100f"), createdAt: new Date("2026-04-28T03:15:42.937Z") },
  { _id: ObjectId("69f0267471a7ec741a814910"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", action: "post_liked", targetType: "post", targetId: ObjectId("507f1f77bcf86cd799441010"), createdAt: new Date("2026-04-28T03:16:04.426Z") },
  { _id: ObjectId("69f0269e71a7ec741a814912"), userId: ObjectId("507f1f77bcf86cd799439003"), username: "nguyenvana", action: "post_liked", targetType: "post", targetId: ObjectId("507f1f77bcf86cd799441001"), createdAt: new Date("2026-04-28T03:16:46.343Z") },
  { _id: ObjectId("69f026c871a7ec741a814915"), userId: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", action: "post_liked", targetType: "post", targetId: ObjectId("507f1f77bcf86cd799441005"), createdAt: new Date("2026-04-28T03:17:28.279Z") },
  { _id: ObjectId("69f026cb71a7ec741a814918"), userId: ObjectId("507f1f77bcf86cd79943900b"), username: "dangminh", action: "comment_added", targetType: "comment", targetId: ObjectId("69f026cb71a7ec741a814916"), createdAt: new Date("2026-04-28T03:17:31.617Z") }
]);
print(">> Đã insert 5 activity logs.");
print(">> HOÀN TẤT! Database blogManagementDB đã khởi tạo");
print(">> 9 collections | 22 users | 9 categories | 22 posts");
print(">> 20 comments | 8 likes | 3 bookmarks | 6 notifications");
print(">> 2 reports | 5 activity logs");

