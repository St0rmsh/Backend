import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { feedService } from "../services/feed.service";
import { FeedState, FeedTab, Post } from "../types/feed.types";

const MOCK_TRENDING_POSTS: Post[] = [
  {
    _id: "trending-1",
    title: "Understanding React Server Components (RSC) and the Future of Web Dev",
    content: "React Server Components are changing the way we think about building web applications. In this article, we dive deep into how they work, why they improve load times, and how you can start adopting them today in your Next.js and Vite projects. We will cover streaming HTML, selective hydration, and how to mix server and client components seamlessly.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    category: "Programming",
    tags: ["React", "RSC", "NextJS", "WebDev"],
    likesCount: 1540,
    commentsCount: 89,
    viewsCount: 24500,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: {
      _id: "u-trend-1",
      username: "dan_abramov",
      fullname: "Dan Abramov",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isVerified: true
    }
  },
  {
    _id: "trending-2",
    title: "Mastering Framer Motion: Subtle Animations for Exceptional UX",
    content: "Animations shouldn't be loud; they should be felt. Learn how to implement micro-interactions, layout animations, and gesture controls that make your web applications feel premium. We'll examine spring physics, exit animations, and code splitting techniques to ensure buttery-smooth 60fps animations on mobile devices.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    category: "AI",
    tags: ["UIUX", "FramerMotion", "CSS", "Design"],
    likesCount: 872,
    commentsCount: 42,
    viewsCount: 12400,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: {
      _id: "u-trend-2",
      username: "design_sensei",
      fullname: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      isVerified: true
    }
  }
];

const MOCK_FOLLOWING_POSTS: Post[] = [
  {
    _id: "following-1",
    title: "Clean Architecture in TypeScript: Building Scalable Enterprise Apps",
    content: "How do you keep your codebase maintainable when it grows to hundreds of files? The answer is clean architecture. In Zentro, we follow a strict 4-layer structure to separate concerns. This article explains the theory behind boundary layers, dependency inversion, and service layers with practical TypeScript code examples.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    category: "Technology",
    tags: ["TypeScript", "Architecture", "Backend", "BestPractices"],
    likesCount: 320,
    commentsCount: 15,
    viewsCount: 2300,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: {
      _id: "u-follow-1",
      username: "alex_coder",
      fullname: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      isVerified: false
    }
  }
];

const MOCK_RECOMMENDED_POSTS: Post[] = [
  {
    _id: "rec-1",
    title: "Glassmorphism in 2026: Elevating Aesthetics without Hurting Performance",
    content: "Glassmorphism is more popular than ever, but it comes with a performance cost. Applying backdrop filters, high saturation overlays, and nested borders can lead to rendering lag. This guide shares CSS and hardware acceleration tips to achieve beautiful obsidian-glass designs that render smoothly on all screens.",
    coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80",
    category: "Technology",
    tags: ["CSS", "WebDesign", "Aesthetics", "Performance"],
    likesCount: 945,
    commentsCount: 38,
    viewsCount: 15600,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      _id: "u-rec-1",
      username: "creative_mind",
      fullname: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      isVerified: false
    }
  }
];

export const fetchFeedThunk = createAsyncThunk(
  "feed/fetchFeed",
  async (page: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: FeedState };
      if (state.feed.activeTab !== "home") {
        // Return mock data for placeholder tabs
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
        let mockPosts: Post[] = [];
        if (state.feed.activeTab === "trending") mockPosts = MOCK_TRENDING_POSTS;
        else if (state.feed.activeTab === "following") mockPosts = MOCK_FOLLOWING_POSTS;
        else if (state.feed.activeTab === "recommended") mockPosts = MOCK_RECOMMENDED_POSTS;

        return {
          posts: mockPosts,
          totalPosts: mockPosts.length,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        };
      }

      const response = await feedService.getFeed(page, 10);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load feed"
      );
    }
  }
);

export const refreshFeedThunk = createAsyncThunk(
  "feed/refreshFeed",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { feed: FeedState };
      if (state.feed.activeTab !== "home") {
        await new Promise((resolve) => setTimeout(resolve, 600));
        let mockPosts: Post[] = [];
        if (state.feed.activeTab === "trending") mockPosts = MOCK_TRENDING_POSTS;
        else if (state.feed.activeTab === "following") mockPosts = MOCK_FOLLOWING_POSTS;
        else if (state.feed.activeTab === "recommended") mockPosts = MOCK_RECOMMENDED_POSTS;

        return {
          posts: mockPosts,
          totalPosts: mockPosts.length,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        };
      }

      const response = await feedService.getFeed(1, 10);
      return response;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to refresh feed"
      );
    }
  }
);

const initialState: FeedState = {
  posts: [],
  loading: false,
  refreshing: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  activeTab: "home",
  readingProgress: {},
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<FeedTab>) => {
      state.activeTab = action.payload;
      state.posts = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasNextPage = false;
      state.error = null;
    },
    updateReadingProgress: (
      state,
      action: PayloadAction<{ postId: string; progress: number }>
    ) => {
      const { postId, progress } = action.payload;
      state.readingProgress[postId] = Math.min(100, Math.max(0, Math.round(progress)));
    },
    clearFeedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Feed
    builder.addCase(fetchFeedThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeedThunk.fulfilled, (state, action) => {
      state.loading = false;
      const newPosts = action.payload.posts;

      // Deduplicate posts
      if (state.currentPage === 1 || state.activeTab !== "home") {
        state.posts = newPosts;
      } else {
        const existingIds = new Set(state.posts.map((p) => p._id));
        const filteredNewPosts = newPosts.filter((p) => !existingIds.has(p._id));
        state.posts = [...state.posts, ...filteredNewPosts];
      }

      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(fetchFeedThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh Feed
    builder.addCase(refreshFeedThunk.pending, (state) => {
      state.refreshing = true;
      state.error = null;
    });
    builder.addCase(refreshFeedThunk.fulfilled, (state, action) => {
      state.refreshing = false;
      state.posts = action.payload.posts;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasNextPage = action.payload.hasNextPage;
    });
    builder.addCase(refreshFeedThunk.rejected, (state, action) => {
      state.refreshing = false;
      state.error = action.payload as string;
    });
  },
});

export const { setTab, updateReadingProgress, clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
