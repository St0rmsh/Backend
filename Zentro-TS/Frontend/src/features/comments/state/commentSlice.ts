import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { commentService } from "../services/comment.service";
import { CommentState, Comment, PaginatedComments } from "../types/comment.types";

const initialState: CommentState = {
  commentsByPost: {},
  loading: false,
  error: null,
  creating: false,
  deletingId: null,
};

export const fetchCommentsThunk = createAsyncThunk(
  "comments/fetchComments",
  async ({ postId, page, limit }: { postId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const data = await commentService.getComments(postId, page, limit);
      return { postId, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch comments");
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  "comments/createComment",
  async ({ postId, content }: { postId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await commentService.createComment(postId, content);
      // The controller returns `data: comment`
      return { postId, comment: response.data as unknown as Comment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create comment");
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "comments/updateComment",
  async ({ postId, commentId, content }: { postId: string; commentId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await commentService.updateComment(commentId, content);
      // The controller returns `comment: comment`
      return { postId, comment: (response as any).comment as Comment };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update comment");
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "comments/deleteComment",
  async ({ postId, commentId }: { postId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await commentService.deleteComment(commentId);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;
        
        // If it's page 1, replace. Otherwise append.
        if (data.currentPage === 1 || !state.commentsByPost[postId]) {
          state.commentsByPost[postId] = data;
        } else {
          // Append comments
          const existing = state.commentsByPost[postId];
          
          // Avoid duplicates by filtering
          const newComments = data.comments.filter(
            (newComment) => !existing.comments.some((c) => c._id === newComment._id)
          );
          
          state.commentsByPost[postId] = {
            ...data,
            comments: [...existing.comments, ...newComments],
          };
        }
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Comment
      .addCase(createCommentThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        state.creating = false;
        const { postId, comment } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments.unshift(comment);
          state.commentsByPost[postId].totalComments += 1;
        } else {
           state.commentsByPost[postId] = {
             comments: [comment],
             totalComments: 1,
             totalPages: 1,
             currentPage: 1,
             limit: 10,
             hasNextPage: false,
             hasPrevPage: false
           };
        }
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      
      // Update Comment
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.commentsByPost[postId]) {
          const index = state.commentsByPost[postId].comments.findIndex((c) => c._id === comment._id);
          if (index !== -1) {
            state.commentsByPost[postId].comments[index] = comment;
          }
        }
      })
      
      // Delete Comment
      .addCase(deleteCommentThunk.pending, (state, action) => {
        state.deletingId = action.meta.arg.commentId;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        state.deletingId = null;
        const { postId, commentId } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].comments = state.commentsByPost[postId].comments.filter(
            (c) => c._id !== commentId
          );
          state.commentsByPost[postId].totalComments = Math.max(0, state.commentsByPost[postId].totalComments - 1);
        }
      })
      .addCase(deleteCommentThunk.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default commentSlice.reducer;
