import { User } from "./auth.types";

export interface LikeStatus {
  liked: boolean;
}

export interface LikeResponse {
  success: boolean;
  likeCount: number;
  message?: string;
}

export interface LikesListResponse {
  likes: User[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
