// ============================================================================
//  PostsList.jsx - Danh sách bài viết với filter + search
// ============================================================================

import { Plus, Search, Eye, Heart, MessageSquare } from "lucide-react";
import { StatusBadge } from "./shared.jsx";

export default function PostsList({
  posts, userById, isAdmin, isBanned,
  statusFilter, setStatusFilter, searchTerm, setSearchTerm,
  onSelect, onCreate
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">
          Bài viết{" "}
          {!isAdmin && <span className="text-stone-500 text-sm font-normal">(chỉ bài đã đăng)</span>}
        </h2>
        {!isAdmin && !isBanned && (
          <button
            onClick={onCreate}
            className="bg-rose-700 text-white px-4 py-2 rounded text-sm font-sans hover:bg-rose-800 transition flex items-center gap-2"
          >
            <Plus size={14} /> Đăng bài mới
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap font-sans text-sm">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded outline-none focus:border-stone-900"
          />
        </div>
        {isAdmin && ["all", "published", "draft", "archived"].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded ${
              statusFilter === s ? "bg-stone-900 text-stone-50" : "bg-white border border-stone-300 text-stone-700"
            }`}
          >
            {s === "all" ? "Tất cả" : s === "published" ? "Đã đăng" : s === "draft" ? "Nháp" : "Lưu trữ"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {posts.map(post => {
          const author = userById(post.authorId);
          return (
            <article
              key={post._id}
              onClick={() => onSelect(post._id)}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition group"
            >
              {post.thumbnail && (
                <div className="aspect-video bg-stone-100 overflow-hidden">
                  <img src={post.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 font-sans">
                  <StatusBadge status={post.status} />
                  <span className="text-xs text-stone-500">{post.category}</span>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-rose-700 transition">
                  {post.title}
                </h3>
                <p className="text-stone-600 text-sm mb-3 line-clamp-2 font-sans">
                  {post.content?.substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
                  <div className="flex items-center gap-2">
                    {author?.avatar && <img src={author.avatar} className="w-5 h-5 rounded-full" alt="" />}
                    <span>{author?.fullName || post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> {post.stats?.views || 0}</span>
                    <span className="flex items-center gap-1"><Heart size={12} /> {post.stats?.likes || 0}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.stats?.comments || 0}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {posts.length === 0 && (
          <div className="col-span-2 text-center py-12 text-stone-500 font-sans">
            Không có bài viết nào.
          </div>
        )}
      </div>
    </div>
  );
}
