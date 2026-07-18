import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchPostThunk, clearPost } from "../state/postSlice";
import { PostSkeleton } from "../components/PostSkeleton";
import { PostError } from "../components/PostError";
import { PostHeader } from "../components/PostHeader";
import { PostContent } from "../components/PostContent";
import { ReadingProgress } from "../components/ReadingProgress";
import { TableOfContents } from "../components/TableOfContents";
import { ReadingControls } from "../components/ReadingControls";
import { InteractionBar } from "../components/InteractionBar";
import { RecommendationList } from "../components/RecommendationList";
import { ScrollToTopButton } from "../components/ScrollToTopButton";
import { AuthorCard } from "../components/AuthorCard";
import { motion, AnimatePresence } from "framer-motion";

export const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentPost, loading, error, settings, readingPosition } = useAppSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPostThunk(id));
    }
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id]);

  // Restore reading position when post is loaded
  useEffect(() => {
    if (currentPost && readingPosition > 0) {
      // Use a slight delay to allow rendering to complete
      const timeout = setTimeout(() => {
        window.scrollTo({ top: readingPosition, behavior: "auto" });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentPost]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    if (id) {
      dispatch(fetchPostThunk(id));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-8">
        <PostSkeleton />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="w-full h-full p-4 sm:p-6 lg:p-8">
        <PostError message={error || "Post not found"} onRetry={handleRetry} />
      </div>
    );
  }

  const maxWidthClass =
    settings.readingWidth === "narrow"
      ? "max-w-[600px]"
      : settings.readingWidth === "wide"
      ? "max-w-[900px]"
      : "max-w-[720px]";

  return (
    <div className="relative min-h-screen bg-background">
      <ReadingProgress />
      
      {/* Sticky Top Bar for Mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 p-3 flex justify-between items-center">
        <h1 className="text-sm font-semibold truncate">{currentPost.title}</h1>
      </div>

      <div className="flex w-full items-start justify-center pt-8 pb-32">
        {/* Left Side: Interactions */}
        <div className="hidden xl:block w-[100px] sticky top-24 mr-8 shrink-0">
          <InteractionBar />
        </div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full px-4 sm:px-6 lg:px-8 mx-auto transition-all duration-300 ${maxWidthClass}`}
        >
          <PostHeader post={currentPost} />
          
          <div 
            className={`mt-10 mb-16 transition-all duration-300`} 
            style={{ fontSize: `${settings.fontSize}px` }}
          >
            <PostContent content={currentPost.content} />
          </div>

          {/* Author Card at Bottom */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <AuthorCard author={currentPost.user} />
          </div>

          {/* Interaction Bar on Mobile/Tablet */}
          <div className="xl:hidden mt-8 py-4 border-y border-border/40 flex justify-center">
            <InteractionBar orientation="horizontal" />
          </div>

          {/* Recommended Reading */}
          <div className="mt-16">
            <RecommendationList />
          </div>
        </motion.article>

        {/* Right Side: Table of Contents */}
        {!settings.focusMode && (
          <div className="hidden lg:block w-[280px] sticky top-24 ml-8 shrink-0 pr-4">
            <TableOfContents content={currentPost.content} />
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <AnimatePresence>
        {!settings.focusMode && <ReadingControls />}
      </AnimatePresence>
      <ScrollToTopButton />
    </div>
  );
};
