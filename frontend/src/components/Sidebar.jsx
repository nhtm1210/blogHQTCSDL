// ============================================================================
//  Sidebar.jsx - Sidebar điều hướng + DB stats
// ============================================================================

import { ChevronRight } from "lucide-react";

export default function Sidebar({ tabs, activeTab, onChangeTab, stats }) {
  return (
    <aside className="col-span-12 md:col-span-3">
      <nav className="bg-white border border-stone-200 rounded-lg overflow-hidden sticky top-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChangeTab(t.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-sans border-b border-stone-100 last:border-b-0 transition ${
              activeTab === t.id ? "bg-stone-900 text-stone-50" : "text-stone-700 hover:bg-stone-50"
            }`}
          >
            <t.icon size={16} />
            <span className="flex-1 text-left">{t.label}</span>
            {t.badge > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-500 text-white">{t.badge}</span>
            )}
            <ChevronRight size={12} className="opacity-40" />
          </button>
        ))}
      </nav>

      {stats && (
        <div className="bg-stone-900 text-stone-50 rounded-lg p-4 mt-4 font-sans text-xs">
          <div className="text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>MongoDB Live</span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Users</span><strong>{stats.counts.totalUsers}</strong></div>
            <div className="flex justify-between"><span>Posts</span><strong>{stats.counts.totalPosts}</strong></div>
            <div className="flex justify-between"><span>Comments</span><strong>{stats.counts.totalComments}</strong></div>
            <div className="flex justify-between"><span>Likes</span><strong>{stats.counts.totalLikes}</strong></div>
            <div className="flex justify-between"><span>Bookmarks</span><strong>{stats.counts.totalBookmarks}</strong></div>
          </div>
        </div>
      )}
    </aside>
  );
}
