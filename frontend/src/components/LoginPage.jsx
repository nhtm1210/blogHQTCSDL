// ============================================================================
//  LoginPage.jsx - Trang đăng nhập
// ============================================================================

import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";

const DEMO_ACCOUNTS = [
  { username: "admin_master", passwordHash: "hash1", role: "admin" },
  { username: "mod_helper",   passwordHash: "hash2", role: "admin" },
  { username: "nguyenvana",   passwordHash: "hash3", role: "user" },
  { username: "tranthib",     passwordHash: "hash4", role: "user" },
  { username: "spam_user",    passwordHash: "hash22", role: "user (banned)" }
];

export default function LoginPage({ onLogin, error, loading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    onLogin(username.trim(), password.trim());
  };

  const fillDemo = (acc) => {
    setUsername(acc.username);
    setPassword(acc.passwordHash);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">

        {/* Form đăng nhập */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              BlogVN <span className="text-rose-600">·</span>
            </h1>
            <p className="text-stone-500 text-sm mt-1 font-sans">
              MongoDB Live Demo
            </p>
          </div>

          <h2 className="text-xl font-bold mb-6">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="username"
                autoFocus
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg outline-none focus:border-stone-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg outline-none focus:border-stone-900 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-stone-700 transition disabled:opacity-50"
            >
              <LogIn size={16} />
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-xs text-stone-400 mt-6 font-sans text-center">
            Mật khẩu lưu trong <code className="bg-stone-100 px-1 rounded">users.passwordHash</code> (MongoDB)
          </p>
        </div>

        {/* Bảng tài khoản demo */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h3 className="font-bold text-sm mb-1">Tài khoản demo</h3>
          <p className="text-xs text-stone-500 font-sans mb-4">
            Click để tự động điền vào form
          </p>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.username}
                onClick={() => fillDemo(acc)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition group"
              >
                <div className="flex items-center justify-between font-sans text-sm">
                  <div>
                    <span className="font-medium text-stone-800">{acc.username}</span>
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      acc.role === "admin"
                        ? "bg-rose-100 text-rose-800"
                        : acc.role.includes("banned")
                        ? "bg-red-100 text-red-800"
                        : "bg-stone-100 text-stone-700"
                    }`}>
                      {acc.role}
                    </span>
                  </div>
                  <code className="text-xs text-stone-400 group-hover:text-stone-600">
                    {acc.passwordHash}
                  </code>
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
