//  Header.jsx - Header với thông tin user đăng nhập và nút logout

import { LogOut, RefreshCw, Shield, Ban } from "lucide-react";
import { RoleBadge } from "./shared.jsx";

export default function Header({ currentUser, onLogout, onRefresh, isAdmin, isBanned }) {
  return (
    <>
      <header className="bg-stone-900 text-stone-50 border-b-4 border-rose-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              BlogVN <span className="text-rose-400">·</span>{" "}
              <span className="text-base font-normal text-stone-400">MongoDB Live</span>
            </h1>
            <p className="text-stone-400 text-xs mt-1 font-sans">
              Kết nối: <code className="bg-stone-800 px-1 rounded">localhost:27017/blogManagementDB</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="bg-stone-800 text-stone-300 hover:text-white p-2 rounded"
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={14} />
            </button>

            <div className="flex items-center gap-3 bg-stone-800 px-3 py-2 rounded-lg font-sans text-sm">
              {currentUser?.avatar && (
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border-2 border-stone-700" alt="" />
              )}
              <div className="text-right">
                <div className="font-medium text-stone-50">{currentUser?.fullName}</div>
                <div className="text-xs text-stone-400">@{currentUser?.username}</div>
              </div>
              <RoleBadge role={currentUser?.role} />
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-rose-700 text-stone-300 hover:text-white px-3 py-2 rounded text-sm font-sans transition"
              title="Đăng xuất"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {isBanned && (
        <div className="bg-red-100 border-b-2 border-red-300 px-6 py-2 text-center text-sm text-red-900 font-sans">
          <Ban size={14} className="inline mr-2" />
          Tài khoản đã bị khóa. Bạn không thể thực hiện thao tác.
        </div>
      )}
      {isAdmin && (
        <div className="bg-rose-50 border-b-2 border-rose-200 px-6 py-2 text-center text-sm text-rose-900 font-sans">
          <Shield size={14} className="inline mr-2" />
          Đăng nhập với quyền <strong>ADMIN</strong>.
        </div>
      )}
    </>
  );
}
