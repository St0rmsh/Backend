import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookmarkService, Bookmark } from "../services/bookmark.service";

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
  { postId: string; message: string; success: boolean },
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
  },
  extraReducers: (builder) => {
    builder
      // Toggle
      .addCase(toggleBookmarkThunk.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(toggleBookmarkThunk.fulfilled, (state, action) => {
        state.loading[action.meta.arg] = false;
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

        if (append) {
          state.bookmarksList = [...state.bookmarksList, ...data.bookmarks];
        } else {
          state.bookmarksList = data.bookmarks;
        }

        state.currentPage = data.pagination.currentPage;
        state.totalPages = data.pagination.totalPages;
        state.totalBookmarks = data.pagination.totalBookmarks;
        state.hasNextPage = data.pagination.hasNextPage;
        state.hasPrevPage = data.pagination.hasPrevPage;
      })
      .addCase(fetchMyBookmarksThunk.rejected, (state, action) => {
        state.isFetchingBookmarks = false;
        state.fetchError = action.payload || "Error fetching bookmarks";
      });
  },
});

export const { setBookmarkedPosts, addBookmark, removeBookmark } = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
