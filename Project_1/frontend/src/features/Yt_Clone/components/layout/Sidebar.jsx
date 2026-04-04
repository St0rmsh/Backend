import { NavLink, useNavigate } from "react-router-dom";
import { Home, LineChart, LogOut, X } from "lucide-react";
import { useAuth } from "../../../auth/hook/useAuth.js";

const Sidebar = ({ open, setOpen, collapsed }) => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <>
      {/* ── MOBILE OVERLAY ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          bg-white/80 dark:bg-[#111129]/80 backdrop-blur-xl
          border-r border-gray-200/50 dark:border-white/5
          transition-all duration-300 shadow-[2px_0_20px_rgba(0,0,0,0.06)]
          
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 flex flex-col
          
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden no-scrollbar">

          {/* ── LOGO ── */}
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-9 h-9 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_18px_rgba(99,102,241,0.45)] shrink-0 select-none">
              Y
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap tracking-tight">
                YTPAI
              </h1>
            )}

            {/* Mobile close */}
            <button
              onClick={() => setOpen(false)}
              className="ml-auto lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── NAV ── */}
          <nav className="space-y-1.5 flex-1">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "bg-linear-to-r from-indigo-500/15 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner border border-indigo-500/20"
                    : "text-gray-600 dark:text-[#aaa8c6] hover:bg-gray-100/60 dark:hover:bg-white/5 font-medium"
                }`
              }
            >
              <Home className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="whitespace-nowrap text-sm">Home</span>}
            </NavLink>

            <NavLink
              to="/studio"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "bg-linear-to-r from-indigo-500/15 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-inner border border-indigo-500/20"
                    : "text-gray-600 dark:text-[#aaa8c6] hover:bg-gray-100/60 dark:hover:bg-white/5 font-medium"
                }`
              }
            >
              <LineChart className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && <span className="whitespace-nowrap text-sm">Studio</span>}
            </NavLink>
          </nav>

          {/* ── LOGOUT ── */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm transition-all group"
            >
              <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              {!collapsed && <span className="whitespace-nowrap">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
