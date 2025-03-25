import { User } from "./auth.types";
import { Meta } from "./common.types";

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
  meta: Meta;
}
