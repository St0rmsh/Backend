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

type TabType = "posts" | "users" | "tags";

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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-10">
        <SearchBar />
      </div>

      {!initialQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold">Search Zentro</h2>
          <p className="mt-2 text-muted-foreground">Find posts, authors, and trending topics.</p>
        </div>
      ) : (
        <>
          <div className="mb-8 flex gap-2 border-b">
            {(["posts", "users", "tags"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {loading && posts.length === 0 && users.length === 0 && tags.length === 0 ? (
              <PageLoader />
            ) : (
              <>
                {activeTab === "posts" && (
                  <div className="space-y-6">
                    {posts.length > 0 ? (
                      <>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {posts.map((post) => (
                            <FeedCard key={post._id} post={post} />
                          ))}
                        </div>
                        {postsPagination?.hasNextPage && (
                          <div className="flex justify-center pt-6">
                            <Button variant="outline" onClick={handleLoadMore}>
                              Load More
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-10">No posts found for "{initialQuery}"</p>
                    )}
                  </div>
                )}

                {activeTab === "users" && (
                  <div className="space-y-6">
                    {users.length > 0 ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {users.map((user) => (
                            <FollowCard key={user._id} user={user as any} isFollowing={false} />
                          ))}
                        </div>
                        {usersPagination?.hasNextPage && (
                          <div className="flex justify-center pt-6">
                            <Button variant="outline" onClick={handleLoadMore}>
                              Load More
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-10">No users found for "{initialQuery}"</p>
                    )}
                  </div>
                )}

                {activeTab === "tags" && (
                  <div className="mx-auto max-w-xl">
                    {tags.length > 0 ? (
                      <TrendingTags tags={tags} />
                    ) : (
                      <p className="text-center text-muted-foreground py-10">No tags found for "{initialQuery}"</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
