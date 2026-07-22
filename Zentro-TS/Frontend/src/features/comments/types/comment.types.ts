export interface CommentUser {
  _id: string;
  fullname: string;
  username: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: CommentUser;
  post: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComments {
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentComment?: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  content: string;
}

export interface CommentState {
  commentsByPost: Record<string, PaginatedComments>;
  loading: boolean;
  error: string | null;
  creating: boolean;
  deletingId: string | null;
}
