import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { likeService } from "../services/like.service";
import { loginThunk, hydrateAuthThunk } from "../../auth/state/authThunks";

const STORAGE_KEY = "zentro_liked_posts";

function loadLikedPosts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLikedPosts(likedPosts: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedPosts));
  } catch {
    // Ignore storage failures
  }
}

interface LikeState {
  likedPosts: string[]; // List of post IDs the user has liked
  loading: Record<string, boolean>; // Map of postId to loading state
}

const initialState: LikeState = {
  likedPosts: loadLikedPosts(),
  loading: {},
};

export const toggleLikeThunk = createAsyncThunk<
  { postId: string; liked: boolean; message: string; success: boolean },
  string,
  { rejectValue: string }
>("likes/toggleLike", async (postId, { rejectWithValue }) => {
  try {
    const data = await likeService.toggleLike(postId);
    return { postId, liked: data.data?.liked ?? false, message: data.message, success: data.success };
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
        saveLikedPosts(state.likedPosts);
      }
    },
    removeLike(state, action) {
      state.likedPosts = state.likedPosts.filter((id) => id !== action.payload);
      saveLikedPosts(state.likedPosts);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLikeThunk.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        state.loading[action.meta.arg] = false;

        if (action.payload.liked) {
          if (!state.likedPosts.includes(action.payload.postId)) {
            state.likedPosts.push(action.payload.postId);
          }
        } else {
          state.likedPosts = state.likedPosts.filter((id) => id !== action.payload.postId);
        }

        saveLikedPosts(state.likedPosts);
      })
      .addCase(toggleLikeThunk.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
        // On failure, rollback could be handled here or in the component.
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        if (action.payload.user?.likedPosts) {
          state.likedPosts = action.payload.user.likedPosts;
          saveLikedPosts(state.likedPosts);
        }
      })
      .addCase(hydrateAuthThunk.fulfilled, (state, action) => {
        if (action.payload?.likedPosts) {
          state.likedPosts = action.payload.likedPosts;
          saveLikedPosts(state.likedPosts);
        }
      });
  },
});

export const { setLikedPosts, addLike, removeLike } = likeSlice.actions;

export default likeSlice.reducer;
