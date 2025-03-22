import { User } from "./auth.types";
import { Media } from "./media.types";

export interface Post {
  id: string;
  caption?: string;
  location?: string;
  user: User;
  media: Media[];
  createdAt: string;
  updatedAt: string;
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
