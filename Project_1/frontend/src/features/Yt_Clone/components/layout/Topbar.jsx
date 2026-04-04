import { useNavigate } from "react-router-dom";
import { Search, Menu, Moon, Sun, User, LogOut, Video } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { searchVideos } from "../../services/ytapi.service";
import { useAuth } from "../../../auth/hook/useAuth";

const Topbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await searchVideos(query);
          setResults(res.data?.videos || []);
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (videoId) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/video/${videoId}`);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-18 flex items-center justify-between px-4 lg:px-8 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* DESKTOP COLLAPSE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* LOGO (visible only small mobile if sidebar takes it away normally, but kept for balance) */}
        <div
          onClick={() => navigate("/")}
          className="lg:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-linear-to-tr from-blue-500 to-purple-600 text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            Y
          </div>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center px-4 md:px-8 max-w-3xl relative" ref={dropdownRef}>
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Search for videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => {
              if (window.innerWidth < 1024) setSidebarOpen(false);
              if (query.trim()) setShowDropdown(true);
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100/80 dark:bg-[#1a2235]/60 hover:bg-gray-200/50 dark:hover:bg-[#1a2235] border border-transparent dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:bg-white dark:focus:bg-[#0f172a] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
          />
        </div>

        {/* SEARCH DROPDOWN */}
        {showDropdown && query.trim() && (
          <div className="absolute top-14 left-0 w-full px-4 md:px-8 z-50">
            <div className="w-full bg-white dark:bg-[#111129] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                results.map((video) => (
                  <div
                    key={video._id}
                    onClick={() => handleSelectResult(video._id)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-[#1c1c3a] rounded overflow-hidden shrink-0">
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#e5e3ff] truncate">
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#aaa8c6] truncate">
                        {video.channel?.name || "Unknown"} • {video.viewsCount || 0} views
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 dark:text-[#aaa8c6]">
                  No videos found for "{query}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={profileMenuRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform"
          >
            <User className="w-5 h-5" />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111129] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/studio");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Video className="w-4 h-4" />
                Studio
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
