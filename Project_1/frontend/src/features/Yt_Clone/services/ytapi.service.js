import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});


// =======================
// 🎥 VIDEO APIs
// =======================

// Upload video
export const uploadVideo = (formData, config = {}) => {
    return api.post("/api/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        ...config   // ✅ THIS FIXES PROGRESS
    });
};


export const getMyVideos = () => {
  return api.get("/api/video/me");
};


// Get all videos
export const getAllVideos = () => {
    return api.get("/api/video");
};

// Get single video
export const getVideoById = (id) => {
    return api.get(`/api/video/${id}`);
};

// Add view
export const addView = (videoId) => {
    return api.post(`/api/video/${videoId}/view`);
};

// Update watch time
export const updateWatchTime = async (videoId, time) => {
  return api.post(`/api/video/${videoId}/watch`, {
    videoId,
    time   // ✅ FIXED (not watchTime)
  });
};

// ✅ GET RESUME TIME
export const getWatchTime = (videoId) => {
  return api.get(`/api/video/${videoId}/watch`);
};



// =======================
// 💬 COMMENT APIs
// =======================

// Add comment
export const addComment = (videoId, text) => {
    return api.post(`/api/comment/${videoId}/comment`, { text });
};

// Get comments
export const getComments = (videoId) => {
    return api.get(`/api/comment/${videoId}`);
};

// Delete comment
export const deleteComment = (commentId) => {
    return api.delete(`/api/comment/${commentId}`);
};



// =======================
// ❤️ LIKE / REACTION APIs
// =======================

// Toggle like/dislike
export const toggleReaction = (videoId, type) => {
    return api.post(`/api/like/${videoId}/react`, { type }); 
    // type: "like" | "dislike"
};

// Get current user's reaction
export const getUserReaction = (videoId) => {
    return api.get(`/api/like/${videoId}/me`);
};



// =======================
// 📺 CHANNEL APIs
// =======================

// Create channel
export const createChannel = ({ name, handle, description }) => {
    return api.post("/api/channel/create", { name, handle, description });
};

// Get my channel
export const getMyChannel = () => {
    return api.get("/api/channel/me");
};

// Get channel by handle
export const getChannelByHandle = (handle) => {
    return api.get(`/api/channel/${handle}`);
};

// Get channel videos
export const getChannelVideos = (handle) => {
    return api.get(`/api/channel/${handle}/videos`);
};

// Update channel
export const updateChannel = ({name, description, avatar, banner}) => {
    return api.put("/api/channel/update", {name, description, avatar, banner});
};



// =======================
// 🔔 SUBSCRIPTION APIs
// =======================

// Subscribe / Unsubscribe
export const toggleSubscribe = (channelId) => {
    return api.post(`/api/subscription/${channelId}/toggle`);
};

// Get subscriber count
export const getSubscribersCount = (channelId) => {
    return api.get(`/api/subscription/${channelId}/count`);
};

// Get my subscriptions
export const getUserSubscriptions = () => {
    return api.get("/api/subscription/me");
};

// Get channel subscribers
export const getChannelSubscribers = (channelId) => {
    return api.get(`/api/subscription/${channelId}/list`);
};

// Check if subscribed
export const isSubscribed = (channelId) => {
    return api.get(`/api/subscription/${channelId}/is-subscribed`);
};

