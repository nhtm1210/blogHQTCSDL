# BLOG MONGODB DEMO - Full-stack App

Hệ thống blog kết nối trực tiếp tới MongoDB với cấu trúc tách biệt rõ ràng.

## 📁 Cấu trúc thư mục

```
blog-app/
├── backend/                       # Node.js + Express + MongoDB driver
│   ├── package.json
│   ├── db.js                      # ⚙ Module kết nối MongoDB
│   ├── server.js                  # 🚀 Entry point, mount tất cả routes
│   └── routes/                    # Mỗi collection có 1 file routes
│       ├── users.js               # GET, DELETE, PATCH ban
│       ├── posts.js               # CRUD posts + đổi status
│       ├── comments.js            # CRUD comments
│       ├── likes.js               # Like / Unlike (mỗi like = +1 view)
│       ├── bookmarks.js           # Toggle bookmark
│       ├── notifications.js       # GET, mark as read
│       ├── reports.js             # CRUD reports
│       └── admin.js               # /activity-logs, /stats, /categories
│
└── frontend/                      # React + Vite + Tailwind
    ├── package.json
    ├── vite.config.js             # ⚙ Proxy /api → localhost:4000
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx               # 🚀 React entry
        ├── App.jsx                # 🎯 Component gốc, orchestrate state
        ├── api.js                 # 📡 API client (chia theo collection)
        ├── index.css              # Tailwind imports
        └── components/            # Mỗi feature = 1 file component
            ├── shared.jsx         # StatusBadge, RoleBadge, fmtDate
            ├── Header.jsx         # Header + user switcher
            ├── Sidebar.jsx        # Sidebar điều hướng + DB stats
            ├── PostsList.jsx      # Grid danh sách bài + filter
            ├── PostDetail.jsx     # Chi tiết bài + comments
            ├── MyPosts.jsx        # Bài của user hiện tại
            ├── BookmarksList.jsx  # Bookmarks
            ├── NotificationsList.jsx
            ├── UsersManagement.jsx  # Admin quản lý users
            ├── ReportsList.jsx    # Admin xử lý báo cáo
            ├── ActivityLogs.jsx   # Audit log
            ├── StatsView.jsx      # Thống kê + leaderboard
            └── CreatePostModal.jsx
```

## 🚀 Hướng dẫn chạy

### 1. Khởi tạo MongoDB
Đảm bảo MongoDB đang chạy ở `localhost:27017`, rồi chạy:
```bash
mongosh < blog_system.js
```

### 2. Chạy Backend

```bash
cd backend
npm install
node server.js
```

Bạn sẽ thấy:
```
✓ MongoDB connected: mongodb://localhost:27017/blogManagementDB
✓ Found 22 users in database
🚀 Backend API: http://localhost:4000/api
```

### 3. Chạy Frontend (terminal mới)

```bash
cd frontend
npm install
npm run dev
```

Mở **http://localhost:5173**

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy tất cả users |
| GET | `/api/users/:id` | Chi tiết user |
| PATCH | `/api/users/:id/ban` | Admin khóa/mở khóa |
| DELETE | `/api/users/:id` | Admin xóa user (cascade) |
| GET | `/api/posts?status=&search=` | Lấy posts có filter |
| GET | `/api/posts/:id` | Chi tiết post |
| POST | `/api/posts` | User đăng bài (auto-activate author) |
| PATCH | `/api/posts/:id/status` | Admin đổi status |
| DELETE | `/api/posts/:id` | Xóa bài (cascade) |
| GET | `/api/comments?postId=` | Comments của bài |
| POST | `/api/comments` | Tạo comment |
| POST | `/api/posts/:id/like` | Like (mỗi like = +1 view) |
| GET | `/api/bookmarks?userId=` | Bookmarks của user |
| POST | `/api/bookmarks` | Toggle bookmark |
| GET | `/api/notifications?userId=` | Thông báo |
| PATCH | `/api/notifications/:id/read` | Đánh dấu đã đọc |
| GET | `/api/reports` | Tất cả báo cáo |
| POST | `/api/reports` | Tạo báo cáo |
| PATCH | `/api/reports/:id` | Admin xử lý báo cáo |
| GET | `/api/activity-logs` | Audit logs |
| GET | `/api/stats` | Dashboard tổng hợp + top authors + trending |

## 🎯 Demo các nghiệp vụ

**Admin có thể:**
- Xem stats lượt like/view của từng blog
- Lọc bài theo 3 trạng thái (draft / published / archived)
- Xem comments của 1 bài
- Xem bài của 1 tác giả
- Đổi status của bài
- Xóa bài bất kỳ (cascade comments, likes, bookmarks)
- Khóa / xóa user (cascade hết data của user)
- Xử lý báo cáo
- Xem activity logs

**User có thể:**
- Chỉ xem bài đã published
- Like bài (mỗi like tự động +1 view)
- Comment vào bài published
- Bookmark bài để đọc sau
- Đăng bài mới (tự động kích hoạt sub-document `author`)
- Xóa bài của chính mình

**Tính năng mở rộng (MỚI):**
- Notifications (like / comment / follow / ban)
- Bookmarks với note
- Reports system
- Activity logs (audit)
- Top Authors leaderboard
- Trending posts (likes×3 + comments×5 + views)
- Search full-text

## 🐛 Debug

**"Không kết nối được API"** → Kiểm tra backend đã chạy chưa (`node server.js`)

**"Database trống"** → Chạy lại `mongosh < blog_system.js`

**Lỗi CORS** → Vite proxy đã handle, không cần cấu hình thêm

**Lỗi `Cannot find module 'express'`** → Chạy `npm install` trong thư mục `backend/`
