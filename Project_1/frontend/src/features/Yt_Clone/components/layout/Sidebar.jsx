import { NavLink } from "react-router-dom";

const Sidebar = ({ open, setOpen, collapsed }) => {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-40
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300
          
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="p-4">

          {/* LOGO */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold">
              Y
            </div>
            {!collapsed && (
              <h1 className="text-lg font-semibold">YTPAI</h1>
            )}
          </div>

          {/* NAV */}
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              🏠 {!collapsed && "Home"}
            </NavLink>

            <NavLink
              to="/studio"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              📊 {!collapsed && "Studio"}
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
