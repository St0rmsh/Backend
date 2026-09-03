import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { updatePostLikesCount } from "../../feed/state/feedSlice";
import { updatePostDetailLikesCount } from "../../post/state/postSlice";
import { toggleLikeThunk, addLike, removeLike } from "../state/likeSlice";

interface LikeButtonProps {
  postId: string;
  className?: string;
  initialLikeCount?: number;
  isInitiallyLiked?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  className,
  initialLikeCount = 0,
  isInitiallyLiked = false,
}) => {
  const dispatch = useAppDispatch();
  const { likedPosts, loading } = useAppSelector((state) => state.likes);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [displayCount, setDisplayCount] = useState(initialLikeCount);

  const isLiked = likedPosts.includes(postId) || isInitiallyLiked;
  const isLoading = loading[postId];
  const visualIsLiked = isLiked;

  useEffect(() => {
    setDisplayCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    if (isLiked) {
      setDisplayCount((prev) => (prev < initialLikeCount ? initialLikeCount : prev));
    } else {
      setDisplayCount((prev) => (prev > initialLikeCount ? initialLikeCount : prev));
    }
  }, [isLiked, initialLikeCount]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      return;
    }

    const willLike = !visualIsLiked;

    setDisplayCount((prev) => Math.max(0, prev + (willLike ? 1 : -1)));
    dispatch(updatePostLikesCount({ postId, delta: willLike ? 1 : -1 }));
    dispatch(updatePostDetailLikesCount(willLike ? 1 : -1));

    if (willLike) {
      dispatch(addLike(postId));
    } else {
      dispatch(removeLike(postId));
    }

    try {
      await dispatch(toggleLikeThunk(postId)).unwrap();
    } catch (err) {
      setDisplayCount((prev) => Math.max(0, prev + (willLike ? -1 : 1)));
      dispatch(updatePostLikesCount({ postId, delta: willLike ? -1 : 1 }));
      dispatch(updatePostDetailLikesCount(willLike ? -1 : 1));

      if (willLike) {
        dispatch(removeLike(postId));
      } else {
        dispatch(addLike(postId));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-2 rounded-full hover:bg-muted group transition-all ${className ?? ""}`}
      onClick={handleToggleLike}
      disabled={isLoading}
      aria-label={visualIsLiked ? "Unlike post" : "Like post"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={visualIsLiked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${visualIsLiked
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground group-hover:text-red-500/80"
            }`}
        />
      </motion.div>
      <span
        className={`text-sm font-medium transition-colors ${visualIsLiked ? "text-red-500" : "text-muted-foreground"
          }`}
      >
        {displayCount}
      </span>
    </Button>
  );
};
