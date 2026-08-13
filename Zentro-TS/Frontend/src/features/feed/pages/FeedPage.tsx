import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFeedThunk, refreshFeedThunk, clearFeedError } from "../state/feedSlice";
import { FeedHeader } from "../components/FeedHeader";
import { FeedCard } from "../components/FeedCard";
import { FeedSkeleton } from "../components/FeedSkeleton";
import { FeedEmpty } from "../components/FeedEmpty";
import { FeedError } from "../components/FeedError";
import { InfiniteLoader } from "../components/InfiniteLoader";
import { RefreshButton } from "../components/RefreshButton";
import { AnimatePresence } from "framer-motion";

import { SEO } from "@/shared/components/SEO";

export function FeedPage() {
  const dispatch = useAppDispatch();
  const { posts, loading, error, currentPage, hasNextPage, activeTab } =
    useAppSelector((state) => state.feed);

  // Fetch feed on mount or when tab changes
  useEffect(() => {
    dispatch(fetchFeedThunk(1));
    return () => {
      dispatch(clearFeedError());
    };
  }, [dispatch, activeTab]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      dispatch(fetchFeedThunk(currentPage + 1));
    }
  }, [loading, hasNextPage, currentPage, dispatch]);

  const handleRetry = () => {
    dispatch(fetchFeedThunk(1));
  };

  const isInitialLoad = loading && posts.length === 0;

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <SEO title={`Zentro — ${activeTab === "home" ? "Home" : "Following"} Feed`} />
      {/* Top Feed Filter Tabs & Refresh Button */}
      <FeedHeader />

      {/* Main Feed Content Area */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Floating/Header Refresh Status */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-foreground capitalize">
            {activeTab === "home" ? "Home Feed" : `${activeTab} Feed`}
          </h1>
          <RefreshButton />
        </div>

        {/* Initial Loading Skeletons */}
        {isInitialLoad && (
          <div className="space-y-6">
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
          </div>
        )}

        {/* Error State */}
        {!isInitialLoad && error && (
          <FeedError message={error} onRetry={handleRetry} />
        )}

        {/* Empty State */}
        {!isInitialLoad && !error && posts.length === 0 && (
          <FeedEmpty onRefresh={() => dispatch(refreshFeedThunk())} />
        )}

        {/* Feed List */}
        {!isInitialLoad && posts.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => (
                <FeedCard key={post._id} post={post} index={index} />
              ))}
            </AnimatePresence>

            {/* Infinite Scroll trigger / Pagination Loader */}
            <InfiniteLoader
              onLoadMore={handleLoadMore}
              loading={loading}
              hasNextPage={hasNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
