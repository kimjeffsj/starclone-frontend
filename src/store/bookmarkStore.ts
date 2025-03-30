import { create } from "zustand";
import { api } from "./authStore";

import { Post } from "@/types/post.types";
import { usePostsStore } from "./postStore";
import {
  BookmarkResponse,
  BookmarksResponse,
  BookmarkStatus,
} from "@/types/bookmark.type";

interface BookmarkState {
  bookmarkedPosts: Record<string, boolean>; // postId -> bookmarked status
  bookmarks: Post[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;

  addBookmark: (postId: string) => Promise<BookmarkResponse>;
  removeBookmark: (postId: string) => Promise<BookmarkResponse>;
  checkBookmarkStatus: (postId: string) => Promise<boolean>;
  fetchBookmarks: (page?: number, limit?: number) => Promise<Post[]>;
  updatePostBookmarkStatus: (postId: string, bookmarked: boolean) => void;
  clearError: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedPosts: {},
  bookmarks: [],
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  // Add Bookmark
  addBookmark: async (postId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<BookmarkResponse>("/bookmarks", {
        postId,
      });

      // Bookmark status update
      set((state) => ({
        bookmarkedPosts: { ...state.bookmarkedPosts, [postId]: true },
        isLoading: false,
      }));

      get().updatePostBookmarkStatus(postId, true);

      return response.data;
    } catch (error: any) {
      console.error("Add bookmark error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to bookmark post",
      });
      throw error;
    }
  },

  // Remove bookmark
  removeBookmark: async (postId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete<BookmarkResponse>(
        `/bookmarks/${postId}`
      );

      // Bookmark status update
      set((state) => ({
        bookmarkedPosts: { ...state.bookmarkedPosts, [postId]: false },
        isLoading: false,
      }));

      get().updatePostBookmarkStatus(postId, false);

      return response.data;
    } catch (error: any) {
      console.error("Remove bookmark error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to remove bookmark",
      });
      throw error;
    }
  },

  // Check bookmark status
  checkBookmarkStatus: async (postId: string) => {
    set((state) => ({
      isLoading: state.bookmarkedPosts[postId] === undefined ? true : false,
      error: null,
    }));

    try {
      const response = await api.get<BookmarkStatus>(
        `/bookmarks/status/${postId}`
      );
      const isBookmarked = response.data.bookmarked;

      set((state) => ({
        bookmarkedPosts: { ...state.bookmarkedPosts, [postId]: isBookmarked },
        isLoading: false,
      }));

      const postsStore = usePostsStore.getState();
      const post = postsStore.posts.find((p) => p.id === postId);

      if (post && post.isBookmarked !== isBookmarked) {
        postsStore.updatePostBookmarkStatus(postId, isBookmarked);
      }

      return isBookmarked;
    } catch (error: any) {
      console.error("Check bookmark status error:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Failed to check bookmark status",
      });
      return false;
    }
  },

  // Get bookmarks
  fetchBookmarks: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<BookmarksResponse>("/bookmarks", {
        params: { page, limit },
      });

      if (page === 1) {
        set({
          bookmarks: response.data.posts,
          totalPages: response.data.meta.totalPages,
          currentPage: page,
          isLoading: false,
        });
      } else {
        set((state) => ({
          bookmarks: [...state.bookmarks, ...response.data.posts],
          totalPages: response.data.meta.totalPages,
          currentPage: page,
          isLoading: false,
        }));
      }

      return response.data.posts;
    } catch (error: any) {
      console.error("Fetch bookmarks error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch bookmarks",
      });
      return [];
    }
  },

  // Update bookmark status of the post
  updatePostBookmarkStatus: (postId: string, bookmarked: boolean) => {
    const postsStore = usePostsStore.getState();
    postsStore.updatePostBookmarkStatus(postId, bookmarked);
  },

  clearError: () => set({ error: null }),
}));
