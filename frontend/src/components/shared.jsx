//  shared.jsx - Components dùng chung và utilities

import { Crown } from "lucide-react";

export const StatusBadge = ({ status }) => {
  const config = {
    published: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Đã đăng" },
    draft: { bg: "bg-amber-100", text: "text-amber-800", label: "Bản nháp" },
    archived: { bg: "bg-stone-200", text: "text-stone-700", label: "Lưu trữ" },
    active: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Hoạt động" },
    banned: { bg: "bg-red-100", text: "text-red-800", label: "Đã khóa" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
    resolved: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Đã xử lý" },
    dismissed: { bg: "bg-stone-200", text: "text-stone-700", label: "Bác bỏ" },
    visible: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Hiển thị" },
    hidden: { bg: "bg-stone-200", text: "text-stone-700", label: "Đã ẩn" }
  };
  const c = config[status] || { bg: "bg-stone-100", text: "text-stone-700", label: status };
  return <span className={`${c.bg} ${c.text} text-xs font-medium px-2 py-0.5 rounded-full`}>{c.label}</span>;
};

export const RoleBadge = ({ role }) => role === "admin"
  ? <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-900 text-xs font-semibold px-2 py-0.5 rounded-full border border-rose-200">
      <Crown size={10} /> ADMIN
    </span>
  : <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded-full">USER</span>;

export const fmtDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";
