import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideo,
  fetchVideos,
  fetchComments,
  createComment,
  reactVideo,
  fetchUserReaction
} from "../ytSlice";

export const useYT = () => {
  const dispatch = useDispatch();

  // ✅ SAFE SELECTOR (NO CRASH)
  const videoState = useSelector((state) => state?.video);

  // ✅ EXTRA SAFETY (IMPORTANT)
  if (!videoState) {
    return {
      video: null,
      videos: [],
      comments: [],
      liked: false,
      disliked: false,

      fetchVideo: () => {},
      fetchVideos: () => {},
      fetchComments: () => {},
      createComment: () => {},
      reactVideo: () => {},
      fetchUserReaction: () => {}
    };
  }

  return {
    video: videoState.video,
    videos: videoState.videos,
    comments: videoState.comments,
    liked: videoState.liked,
    disliked: videoState.disliked,

    fetchVideo: (id) => dispatch(fetchVideo(id)),
    fetchVideos: () => dispatch(fetchVideos()),
    fetchComments: (id) => dispatch(fetchComments(id)),
    createComment: (data) => dispatch(createComment(data)),
    reactVideo: (data) => dispatch(reactVideo(data)),
    fetchUserReaction: (id) => dispatch(fetchUserReaction(id))
  };
};
