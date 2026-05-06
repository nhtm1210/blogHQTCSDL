//  App.jsx - Component gốc, orchestrate state và actions

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Edit3, Bookmark, Bell, Users, Flag, Activity, Crown, RefreshCw
} from "lucide-react";

// Import APIs (mỗi collection có endpoints riêng)
import {
  authApi, usersApi, postsApi, commentsApi, likesApi,
  bookmarksApi, notificationsApi, reportsApi, adminApi
} from "./api";

// Import components (mỗi tab/feature có file riêng)
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PostsList from "./components/PostsList.jsx";
import PostDetail from "./components/PostDetail.jsx";
import MyPosts from "./components/MyPosts.jsx";
import BookmarksList from "./components/BookmarksList.jsx";
import NotificationsList from "./components/NotificationsList.jsx";
import UsersManagement from "./components/UsersManagement.jsx";
import ReportsList from "./components/ReportsList.jsx";
import ActivityLogs from "./components/ActivityLogs.jsx";
import StatsView from "./components/StatsView.jsx";
import CreatePostModal from "./components/CreatePostModal.jsx";
import LoginPage from "./components/LoginPage.jsx";

export default function App() {
  // STATE: dữ liệu lấy từ MongoDB qua API
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState(null);

  //  STATE: đăng nhập
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("blogUser")) || null; }
    catch { return null; }
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // STATE UI
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  const currentUser = users.find(u => u._id === currentUserId) || loggedInUser;
  const isAdmin = currentUser?.role === "admin";
  const isBanned = currentUser?.status === "banned";

  //  FETCH DATA

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      const [usersData, postsData, statsData, logsData] = await Promise.all([
        usersApi.list(),
        postsApi.list(),
        adminApi.stats(),
        adminApi.activityLogs()
      ]);
      setUsers(usersData);
      setPosts(postsData);
      setStats(statsData);
      setActivityLogs(logsData);
    } catch (err) {
      setConnectionError(`Không kết nối được API. Đảm bảo backend đang chạy ở port 4000.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, []); // eslint-disable-line

  // Refresh user-specific data khi đổi user
  useEffect(() => {
    if (!currentUserId) return;
    Promise.all([
      bookmarksApi.byUser(currentUserId),
      notificationsApi.byUser(currentUserId),
      reportsApi.list()
    ]).then(([bm, n, r]) => {
      setBookmarks(bm);
      setNotifications(n);
      setReports(r);
    }).catch(() => {});
  }, [currentUserId]);

  // Refresh comments khi chọn post
  useEffect(() => {
    if (!selectedPostId) { setComments([]); return; }
    commentsApi.byPost(selectedPostId).then(setComments).catch(() => {});
  }, [selectedPostId]);

  //  ACTIONS — gọi tới API

  const handleLike = async (postId) => {
    if (isBanned) return alert("Tài khoản đã bị khóa!");
    const res = await likesApi.like(postId, { userId: currentUserId });
    if (res.error) return alert(res.error);
    fetchAllData();
  };

  const handleAddComment = async (postId, content) => {
    if (isBanned) return alert("Tài khoản đã bị khóa!");
    const res = await commentsApi.create({ postId, userId: currentUserId, content });
    if (res.error) return alert(res.error);
    commentsApi.byPost(postId).then(setComments);
    fetchAllData();
  };

  const handleToggleBookmark = async (postId) => {
    if (isBanned) return alert("Tài khoản đã bị khóa!");
    await bookmarksApi.toggle({ userId: currentUserId, postId });
    bookmarksApi.byUser(currentUserId).then(setBookmarks);
  };

  const handleCreatePost = async (postData) => {
    const res = await postsApi.create({ ...postData, authorId: currentUserId });
    if (res.error) return alert(res.error);
    setShowCreatePost(false);
    fetchAllData();
  };

  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!confirm(`Xóa bài "${post.title}"?`)) return;
    const res = await postsApi.delete(postId, { userId: currentUserId });
    if (res.error) return alert(res.error);
    setSelectedPostId(null);
    fetchAllData();
  };

  const handleChangeStatus = async (postId, status) => {
    await postsApi.changeStatus(postId, {
      status, adminId: currentUserId, adminUsername: currentUser.username
    });
    fetchAllData();
  };

  const handleDeleteUser = async (userId) => {
    const u = users.find(x => x._id === userId);
    if (!confirm(`Xóa user "${u.username}"? Toàn bộ data sẽ bị xóa cascade.`)) return;
    const res = await usersApi.delete(userId, {
      adminId: currentUserId, adminUsername: currentUser.username
    });
    if (res.error) return alert(res.error);
    fetchAllData();
  };

  const handleToggleBan = async (userId) => {
    const res = await usersApi.toggleBan(userId, {
      adminId: currentUserId, adminUsername: currentUser.username
    });
    if (res.error) return alert(res.error);
    fetchAllData();
  };

  const handleResolveReport = async (reportId, status) => {
    await reportsApi.resolve(reportId, { status, adminId: currentUserId });
    reportsApi.list().then(setReports);
  };

  const handleMarkNotifRead = async (notifId) => {
    await notificationsApi.markRead(notifId);
    notificationsApi.byUser(currentUserId).then(setNotifications);
  };

  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.login({ username, password });
      if (res.error) {
        setLoginError(res.error);
      } else {
        setLoggedInUser(res.user);
        setCurrentUserId(res.user._id);
        sessionStorage.setItem("blogUser", JSON.stringify(res.user));
        fetchAllData();
      }
    } catch {
      setLoginError("Không kết nối được backend. Đảm bảo server đang chạy.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentUserId(null);
    setSelectedPostId(null);
    setActiveTab("posts");
    sessionStorage.removeItem("blogUser");
  };

  const handleSwitchUser = (userId) => {
    setCurrentUserId(userId);
    setSelectedPostId(null);
    setActiveTab("posts");
  };

  //  DERIVED DATA

  const userById = (id) => users.find(u => u._id === id);

  const visiblePosts = posts.filter(p => {
    if (!isAdmin && p.status !== "published") return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const myPosts = posts.filter(p => p.authorId === currentUserId);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingReports = reports.filter(r => r.status === "pending").length;

  const tabs = [
    { id: "posts", label: "Bài viết", icon: FileText },
    { id: "myPosts", label: "Bài của tôi", icon: Edit3 },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "notifications", label: "Thông báo", icon: Bell, badge: unreadCount },
    ...(isAdmin ? [
      { id: "users", label: "Quản lý Users", icon: Users },
      { id: "reports", label: "Báo cáo", icon: Flag, badge: pendingReports },
      { id: "logs", label: "Activity Logs", icon: Activity }
    ] : []),
    { id: "stats", label: "Thống kê", icon: Crown }
  ];

  //  LOADING / ERROR STATES

  // Chưa đăng nhập → hiển thị trang login
  if (!loggedInUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white border-2 border-red-300 rounded-lg p-8 max-w-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-3">⚠ Không kết nối được Backend</h1>
          <p className="text-stone-700 mb-4 text-sm font-sans">{connectionError}</p>
          <div className="bg-stone-900 text-stone-100 p-3 rounded text-xs font-mono space-y-1">
            <div># Terminal 1 - Backend</div>
            <div>cd backend && npm install && node server.js</div>
            <div className="mt-2"># Terminal 2 - Frontend</div>
            <div>cd frontend && npm install && npm run dev</div>
          </div>
          <p className="text-xs text-stone-500 mt-4 font-sans">
            Đảm bảo MongoDB đang chạy ở localhost:27017 và đã chạy{" "}
            <code className="bg-stone-100 px-1 rounded">mongosh &lt; blog_system.js</code>
          </p>
          <button
            onClick={fetchAllData}
            className="mt-4 bg-stone-900 text-stone-50 px-4 py-2 rounded text-sm font-sans flex items-center gap-2"
          >
            <RefreshCw size={14} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-stone-400 mx-auto mb-3" />
          <p className="text-stone-600 font-sans">Đang tải dữ liệu từ MongoDB...</p>
        </div>
      </div>
    );
  }

  //  RENDER

  return (
    <div className="min-h-screen text-stone-900">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onRefresh={fetchAllData}
        isAdmin={isAdmin}
        isBanned={isBanned}
      />

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        <Sidebar
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={(id) => { setActiveTab(id); setSelectedPostId(null); }}
          stats={stats}
        />

        <main className="col-span-12 md:col-span-9">
          {/* POSTS LIST */}
          {activeTab === "posts" && !selectedPostId && (
            <PostsList
              posts={visiblePosts}
              userById={userById}
              isAdmin={isAdmin}
              isBanned={isBanned}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelect={setSelectedPostId}
              onCreate={() => setShowCreatePost(true)}
            />
          )}

          {/* POST DETAIL */}
          {selectedPostId && (
            <PostDetail
              post={posts.find(p => p._id === selectedPostId)}
              author={userById(posts.find(p => p._id === selectedPostId)?.authorId)}
              comments={comments}
              userById={userById}
              currentUser={currentUser}
              isAdmin={isAdmin}
              isBanned={isBanned}
              isBookmarked={bookmarks.some(b => b.postId === selectedPostId)}
              onClose={() => setSelectedPostId(null)}
              onLike={() => handleLike(selectedPostId)}
              onComment={(content) => handleAddComment(selectedPostId, content)}
              onBookmark={() => handleToggleBookmark(selectedPostId)}
              onDelete={() => handleDeletePost(selectedPostId)}
              onChangeStatus={(s) => handleChangeStatus(selectedPostId, s)}
            />
          )}

          {/* MY POSTS */}
          {activeTab === "myPosts" && (
            <MyPosts
              posts={myPosts}
              currentUser={currentUser}
              onSelect={setSelectedPostId}
              onDelete={handleDeletePost}
            />
          )}

          {/* BOOKMARKS */}
          {activeTab === "bookmarks" && (
            <BookmarksList
              bookmarks={bookmarks}
              posts={posts}
              onSelect={setSelectedPostId}
            />
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <NotificationsList
              notifications={notifications}
              onMarkRead={handleMarkNotifRead}
            />
          )}

          {/* USERS MANAGEMENT (admin) */}
          {activeTab === "users" && isAdmin && (
            <UsersManagement
              users={users}
              onToggleBan={handleToggleBan}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* REPORTS (admin) */}
          {activeTab === "reports" && isAdmin && (
            <ReportsList
              reports={reports}
              userById={userById}
              onResolve={handleResolveReport}
            />
          )}

          {/* ACTIVITY LOGS (admin) */}
          {activeTab === "logs" && isAdmin && (
            <ActivityLogs logs={activityLogs} />
          )}

          {/* STATS */}
          {activeTab === "stats" && (
            <StatsView
              stats={stats}
              onSelectPost={(id) => { setActiveTab("posts"); setSelectedPostId(id); }}
            />
          )}
        </main>
      </div>

      {/* CREATE POST MODAL */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
}
