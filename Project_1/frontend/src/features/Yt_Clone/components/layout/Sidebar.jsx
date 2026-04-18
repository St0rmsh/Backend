import { NavLink, useNavigate } from "react-router-dom";
import { Home, LineChart, LogOut, X, LayoutDashboard, Compass, PlayCircle, History } from "lucide-react";
import { useAuth } from "../../../auth/hook/useAuth.js";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ open, setOpen, collapsed }) => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Explore", icon: Compass, path: "/explore" },
    { name: "Subscriptions", icon: PlayCircle, path: "/subscriptions" },
    { name: "History", icon: History, path: "/history" },
    { name: "Studio", icon: LayoutDashboard, path: "/studio" },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] z-50
          glass lg:bg-transparent lg:border-r-0 lg:backdrop-blur-0
          transition-all duration-300 ease-in-out
          
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 flex flex-col
          
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          
          {/* MOBILE LOGO & CLOSE */}
          <div className="lg:hidden flex items-center justify-between mb-4 border-b border-main pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-black">
                S
              </div>
              <span className="font-display font-black text-lg tracking-tight text-main uppercase italic">
                Sti<span className="text-brand-orange">tch</span>
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-muted hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3.5 py-3 rounded-2xl transition-all duration-300 group relative
                  ${
                    isActive
                      ? "bg-brand-orange/10 text-brand-orange font-bold shadow-sm"
                      : "text-muted hover:bg-brand-orange/5 hover:text-main"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    {!collapsed && <span className="whitespace-nowrap text-[12px] font-black uppercase tracking-widest">{item.name}</span>}
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-brand-orange rounded-r-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-main">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl text-brand-red hover:bg-brand-red/10 font-black text-[10px] uppercase tracking-widest transition-all group"
            >
              <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
