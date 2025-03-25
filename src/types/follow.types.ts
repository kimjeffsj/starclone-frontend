import { User } from "./auth.types";
import { Meta } from "./common.types";

export interface FollowStatus {
  following: boolean;
}

export interface FollowResponse {
  success: boolean;
  message?: string;
}

export interface FollowersResponse {
  followers: User[];
  meta: Meta;
}

export interface FollowingResponse {
  following: User[];
  meta: Meta;
}

export interface FollowCountsResponse {
  username: string;
  followersCount: number;
  followingCount: number;
}
