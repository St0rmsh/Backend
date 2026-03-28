import { useNavigate } from "react-router-dom";

const Topbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 flex items-center justify-between px-3 md:px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ☰
        </button>

        {/* DESKTOP COLLAPSE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ☰
        </button>

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="hidden sm:flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="font-semibold text-sm">YTPAI</span>
        </div>

      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center px-2">
        <input
          placeholder="Search"
          onFocus={() => setSidebarOpen(false)}
          className="
            w-full max-w-xl px-4 py-2 rounded-full
            bg-gray-100 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            outline-none focus:ring-2 focus:ring-indigo-500
          "
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme}>🌗</button>

        <div
          onClick={() => navigate("/studio")}
          className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white cursor-pointer"
        >
          S
        </div>
      </div>
    </header>
  );
};

export default Topbar;
