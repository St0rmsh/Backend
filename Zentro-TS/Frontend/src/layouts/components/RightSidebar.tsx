import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setGlobalSearchOpen } from "@/store/slices/uiSlice";
import { Button } from "@/shared/ui/button";

export const RightSidebar = () => {
  const dispatch = useAppDispatch();
  const { rightSidebarOpen } = useAppSelector((state) => state.ui);

  if (!rightSidebarOpen) return null;

  return (
    <aside className="hidden lg:block w-[320px] sticky top-0 h-screen border-l border-border bg-background p-6 overflow-y-auto z-30">
      {/* Search Trigger */}
      <div className="mb-8">
        <button
          onClick={() => dispatch(setGlobalSearchOpen(true))}
          className="flex w-full items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors shadow-sm"
        >
          <Search className="h-4 w-4" />
          <span>Search Zentro...</span>
          <div className="ml-auto flex items-center gap-1 opacity-60">
            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </button>
      </div>

      {/* Topics/Trends Placeholder */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4 text-sm tracking-tight text-foreground/80">Trending Topics</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-xs text-muted-foreground mb-1">Technology • Trending</p>
                <p className="font-medium text-sm group-hover:text-primary transition-colors">Future of AI</p>
                <p className="text-xs text-muted-foreground mt-1">10.5k posts</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <h3 className="font-semibold mb-4 text-sm tracking-tight text-foreground/80">Who to follow</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-semibold text-sm border border-border">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium hover:underline leading-none">User {i}</p>
                    <p className="text-xs text-muted-foreground mt-1">@user{i}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="h-7 rounded-full text-xs px-3">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-8 pt-6 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground/70">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Help Center</a>
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <p className="w-full mt-2">© 2026 Zentro</p>
      </div>
    </aside>
  );
};
