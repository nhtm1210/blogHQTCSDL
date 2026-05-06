//  CreatePostModal.jsx - Modal đăng bài mới

import { useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  "Lập trình", "Du lịch", "Ẩm thực", "Công nghệ",
  "Tài chính", "Sức khỏe", "Giáo dục", "Giải trí", "Văn hóa"
];

export default function CreatePostModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Lập trình",
    tags: "",
    thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
    status: "draft"
  });

  const handleSubmit = () => {
    if (!form.title || !form.content) return alert("Vui lòng nhập tiêu đề và nội dung");
    onCreate({
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/70 flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Đăng bài mới
          </h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Tiêu đề bài viết"
            className="w-full p-2 border border-stone-300 rounded outline-none focus:border-stone-900"
          />
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Nội dung..."
            rows={6}
            className="w-full p-2 border border-stone-300 rounded outline-none focus:border-stone-900"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="p-2 border border-stone-300 rounded"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="p-2 border border-stone-300 rounded"
            >
              <option value="draft">Lưu nháp</option>
              <option value="published">Đăng ngay</option>
            </select>
          </div>
          <input
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (cách nhau bằng dấu phẩy)"
            className="w-full p-2 border border-stone-300 rounded outline-none focus:border-stone-900"
          />
          <input
            value={form.thumbnail}
            onChange={e => setForm({ ...form, thumbnail: e.target.value })}
            placeholder="URL ảnh thumbnail"
            className="w-full p-2 border border-stone-300 rounded outline-none focus:border-stone-900"
          />
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 bg-stone-100 rounded">Hủy</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-stone-900 text-stone-50 rounded">
              Đăng bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
