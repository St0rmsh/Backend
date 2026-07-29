import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { toggleLikeThunk, addLike, removeLike } from "../state/likeSlice";

interface LikeButtonProps {
  postId: string;
  initialLikeCount?: number;
  isInitiallyLiked?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikeCount = 0,
  isInitiallyLiked = false,
}) => {
  const dispatch = useAppDispatch();
  const { likedPosts, loading } = useAppSelector((state) => state.likes);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Consider it liked if it's in our Redux list OR if it was initially liked and we haven't tracked it yet
  // Wait, better to initialize redux state with the initially liked state on mount, or rely on Redux exclusively if we populated it.
  // For simplicity, we'll assume the component manages its own optimistic count based on Redux.

  const isLiked = likedPosts.includes(postId) || isInitiallyLiked;
  const isLoading = loading[postId];

  // A simple optimistic count: if Redux thinks it's liked but it wasn't initially, +1.
  // If it's not liked in Redux but was initially, -1.
  const isReduxLiked = likedPosts.includes(postId);
  const likeOffset = (isReduxLiked && !isInitiallyLiked) ? 1 : (!isReduxLiked && isInitiallyLiked ? -1 : 0);
  const currentCount = Math.max(0, initialLikeCount + likeOffset);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      // Could show a toast to login
      return;
    }

    // Optimistic UI
    if (isLiked) {
      dispatch(removeLike(postId));
    } else {
      dispatch(addLike(postId));
    }

    try {
      await dispatch(toggleLikeThunk(postId)).unwrap();
    } catch (err) {
      // Revert on failure
      if (isLiked) {
        dispatch(addLike(postId));
      } else {
        dispatch(removeLike(postId));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 rounded-full hover:bg-muted group transition-all"
      onClick={handleToggleLike}
      disabled={isLoading}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${isLiked
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground group-hover:text-red-500/80"
            }`}
        />
      </motion.div>
      <span
        className={`text-sm font-medium transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground"
          }`}
      >
        {currentCount}
      </span>
    </Button>
  );
};
