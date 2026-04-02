import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getVideoById,
  getAllVideos,
  addComment,
  getComments,
  toggleReaction,
  getUserReaction
} from "./services/ytapi.service";

// FETCH VIDEO
export const fetchVideo = createAsyncThunk(
  "video/fetchVideo",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getVideoById(id);


      // ✅ ONLY RETURN VIDEO OBJECT
      return res.data.video;

    } catch (err) {
      console.error(err);
      return rejectWithValue(err.response?.data);
    }
  }
);


// FETCH VIDEOS
export const fetchVideos = createAsyncThunk("video/fetchVideos", async () => {
  const res = await getAllVideos();
  return res.data.videos || [];
});

// FETCH COMMENTS
export const fetchComments = createAsyncThunk(
  "video/fetchComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await getComments(videoId);
      return res.data.comments || [];
    } catch {
      return [];
    }
  }
);

// ADD COMMENT
export const createComment = createAsyncThunk(
  "video/createComment",
  async ({ videoId, text }) => {
    const res = await addComment(videoId, text);
    return res.data.comment;
  }
);

// REACT
export const reactVideo = createAsyncThunk(
  "video/reactVideo",
  async ({ videoId, type }) => {
    const res = await toggleReaction(videoId, type);
    return res.data;
  }
);

// USER REACTION
export const fetchUserReaction = createAsyncThunk(
  "video/fetchUserReaction",
  async (videoId) => {
    const res = await getUserReaction(videoId);
    return res.data;
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState: {
    video: null,
    videos: [],
    comments: [],
    liked: false,
    disliked: false
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchVideo.fulfilled, (state, action) => {

        if (!action.payload?._id) return;

        // 🔥 FORCE NEW OBJECT (important for re-render)
        state.video = { ...action.payload };
      })


      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })

      .addCase(reactVideo.fulfilled, (state, action) => {
        const { likes, dislikes, userReaction } = action.payload;

        if (state.video) {
          state.video.likesCount = likes;
          state.video.dislikesCount = dislikes;
        }

        state.liked = userReaction === "LIKE";
        state.disliked = userReaction === "DISLIKE";
      })

      .addCase(fetchUserReaction.fulfilled, (state, action) => {
        const r = action.payload?.reaction;
        state.liked = r === "LIKE";
        state.disliked = r === "DISLIKE";
      });
  }
});

export default videoSlice.reducer;
