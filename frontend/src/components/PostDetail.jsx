// ============================================================================
//  PostDetail.jsx - Chi tiết bài viết + comments + actions
// ============================================================================

import { useState } from "react";
import { X, Trash2, Heart, Bookmark } from "lucide-react";
import { StatusBadge, fmtDate } from "./shared.jsx";

export default function PostDetail({
  post, author, comments, userById, currentUser,
  isAdmin, isBanned, isBookmarked,
  onClose, onLike, onComment, onBookmark, onDelete, onChangeStatus
}) {
  const [commentText, setCommentText] = useState("");
  if (!post) return null;

  const isOwner = post.authorId === currentUser._id;
  const canDelete = isAdmin || isOwner;
  const hasLiked = (post.likedBy || []).some(id => String(id) === String(currentUser._id));

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText("");
  };

  return (
    <article className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      {/* Action bar */}
      <div className="flex items-center justify-between bg-stone-100 px-4 py-2">
        <button
          onClick={onClose}
          className="text-sm font-sans text-stone-700 hover:text-stone-900 flex items-center gap-1"
        >
          <X size={14} /> Đóng
        </button>
        <div className="flex gap-2">
          {isAdmin && (
            <select
              onChange={e => onChangeStatus(e.target.value)}
              value={post.status}
              className="text-xs font-sans bg-white border border-stone-300 rounded px-2 py-1"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded font-sans hover:bg-red-100 flex items-center gap-1"
            >
              <Trash2 size={12} /> {isAdmin && !isOwner ? "Xóa (Admin)" : "Xóa"}
            </button>
          )}
        </div>
      </div>

      {post.thumbnail && <img src={post.thumbnail} className="w-full h-64 object-cover" alt="" />}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 font-sans">
          <StatusBadge status={post.status} />
          <span className="text-xs text-stone-500">{post.category}</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-2 mb-6 font-sans text-sm">
          {author?.avatar && <img src={author.avatar} className="w-8 h-8 rounded-full" alt="" />}
          <span>
            <strong>{author?.fullName || post.authorName}</strong> · {fmtDate(post.publishedAt)}
          </span>
        </div>
        <p className="text-stone-800 leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-3 pb-4 border-b border-stone-200 font-sans">
          <button
            onClick={onLike}
            disabled={hasLiked || isBanned || post.status !== "published"}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition ${
              hasLiked ? "bg-rose-100 text-rose-700" : "bg-stone-100 hover:bg-stone-200 disabled:opacity-50"
            }`}
          >
            <Heart size={14} className={hasLiked ? "fill-rose-700" : ""} /> {post.stats?.likes || 0}
          </button>
          <button
            onClick={onBookmark}
            disabled={isBanned}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
              isBookmarked ? "bg-amber-100 text-amber-800" : "bg-stone-100 hover:bg-stone-200"
            } disabled:opacity-50`}
          >
            <Bookmark size={14} className={isBookmarked ? "fill-amber-800" : ""} /> {isBookmarked ? "Đã lưu" : "Lưu"}
          </button>
          <span className="text-sm text-stone-500 ml-auto">
            👁 {post.stats?.views || 0} · 💬 {post.stats?.comments || 0}
          </span>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h3 className="font-bold mb-3">
            Bình luận ({comments.filter(c => c.status === "visible").length})
          </h3>

          {post.status === "published" && !isBanned && (
            <div className="mb-4 flex gap-2 font-sans">
              {currentUser.avatar && <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt="" />}
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Viết bình luận..."
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm outline-none focus:border-stone-900"
                />
                <button
                  onClick={handleSubmit}
                  className="mt-2 bg-stone-900 text-stone-50 px-3 py-1.5 rounded text-sm"
                >
                  Gửi
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3 font-sans">
            {comments.map(c => {
              const u = userById(c.userId);
              return (
                <div key={c._id} className={`flex gap-2 ${c.parentCommentId ? "ml-10" : ""}`}>
                  {u?.avatar && <img src={u.avatar} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />}
                  <div className={`flex-1 p-3 rounded ${
                    c.status === "hidden" ? "bg-red-50 border border-red-200" : "bg-stone-50"
                  }`}>
                    <div className="flex items-center gap-2 mb-1 text-xs">
                      <strong>{u?.fullName || c.username}</strong>
                      <span className="text-stone-500">@{c.username}</span>
                      {c.status === "hidden" && <StatusBadge status="hidden" />}
                      <span className="text-stone-400 ml-auto">{fmtDate(c.createdAt)}</span>
                    </div>
                    <p className={`text-sm ${c.status === "hidden" ? "italic text-stone-500" : ""}`}>
                      {c.content}
                    </p>
                  </div>
                </div>
              );
            })}
            {comments.length === 0 && (
              <p className="text-sm text-stone-500 text-center py-4">Chưa có bình luận.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
