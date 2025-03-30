import { Meta } from "./common.types";
import { Post } from "./post.types";

export interface BookmarkStatus {
  bookmarked: boolean;
}

export interface BookmarkResponse {
  success: boolean;
  message?: string;
}

export interface BookmarksResponse {
  posts: Post[];
  meta: Meta;
}
