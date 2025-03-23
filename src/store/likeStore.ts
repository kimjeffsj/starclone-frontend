import { create } from "zustand";
import { api } from "./authStore";
import {
  LikeResponse,
  LikeStatus,
  LikesListResponse,
} from "@/types/like.types";
import { User } from "@/types/auth.types";
import { usePostsStore } from "./postStore";

interface LikeState {
  likedPosts: Record<string, boolean>; // postId -> liked status
  likeUsers: Record<string, { users: User[]; hasMore: boolean }>; // postId -> List of liked users
  isLoading: boolean;
  error: string | null;

  likePost: (postId: string) => Promise<LikeResponse>;
  unlikePost: (postId: string) => Promise<LikeResponse>;
  checkLikeStatus: (postId: string) => Promise<boolean>;
  fetchLikeUsers: (
    postId: string,
    page?: number,
    limit?: number
  ) => Promise<User[]>;
  updatePostLikeStatus: (
    postId: string,
    liked: boolean,
    likeCount: number
  ) => void;
  clearError: () => void;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedPosts: {},
  likeUsers: {},
  isLoading: false,
  error: null,

  // Like post
  likePost: async (postId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<LikeResponse>("/likes", { postId });

      // Like status update
      set((state) => ({
        likedPosts: { ...state.likedPosts, [postId]: true },
        isLoading: false,
      }));

      get().updatePostLikeStatus(postId, true, response.data.likeCount);

      return response.data;
    } catch (error: any) {
      console.error("Like post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to like post",
      });
      throw error;
    }
  },

  // Unlike post
  unlikePost: async (postId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete<LikeResponse>(`/likes/${postId}`);

      // Like status update
      set((state) => ({
        likedPosts: { ...state.likedPosts, [postId]: false },
        isLoading: false,
      }));

      // 게시물 상태 업데이트
      get().updatePostLikeStatus(postId, false, response.data.likeCount);

      return response.data;
    } catch (error: any) {
      console.error("Unlike post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to unlike post",
      });
      throw error;
    }
  },

  // Check Like status
  checkLikeStatus: async (postId: string) => {
    set((state) => ({
      isLoading: state.likedPosts[postId] === undefined ? true : false,
      error: null,
    }));

    try {
      const response = await api.get<LikeStatus>(`/likes/status/${postId}`);
      const isLiked = response.data.liked;

      // Like status update
      set((state) => ({
        likedPosts: { ...state.likedPosts, [postId]: isLiked },
        isLoading: false,
      }));

      const postsStore = usePostsStore.getState();
      const post = postsStore.posts.find((p) => p.id === postId);

      if (post && post.isLiked !== isLiked) {
        postsStore.updatePostLikeStatus(postId, isLiked);
      }

      return isLiked;
    } catch (error: any) {
      console.error("Check like status error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to check like status",
      });
      return false;
    }
  },

  // Fetch liked user list
  fetchLikeUsers: async (postId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<LikesListResponse>(
        `/likes/post/${postId}`,
        {
          params: { page, limit },
        }
      );

      const users = response.data.likes;
      const hasMore = page < response.data.meta.totalPages;

      if (page === 1) {
        set((state) => ({
          likeUsers: {
            ...state.likeUsers,
            [postId]: { users, hasMore },
          },
        }));
      } else {
        set((state) => {
          const existingUsers = state.likeUsers[postId]?.users || [];
          return {
            likeUsers: {
              ...state.likeUsers,
              [postId]: {
                users: [...existingUsers, ...users],
                hasMore,
              },
            },
          };
        });
      }

      set({ isLoading: false });
      return users;
    } catch (error: any) {
      console.error("Fetch like users error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch likes",
      });
      return [];
    }
  },

  updatePostLikeStatus: (
    postId: string,
    liked: boolean,
    likeCount?: number
  ) => {
    const postsStore = usePostsStore.getState();
    postsStore.updatePostLikeStatus(postId, liked, likeCount);
  },

  clearError: () => set({ error: null }),
}));
