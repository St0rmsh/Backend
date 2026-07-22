import { api } from "@/shared/lib/axios";
import { ApiResponse } from "@/shared/utils/response";
import { Comment, PaginatedComments } from "../types/comment.types";

export const commentService = {
  getComments: async (postId: string, page = 1, limit = 10) => {
    // The backend endpoint returns `{ message, success, comments: { comments, totalComments, ... } }` 
    // because we spread the getCommentService result in the controller.
    const response = await api.get<ApiResponse<PaginatedComments>>(`/comment/post/${postId}`, {
      params: { page, limit },
    });
    
    // Actually the backend response structure is: 
    // { message, success, comments, totalComments, totalPages, currentPage, limit, hasNextPage, hasPrevPage }
    // Let's type it effectively by asserting the data format.
    return response.data as unknown as PaginatedComments & ApiResponse<unknown>;
  },

  createComment: async (postId: string, content: string) => {
    const response = await api.post<ApiResponse<Comment>>(`/comment/post/${postId}`, {
      content,
    });
    return response.data;
  },

  updateComment: async (commentId: string, content: string) => {
    const response = await api.patch<ApiResponse<Comment>>(`/comment/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete<ApiResponse<Comment>>(`/comment/${commentId}`);
    return response.data;
  },
};
