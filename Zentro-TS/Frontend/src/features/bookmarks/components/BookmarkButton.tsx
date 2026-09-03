import React from "react";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { toggleBookmarkThunk, addBookmark, removeBookmark } from "../state/bookmarkSlice";

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  isInitiallyBookmarked?: boolean;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  className,
  isInitiallyBookmarked = false,
}) => {
  const dispatch = useAppDispatch();
  const { bookmarkedPosts, loading } = useAppSelector((state) => state.bookmarks);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isBookmarked = bookmarkedPosts.includes(postId) || isInitiallyBookmarked;
  const isLoading = loading[postId];

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      return;
    }

    // Optimistic UI
    if (isBookmarked) {
      dispatch(removeBookmark(postId));
    } else {
      dispatch(addBookmark(postId));
    }

    try {
      await dispatch(toggleBookmarkThunk(postId)).unwrap();
    } catch (err) {
      // Revert on failure
      if (isBookmarked) {
        dispatch(addBookmark(postId));
      } else {
        dispatch(removeBookmark(postId));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-muted group transition-all ${className ?? ""}`}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isBookmarked ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <BookmarkIcon
          className={`h-5 w-5 transition-colors ${
            isBookmarked
              ? "fill-primary text-primary"
              : "text-muted-foreground group-hover:text-primary/80"
          }`}
        />
      </motion.div>
    </Button>
  );
};
