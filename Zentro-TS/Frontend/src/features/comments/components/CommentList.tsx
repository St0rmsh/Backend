import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { 
  fetchCommentsThunk, 
  createCommentThunk, 
  updateCommentThunk, 
  deleteCommentThunk 
} from "../state/commentSlice";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { CommentListSkeleton } from "./CommentSkeleton";
import { DeleteCommentDialog } from "./DeleteCommentDialog";
import { Button } from "@/shared/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CommentListProps {
  postId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const dispatch = useAppDispatch();
  const { commentsByPost, loading, creating, deletingId } = useAppSelector((state) => state.comments);
  const { user } = useAppSelector((state) => state.auth);
  
  const postComments = commentsByPost[postId];
  const comments = postComments?.comments || [];
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Fetch first page of comments when mounted
    dispatch(fetchCommentsThunk({ postId, page: 1, limit: 10 }));
  }, [dispatch, postId]);

  const handleCreateComment = async (content: string) => {
    await dispatch(createCommentThunk({ postId, content })).unwrap();
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    await dispatch(updateCommentThunk({ postId, commentId, content })).unwrap();
  };

  const handleDeleteRequest = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (commentToDelete) {
      try {
        await dispatch(deleteCommentThunk({ postId, commentId: commentToDelete })).unwrap();
      } finally {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  const handleLoadMore = () => {
    if (postComments?.hasNextPage) {
      dispatch(fetchCommentsThunk({ postId, page: postComments.currentPage + 1, limit: postComments.limit }));
    }
  };

  // Determine skeleton vs real content
  const isInitialLoad = loading && comments.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6 bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          Comments 
          {postComments?.totalComments !== undefined && (
            <span className="text-muted-foreground text-sm font-medium bg-muted px-2 py-0.5 rounded-full">
              {postComments.totalComments}
            </span>
          )}
        </h3>
      </div>

      {user ? (
        <div className="mb-6">
          <CommentInput
            currentUser={user}
            onSubmit={handleCreateComment}
            isLoading={creating}
          />
        </div>
      ) : (
        <div className="p-4 border rounded-xl bg-card text-center mb-6">
          <p className="text-muted-foreground mb-2">Log in to leave a comment.</p>
          {/* Optional: Add a link to login */}
        </div>
      )}

      {isInitialLoad ? (
        <CommentListSkeleton count={3} />
      ) : comments.length > 0 ? (
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onEdit={handleUpdateComment}
                onDelete={handleDeleteRequest}
              />
            ))}
          </AnimatePresence>

          {postComments?.hasNextPage && (
            <div className="pt-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore} 
                disabled={loading}
                className="rounded-full px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Comments"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-muted-foreground"
        >
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </motion.div>
      )}

      <DeleteCommentDialog
        isOpen={deleteDialogOpen}
        onClose={() => !deletingId && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={!!deletingId}
      />
    </div>
  );
};
