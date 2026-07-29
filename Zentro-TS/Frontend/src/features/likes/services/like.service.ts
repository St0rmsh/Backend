import { axiosInstance } from "@/shared/lib/axios";

interface LikeResponse {
  message: string;
  success: boolean;
  data: {
    message: string;
    // other fields if returned by like service
  };
}

export const likeService = {
  /**
   * Toggle like on a post.
   * POST /api/like/:postId
   */
  toggleLike: async (postId: string): Promise<LikeResponse> => {
    const response = await axiosInstance.post<LikeResponse>(`/like/${postId}`);
    return response.data;
  },
};
