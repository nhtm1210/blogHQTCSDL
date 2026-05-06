//  ReportsList.jsx - Admin xem & xử lý báo cáo

import { Flag } from "lucide-react";
import { StatusBadge, fmtDate } from "./shared.jsx";

export default function ReportsList({ reports, userById, onResolve }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Báo cáo vi phạm</h2>
      <div className="space-y-2">
        {reports.map(r => {
          const reporter = userById(r.reporterId);
          return (
            <div key={r._id} className="bg-white border border-stone-200 rounded p-4 font-sans text-sm">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Flag size={14} className="text-rose-700" />
                  <span className="font-semibold">[{r.targetType}]</span>
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-stone-500">Lý do: {r.reason}</span>
                </div>
                <span className="text-xs text-stone-500">{fmtDate(r.createdAt)}</span>
              </div>
              <p className="mb-2">{r.description}</p>
              <p className="text-xs text-stone-500 mb-3">
                Người báo cáo: <strong>{reporter?.username || "?"}</strong>
              </p>
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onResolve(r._id, "resolved")}
                    className="text-xs bg-emerald-700 text-white px-3 py-1.5 rounded"
                  >
                    Xử lý
                  </button>
                  <button
                    onClick={() => onResolve(r._id, "dismissed")}
                    className="text-xs bg-stone-300 px-3 py-1.5 rounded"
                  >
                    Bác bỏ
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="text-center py-8 text-stone-500 font-sans">Không có báo cáo.</div>
        )}
      </div>
    </div>
  );
}
