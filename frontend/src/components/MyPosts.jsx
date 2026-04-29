// ============================================================================
//  MyPosts.jsx - Bài viết của user hiện tại
// ============================================================================

import { Trash2 } from "lucide-react";
import { StatusBadge } from "./shared.jsx";

export default function MyPosts({ posts, currentUser, onSelect, onDelete }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bài viết của tôi</h2>

      {!currentUser.author?.isAuthor && posts.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4 font-sans text-sm">
          Bạn chưa đăng bài nào. Khi đăng bài đầu tiên, sub-document{" "}
          <code className="bg-amber-100 px-1">author</code> trong tài liệu user sẽ được tự động
          kích hoạt trong MongoDB.
        </div>
      )}

      <div className="space-y-2">
        {posts.map(post => (
          <div
            key={post._id}
            className="bg-white border border-stone-200 rounded p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={post.status} />
                <span className="text-xs text-stone-500 font-sans">{post.category}</span>
              </div>
              <h3 className="font-bold">{post.title}</h3>
              <div className="text-xs text-stone-500 font-sans mt-1">
                👁 {post.stats?.views || 0} · ♥ {post.stats?.likes || 0} · 💬 {post.stats?.comments || 0}
              </div>
            </div>
            <button
              onClick={() => onSelect(post._id)}
              className="text-xs bg-stone-100 px-3 py-1.5 rounded font-sans hover:bg-stone-200"
            >
              Xem
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded font-sans hover:bg-red-100 flex items-center gap-1"
            >
              <Trash2 size={12} /> Xóa
            </button>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-8 text-stone-500 font-sans">Chưa có bài nào.</div>
        )}
      </div>
    </div>
  );
}
