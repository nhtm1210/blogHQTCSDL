// ============================================================================
//  StatsView.jsx - Dashboard thống kê + bảng xếp hạng
// ============================================================================

import { FileText, Archive, Heart, Eye, Crown } from "lucide-react";

export default function StatsView({ stats, onSelectPost }) {
  if (!stats) return null;

  const cards = [
    { label: "Bài đã đăng", value: stats.counts.totalPublished, icon: FileText },
    { label: "Bài lưu trữ", value: stats.counts.totalArchived, icon: Archive },
    { label: "Tổng like", value: stats.counts.totalLikesSum, icon: Heart },
    { label: "Tổng view", value: stats.counts.totalViews, icon: Eye }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thống kê & Bảng xếp hạng</h2>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map(c => (
          <div key={c.label} className="bg-stone-900 text-stone-50 p-4 rounded">
            <c.icon size={20} className="text-rose-400 mb-2" />
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-xs text-stone-400 font-sans">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Authors */}
        <div className="bg-white border border-stone-200 rounded p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Crown size={16} className="text-amber-600" /> Top Authors
          </h3>
          <div className="space-y-2 font-sans text-sm">
            {stats.topAuthors.map((u, i) => (
              <div key={u._id} className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-stone-400">{i + 1}</span>
                {u.avatar && <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />}
                <div className="flex-1">
                  <div className="font-semibold">{u.fullName}</div>
                  <div className="text-xs text-stone-500">{u.author?.specialization}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-rose-700">{u.author?.totalLikes || 0} ♥</div>
                  <div className="text-stone-500">{u.author?.totalPosts || 0} bài</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="bg-white border border-stone-200 rounded p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            🔥 Trending Posts
            <span className="text-xs font-normal text-stone-500">
              (likes×3 + comments×5 + views)
            </span>
          </h3>
          <div className="space-y-2 font-sans text-sm">
            {stats.trendingPosts.map((p, i) => (
              <div
                key={p._id}
                onClick={() => onSelectPost(p._id)}
                className="flex items-center gap-3 cursor-pointer hover:bg-stone-50 p-2 rounded -mx-2"
              >
                <span className="w-6 text-center font-bold text-rose-700">{i + 1}</span>
                <div className="flex-1">
                  <div className="font-semibold leading-tight">{p.title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">Hot score: {p.hotScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
