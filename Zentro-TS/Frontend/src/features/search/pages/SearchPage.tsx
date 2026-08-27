import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchSearchPosts, fetchSearchUsers, fetchSearchTags, setSearchQuery } from "../state/searchSlice";
import { FeedCard } from "@/features/feed/components/FeedCard";
import { FollowCard } from "@/features/follow/components/FollowCard";
import { TrendingTags } from "../components/TrendingTags";
import { Button } from "@/shared/ui/button";
import { PageLoader } from "@/shared/components/PageLoader";
import { Search, FileText, Users, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "posts" | "users" | "tags";

const tabs: { key: TabType; label: string; icon: typeof FileText }[] = [
  { key: "posts", label: "Posts", icon: FileText },
  { key: "users", label: "People", icon: Users },
  { key: "tags", label: "Tags", icon: Hash },
];

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  
  const { 
    posts, users, tags, loading, 
    postsPagination, usersPagination 
  } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (initialQuery) {
      dispatch(setSearchQuery(initialQuery));
      // Fetch based on active tab
      if (activeTab === "posts") {
        dispatch(fetchSearchPosts({ query: initialQuery, page: 1 }));
      } else if (activeTab === "users") {
        dispatch(fetchSearchUsers({ query: initialQuery, page: 1 }));
      } else if (activeTab === "tags") {
        dispatch(fetchSearchTags(initialQuery));
      }
    }
  }, [initialQuery, activeTab, dispatch]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleLoadMore = () => {
    if (activeTab === "posts" && postsPagination?.hasNextPage) {
      dispatch(fetchSearchPosts({ query: initialQuery, page: postsPagination.currentPage + 1 }));
    } else if (activeTab === "users" && usersPagination?.hasNextPage) {
      dispatch(fetchSearchUsers({ query: initialQuery, page: usersPagination.currentPage + 1 }));
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Full-width Search Bar */}
      <div className="mb-8 max-w-3xl mx-auto">
        <SearchBar />
      </div>

      {!initialQuery ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Search className="h-9 w-9 text-primary/60" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Search Zentro</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Discover posts, find people, and explore trending topics across the platform.
          </p>
        </div>
      ) : (
        <>
          {/* Results header */}
          <div className="mb-6 max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground">
              Showing results for <span className="font-semibold text-foreground">"{initialQuery}"</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 max-w-3xl mx-auto">
            <div className="flex gap-1 p-1 bg-muted/30 rounded-xl border border-border/40 w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-background text-foreground shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results content — full width */}
          <div className="w-full min-h-[400px]">
            {loading && posts.length === 0 && users.length === 0 && tags.length === 0 ? (
              <PageLoader />
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "posts" && (
                  <motion.div
                    key="posts"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {posts.length > 0 ? (
                      <>
                        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                          {posts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                          ))}
                        </div>
                        {postsPagination?.hasNextPage && (
                          <div className="flex justify-center pt-6">
                            <Button
                              variant="outline"
                              onClick={handleLoadMore}
                              disabled={loading}
                              className="rounded-xl px-8"
                            >
                              {loading ? "Loading..." : "Load More"}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-16 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground font-medium">No posts found for "{initialQuery}"</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "users" && (
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {users.length > 0 ? (
                      <>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {users.map((user) => (
                            <FollowCard key={user._id} user={user as any} isFollowing={false} />
                          ))}
                        </div>
                        {usersPagination?.hasNextPage && (
                          <div className="flex justify-center pt-6">
                            <Button
                              variant="outline"
                              onClick={handleLoadMore}
                              disabled={loading}
                              className="rounded-xl px-8"
                            >
                              {loading ? "Loading..." : "Load More"}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-16 text-center">
                        <Users className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground font-medium">No people found for "{initialQuery}"</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Try a different name or username</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "tags" && (
                  <motion.div
                    key="tags"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-2xl mx-auto"
                  >
                    {tags.length > 0 ? (
                      <TrendingTags tags={tags} />
                    ) : (
                      <div className="flex flex-col items-center py-16 text-center">
                        <Hash className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground font-medium">No tags found for "{initialQuery}"</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Try different keywords</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </>
      )}
    </div>
  );
};
