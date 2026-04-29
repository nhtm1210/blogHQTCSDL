// ============================================================================
//  BookmarksList.jsx - Hiển thị bookmarks của user
// ============================================================================

import { Bookmark } from "lucide-react";
import { fmtDate } from "./shared.jsx";

export default function BookmarksList({ bookmarks, posts, onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bookmarks của tôi</h2>
      <div className="space-y-2">
        {bookmarks.map(bm => {
          const post = posts.find(p => p._id === bm.postId);
          if (!post) return null;
          return (
            <div
              key={bm._id}
              onClick={() => onSelect(post._id)}
              className="bg-white border border-stone-200 rounded p-4 flex items-center gap-4 cursor-pointer hover:bg-stone-50"
            >
              <Bookmark size={20} className="text-rose-700 fill-rose-700" />
              <div className="flex-1">
                <h3 className="font-bold">{post.title}</h3>
                {bm.note && (
                  <p className="text-xs text-stone-500 font-sans italic mt-0.5">"{bm.note}"</p>
                )}
              </div>
              <span className="text-xs text-stone-500 font-sans">{fmtDate(bm.createdAt)}</span>
            </div>
          );
        })}
        {bookmarks.length === 0 && (
          <div className="text-center py-8 text-stone-500 font-sans">Chưa có bookmark nào.</div>
        )}
      </div>
    </div>
  );
}
