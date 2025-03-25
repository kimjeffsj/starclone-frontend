import { User } from "./auth.types";
import { Meta } from "./common.types";

export interface Comment {
  id: string;
  content: string;
  user: User;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentResponse {
  comment: Comment;
  message?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  meta: Meta;
}
