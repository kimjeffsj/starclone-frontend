import { create } from "zustand";
import { api } from "./authStore";
import {
  FollowCountsResponse,
  FollowResponse,
  FollowStatus,
  FollowersResponse,
  FollowingResponse,
} from "@/types/follow.types";
import { User } from "@/types/auth.types";

interface FollowState {
  followStatus: Record<string, boolean>;
  followers: Record<string, { users: User[]; hasMore: boolean; total: number }>;
  following: Record<string, { users: User[]; hasMore: boolean; total: number }>;
  counts: Record<string, { followers: number; following: number }>;
  isLoading: boolean;
  error: string | null;

  followUser: (username: string) => Promise<FollowResponse>;
  unfollowUser: (username: string) => Promise<FollowResponse>;
  checkFollowStatus: (username: string) => Promise<boolean>;
  getFollowers: (
    username: string,
    page?: number,
    limit?: number
  ) => Promise<User[]>;
  getFollowing: (
    username: string,
    page?: number,
    limit?: number
  ) => Promise<User[]>;
  getFollowCounts: (username: string) => Promise<FollowCountsResponse>;
  clearError: () => void;
}

export const useFollowStore = create<FollowState>((set) => ({
  followStatus: {},
  followers: {},
  following: {},
  counts: {},
  isLoading: false,
  error: null,

  // Follow a user
  followUser: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<FollowResponse>("/follows", { username });

      // Update follow status
      set((state) => ({
        followStatus: { ...state.followStatus, [username]: true },
        isLoading: false,
      }));

      return response.data;
    } catch (error: any) {
      console.error("Follow user error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to follow user",
      });
      throw error;
    }
  },

  // Unfollow a user
  unfollowUser: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete<FollowResponse>(`/follows/${username}`);

      // Update follow status
      set((state) => ({
        followStatus: { ...state.followStatus, [username]: false },
        isLoading: false,
      }));

      return response.data;
    } catch (error: any) {
      console.error("Unfollow user error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to unfollow user",
      });
      throw error;
    }
  },

  // Check follow status
  checkFollowStatus: async (username: string) => {
    set((state) => ({
      isLoading: state.followStatus[username] === undefined ? true : false,
      error: null,
    }));

    try {
      const response = await api.get<FollowStatus>(
        `/follows/status/${username}`
      );
      const following = response.data.following;

      // Update follow status
      set((state) => ({
        followStatus: { ...state.followStatus, [username]: following },
        isLoading: false,
      }));

      return following;
    } catch (error: any) {
      console.error("Check follow status error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to check follow status",
      });
      return false;
    }
  },

  // Get followers
  getFollowers: async (username: string, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<FollowersResponse>(
        `/follows/followers/${username}`,
        {
          params: { page, limit },
        }
      );

      const users = response.data.followers;
      const total = response.data.meta.total;
      const hasMore = page < response.data.meta.totalPages;

      if (page === 1) {
        set((state) => ({
          followers: {
            ...state.followers,
            [username]: { users, hasMore, total },
          },
          isLoading: false,
        }));
      } else {
        set((state) => {
          const existingUsers = state.followers[username]?.users || [];
          return {
            followers: {
              ...state.followers,
              [username]: {
                users: [...existingUsers, ...users],
                hasMore,
                total,
              },
            },
            isLoading: false,
          };
        });
      }

      return users;
    } catch (error: any) {
      console.error("Get followers error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get followers",
      });
      return [];
    }
  },

  // Get following
  getFollowing: async (username: string, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<FollowingResponse>(
        `/follows/following/${username}`,
        {
          params: { page, limit },
        }
      );

      const users = response.data.following;
      const total = response.data.meta.total;
      const hasMore = page < response.data.meta.totalPages;

      if (page === 1) {
        set((state) => ({
          following: {
            ...state.following,
            [username]: { users, hasMore, total },
          },
          isLoading: false,
        }));
      } else {
        set((state) => {
          const existingUsers = state.following[username]?.users || [];
          return {
            following: {
              ...state.following,
              [username]: {
                users: [...existingUsers, ...users],
                hasMore,
                total,
              },
            },
            isLoading: false,
          };
        });
      }

      return users;
    } catch (error: any) {
      console.error("Get following error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get following",
      });
      return [];
    }
  },

  // Get follow counts
  getFollowCounts: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<FollowCountsResponse>(
        `/follows/counts/${username}`
      );

      // Update counts
      set((state) => ({
        counts: {
          ...state.counts,
          [username]: {
            followers: response.data.followersCount,
            following: response.data.followingCount,
          },
        },
        isLoading: false,
      }));

      return response.data;
    } catch (error: any) {
      console.error("Get follow counts error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to get follow counts",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
