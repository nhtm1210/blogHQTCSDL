//  NotificationsList.jsx - Danh sách thông báo

import { Heart, MessageSquare, Bell } from "lucide-react";
import { fmtDate } from "./shared.jsx";

export default function NotificationsList({ notifications, onMarkRead }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thông báo</h2>
      <div className="space-y-2">
        {notifications.map(n => (
          <div
            key={n._id}
            onClick={() => onMarkRead(n._id)}
            className={`p-4 border rounded flex items-start gap-3 cursor-pointer ${
              n.isRead ? "bg-white border-stone-200" : "bg-rose-50 border-rose-200"
            }`}
          >
            <div className={`mt-0.5 p-2 rounded-full ${
              n.type === "like" ? "bg-rose-100 text-rose-700" :
              n.type === "comment" ? "bg-blue-100 text-blue-700" :
              "bg-stone-100 text-stone-700"
            }`}>
              {n.type === "like" ? <Heart size={14} /> :
                n.type === "comment" ? <MessageSquare size={14} /> :
                <Bell size={14} />}
            </div>
            <div className="flex-1">
              <p className="font-sans text-sm">{n.message}</p>
              <p className="text-xs text-stone-500 font-sans mt-1">{fmtDate(n.createdAt)}</p>
            </div>
            {!n.isRead && <div className="w-2 h-2 bg-rose-500 rounded-full"></div>}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-8 text-stone-500 font-sans">Không có thông báo.</div>
        )}
      </div>
    </div>
  );
}
