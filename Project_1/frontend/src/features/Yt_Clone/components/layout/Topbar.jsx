import { useNavigate } from "react-router-dom";
import { Search, Menu, Moon, Sun, User, LogOut, Video, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { searchVideos } from "../../services/ytapi.service";
import { useAuth } from "../../../auth/hook/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  return (
    <header className="h-18 flex items-center justify-between px-4 lg:px-8 glass sticky top-0 z-40 transition-all">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) setSidebarOpen((prev) => !prev);
            else setCollapsed(!collapsed);
          }}
          className="p-2 rounded-xl text-muted hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5 text-main" />
        </button>

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple text-white shadow-lg shadow-brand-indigo/20 group-hover:scale-105 transition-transform duration-300">
            <Video className="w-5 h-5 fill-white" />
          </div>
          <span className="hidden sm:block font-display font-black text-xl tracking-tight text-main">
            CURA<span className="text-brand-indigo italic">TOR</span>
          </span>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center px-4 md:px-12 max-w-2xl relative" ref={dropdownRef}>
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-brand-indigo transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Explore the vision..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/5 dark:bg-black/20 border border-main text-main placeholder-muted outline-none focus:bg-white dark:focus:bg-[#0f172a]/50 focus:border-brand-indigo/50 focus:ring-4 focus:ring-brand-indigo/10 transition-all shadow-inner"
          />
        </div>

        {/* SMART SEARCH DROPDOWN */}
        <AnimatePresence>
          {showDropdown && query.trim() && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute top-14 left-0 w-full px-4 md:px-12 z-50"
            >
              <div className="w-full glass-heavy rounded-2xl shadow-2xl overflow-hidden py-3 max-h-[60vh] overflow-y-auto">
                <p className="px-4 py-1 text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-brand-amber" />
                  AI Insights
                </p>
                {results.length > 0 ? (
                  results.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => handleSelectResult(video._id)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-brand-indigo/10 cursor-pointer transition-colors border-b border-main last:border-0"
                    >
                      <div className="w-14 h-9 bg-surface-low rounded-lg overflow-hidden shrink-0 shadow-sm">
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-main truncate leading-tight">
                          {video.title}
                        </p>
                        <p className="text-[11px] text-muted truncate mt-0.5">
                          {video.channel?.name || "Premium Creator"} • {video.viewsCount || 0} views
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted text-sm italic">
                    The curator is searching for "{query}"...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 sm:gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-main hover:bg-white/10 transition-colors border border-transparent hover:border-main"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-brand-amber" /> : <Moon className="w-5 h-5 text-brand-indigo" />}
        </motion.button>

        <div className="relative" ref={profileMenuRef}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white cursor-pointer shadow-lg shadow-brand-indigo/20"
          >
            <User className="w-5 h-5" />
          </motion.div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 glass-heavy rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
              >
                 <div className="px-4 py-3 border-b border-main mb-1">
                   <p className="text-xs font-black uppercase text-muted tracking-wide">Member Access</p>
                   <p className="text-sm font-bold text-main truncate">Premium Creator</p>
                 </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/studio");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-main hover:bg-brand-indigo/10 transition-colors"
                >
                  <Video className="w-4 h-4 text-brand-indigo" />
                  Studio Dashboard
                </button>
                <div className="h-px bg-main my-1" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-brand-crimson hover:bg-brand-crimson/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
