//  ActivityLogs.jsx - Audit log của hệ thống

import { Activity } from "lucide-react";
import { fmtDate } from "./shared.jsx";

export default function ActivityLogs({ logs }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Activity Logs <span className="text-sm font-normal text-stone-500">(collection: activityLogs)</span>
      </h2>
      <div className="bg-white border border-stone-200 rounded overflow-hidden font-sans text-sm">
        {logs.map(log => (
          <div
            key={log._id}
            className="px-4 py-2 border-b border-stone-100 flex items-center gap-3 text-xs flex-wrap"
          >
            <Activity size={12} className="text-stone-500" />
            <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-700">
              {log.action}
            </span>
            <span className="font-semibold">{log.username}</span>
            {log.metadata?.title && (
              <span className="text-stone-500 italic">→ "{log.metadata.title}"</span>
            )}
            <span className="ml-auto text-stone-400">{fmtDate(log.createdAt)}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8 text-stone-500">Không có log.</div>
        )}
      </div>
    </div>
  );
}
