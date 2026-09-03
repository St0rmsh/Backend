import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { bookmarkService, Bookmark } from "../services/bookmark.service";
import { loginThunk, hydrateAuthThunk } from "../../auth/state/authThunks";

interface ToggleBookmarkPayload {
  postId: string;
  message: string;
  success: boolean;
  bookmark?: {
    message: string;
    bookmarked: boolean;
  };
}

interface BookmarkState {
  bookmarkedPosts: string[]; // List of post IDs the user has bookmarked
  loading: Record<string, boolean>; // Map of postId to loading state

  // Bookmarks Page State
  bookmarksList: Bookmark[];
  totalBookmarks: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetchingBookmarks: boolean;
  fetchError: string | null;
}

const initialState: BookmarkState = {
  bookmarkedPosts: [],
  loading: {},
  bookmarksList: [],
  totalBookmarks: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
  isFetchingBookmarks: false,
  fetchError: null,
};

export const toggleBookmarkThunk = createAsyncThunk<
  ToggleBookmarkPayload,
  string,
  { rejectValue: string }
>("bookmarks/toggleBookmark", async (postId, { rejectWithValue }) => {
  try {
    const data = await bookmarkService.toggleBookmark(postId);
    return { postId, ...data };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to toggle bookmark"
    );
  }
});

export const fetchMyBookmarksThunk = createAsyncThunk<
  { data: any; append: boolean },
  { page?: number; limit?: number; append?: boolean },
  { rejectValue: string }
>("bookmarks/fetchMyBookmarks", async ({ page = 1, limit = 10, append = false }, { rejectWithValue }) => {
  try {
    const data = await bookmarkService.getMyBookmarks(page, limit);
    return { data, append };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch bookmarks"
    );
  }
});

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    setBookmarkedPosts(state, action) {
      state.bookmarkedPosts = action.payload;
    },
    addBookmark(state, action) {
      if (!state.bookmarkedPosts.includes(action.payload)) {
        state.bookmarkedPosts.push(action.payload);
      }
    },
    removeBookmark(state, action) {
      state.bookmarkedPosts = state.bookmarkedPosts.filter((id) => id !== action.payload);
    },
    updateBookmarkCommentsCount(state, action: PayloadAction<{ postId: string; delta: number }>) {
      const { postId, delta } = action.payload;

      state.bookmarksList = state.bookmarksList.map((bookmark) => {
        if (!bookmark.post || typeof bookmark.post !== "object") {
          return bookmark;
        }

        const currentPostId = bookmark.post._id;
        if (currentPostId !== postId) {
          return bookmark;
        }

        return {
          ...bookmark,
          post: {
            ...bookmark.post,
            commentsCount: Math.max(0, (bookmark.post.commentsCount ?? 0) + delta),
          },
        };
      });
    },
    setBookmarkCommentsCount(state, action: PayloadAction<{ postId: string; count: number }>) {
      const { postId, count } = action.payload;

      state.bookmarksList = state.bookmarksList.map((bookmark) => {
        if (!bookmark.post || typeof bookmark.post !== "object") {
          return bookmark;
        }

        if (bookmark.post._id !== postId) {
          return bookmark;
        }

        return {
          ...bookmark,
          post: {
            ...bookmark.post,
            commentsCount: Math.max(0, count),
          },
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle
      .addCase(toggleBookmarkThunk.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(toggleBookmarkThunk.fulfilled, (state, action) => {
        state.loading[action.meta.arg] = false;
        const isBookmarked = action.payload.bookmark?.bookmarked ?? false;

        if (isBookmarked) {
          if (!state.bookmarkedPosts.includes(action.payload.postId)) {
            state.bookmarkedPosts.push(action.payload.postId);
          }
        } else {
          state.bookmarkedPosts = state.bookmarkedPosts.filter((id) => id !== action.payload.postId);
        }
      })
      .addCase(toggleBookmarkThunk.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
      })
      // Fetch
      .addCase(fetchMyBookmarksThunk.pending, (state) => {
        state.isFetchingBookmarks = true;
        state.fetchError = null;
      })
      .addCase(fetchMyBookmarksThunk.fulfilled, (state, action) => {
        state.isFetchingBookmarks = false;
        const { data, append } = action.payload;

        const pagination = data.pagination ?? {
          currentPage: data.currentPage ?? 1,
          totalPages: data.totalPages ?? 1,
          totalBookmarks: data.totalBookmarks ?? 0,
          hasNextPage: data.hasNextPage ?? false,
          hasPrevPage: data.hasPrevPage ?? false,
        };

        if (append) {
          state.bookmarksList = [...state.bookmarksList, ...data.bookmarks];
        } else {
          state.bookmarksList = data.bookmarks;
        }

        state.bookmarkedPosts = data.bookmarks
          .map((bookmark: Bookmark) => bookmark.post?._id ?? bookmark.post)
          .filter(Boolean);

        state.currentPage = pagination.currentPage;
        state.totalPages = pagination.totalPages;
        state.totalBookmarks = pagination.totalBookmarks;
        state.hasNextPage = pagination.hasNextPage;
        state.hasPrevPage = pagination.hasPrevPage;
      })
      .addCase(fetchMyBookmarksThunk.rejected, (state, action) => {
        state.isFetchingBookmarks = false;
        state.fetchError = action.payload || "Error fetching bookmarks";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        if (action.payload.user?.bookmarkedPosts) {
          state.bookmarkedPosts = action.payload.user.bookmarkedPosts;
        }
      })
      .addCase(hydrateAuthThunk.fulfilled, (state, action) => {
        if (action.payload?.bookmarkedPosts) {
          state.bookmarkedPosts = action.payload.bookmarkedPosts;
        }
      });
  },
});

export const { setBookmarkedPosts, addBookmark, removeBookmark, updateBookmarkCommentsCount, setBookmarkCommentsCount } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
