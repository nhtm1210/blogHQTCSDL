// ============================================================================
//  UsersManagement.jsx - Admin quản lý users (khóa, xóa cascade)
// ============================================================================

import { Trash2 } from "lucide-react";
import { StatusBadge, RoleBadge } from "./shared.jsx";

export default function UsersManagement({ users, onToggleBan, onDeleteUser }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead className="bg-stone-100 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-2">Người dùng</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Author</th>
              <th className="text-right px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-stone-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {u.avatar && <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />}
                    <div>
                      <div className="font-semibold">{u.fullName}</div>
                      <div className="text-xs text-stone-500">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3 text-xs">
                  {u.author?.isAuthor ? (
                    <div>
                      <div className="font-semibold">{u.author.totalPosts || 0} bài</div>
                      <div className="text-stone-500">
                        {u.author.totalLikes || 0} ♥ · {u.author.totalViews || 0} 👁
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== "admin" && (
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => onToggleBan(u._id)}
                        className={`text-xs px-2 py-1 rounded ${
                          u.status === "banned"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {u.status === "banned" ? "Mở khóa" : "Khóa"}
                      </button>
                      <button
                        onClick={() => onDeleteUser(u._id)}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        <Trash2 size={11} className="inline" /> Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
