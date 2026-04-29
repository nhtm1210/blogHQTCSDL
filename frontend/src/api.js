// ============================================================================
//  api.js - API client gọi tới backend
//  Backend chạy ở port 4000 → vite.config.js đã proxy /api → localhost:4000
// ============================================================================

const BASE = "/api";

const request = async (method, path, body) => {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  return res.json();
};

// === AUTH ===
export const authApi = {
  login: (body) => request("POST", "/auth/login", body)
};

// === USERS ===
export const usersApi = {
  list: () => request("GET", "/users"),
  get: (id) => request("GET", `/users/${id}`),
  delete: (id, body) => request("DELETE", `/users/${id}`, body),
  toggleBan: (id, body) => request("PATCH", `/users/${id}/ban`, body)
};

// === POSTS ===
export const postsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/posts${q ? "?" + q : ""}`);
  },
  get: (id) => request("GET", `/posts/${id}`),
  create: (body) => request("POST", "/posts", body),
  delete: (id, body) => request("DELETE", `/posts/${id}`, body),
  changeStatus: (id, body) => request("PATCH", `/posts/${id}/status`, body)
};

// === COMMENTS ===
export const commentsApi = {
  byPost: (postId) => request("GET", `/comments?postId=${postId}`),
  create: (body) => request("POST", "/comments", body),
  hide: (id) => request("PATCH", `/comments/${id}/hide`)
};

// === LIKES ===
export const likesApi = {
  like: (postId, body) => request("POST", `/posts/${postId}/like`, body),
  unlike: (postId, body) => request("DELETE", `/posts/${postId}/like`, body)
};

// === BOOKMARKS ===
export const bookmarksApi = {
  byUser: (userId) => request("GET", `/bookmarks?userId=${userId}`),
  toggle: (body) => request("POST", "/bookmarks", body)
};

// === NOTIFICATIONS ===
export const notificationsApi = {
  byUser: (userId) => request("GET", `/notifications?userId=${userId}`),
  markRead: (id) => request("PATCH", `/notifications/${id}/read`),
  readAll: (body) => request("PATCH", "/notifications/read-all", body)
};

// === REPORTS ===
export const reportsApi = {
  list: (status) => request("GET", `/reports${status ? "?status=" + status : ""}`),
  create: (body) => request("POST", "/reports", body),
  resolve: (id, body) => request("PATCH", `/reports/${id}`, body)
};

// === ADMIN ===
export const adminApi = {
  activityLogs: () => request("GET", "/activity-logs"),
  stats: () => request("GET", "/stats"),
  categories: () => request("GET", "/categories")
};
