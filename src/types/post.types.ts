import { User } from "./auth.types";
import { Meta } from "./common.types";
import { Media } from "./media.types";

export interface Post {
  id: string;
  caption?: string;
  location?: string;
  user: User;
  media: Media[];
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  isLiked?: boolean;
}

export interface CreatePostData {
  caption?: string;
  location?: string;
  mediaIds: string[];
}

export interface UpdatePostData {
  caption?: string;
  location?: string;
  mediaIds?: string[];
  removeMediaIds?: string[];
}

export interface PostResponse {
  post: Post;
  message?: string;
}

export interface PostsResponse {
  posts: Post[];
  meta: Meta;
}
