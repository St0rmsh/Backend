import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { likeService } from "../services/like.service";

interface LikeState {
  likedPosts: string[]; // List of post IDs the user has liked
  loading: Record<string, boolean>; // Map of postId to loading state
}

const initialState: LikeState = {
  likedPosts: [],
  loading: {},
};

export const toggleLikeThunk = createAsyncThunk<
  { postId: string; message: string; success: boolean },
  string,
  { rejectValue: string }
>("likes/toggleLike", async (postId, { rejectWithValue }) => {
  try {
    const data = await likeService.toggleLike(postId);
    return { postId, ...data };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to toggle like"
    );
  }
});

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLikedPosts(state, action) {
      state.likedPosts = action.payload;
    },
    addLike(state, action) {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);
      }
    },
    removeLike(state, action) {
      state.likedPosts = state.likedPosts.filter((id) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLikeThunk.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        state.loading[action.meta.arg] = false;
        // Depending on backend logic, if it returns success we can sync.
        // Usually, we prefer optimistic UI so we might not need to do anything here if we updated optimistically
      })
      .addCase(toggleLikeThunk.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
        // On failure, rollback could be handled here or in the component.
      });
  },
});

export const { setLikedPosts, addLike, removeLike } = likeSlice.actions;

export default likeSlice.reducer;
