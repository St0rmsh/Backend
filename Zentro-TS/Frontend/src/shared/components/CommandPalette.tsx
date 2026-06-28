import { useEffect, useState } from "react";
import { Search, FileText, Settings, Compass, Command } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setGlobalSearchOpen } from "@/store/slices/uiSlice";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPalette = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { globalSearchOpen } = useAppSelector((state) => state.ui);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(setGlobalSearchOpen(!globalSearchOpen));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [dispatch, globalSearchOpen]);

  const handleSelect = (path: string) => {
    dispatch(setGlobalSearchOpen(false));
    setSearch("");
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Dialog open={globalSearchOpen} onOpenChange={(open) => dispatch(setGlobalSearchOpen(open))}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="flex items-center px-6 py-3 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 shadow-none focus-visible:ring-0 px-1 h-12 text-lg bg-transparent placeholder:text-muted-foreground/60 w-full"
            autoFocus
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {!search && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="px-2">
              <p className="text-xs font-semibold text-muted-foreground/70 px-3 mb-3 tracking-widest uppercase">Quick Actions</p>
              <div className="space-y-1.5">
                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.EXPLORE)}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <Compass className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Explore Trending Topics</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Explore</span>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.POSTS + "/new")}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Write a new post</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Write</span>
                </motion.button>

                <motion.button
                  variants={itemVariants}
                  onClick={() => handleSelect(ROUTES.SETTINGS)}
                  className="group w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl hover:bg-primary/10 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <Settings className="h-4 w-4" />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">Account Settings</span>
                  </div>
                  <span className="text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors hidden sm:block">Settings</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="px-2 py-16 flex flex-col items-center justify-center text-center text-muted-foreground"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                  <div className="relative h-16 w-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                    <Command className="h-8 w-8 text-primary/60" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No results found</h3>
                <p className="text-sm opacity-70 max-w-[250px]">We couldn't find anything matching "{search}". Try another search term.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
