import { create } from "zustand";
import { api } from "./authStore";
import { CreatePostData, Post, UpdatePostData } from "@/types/post.types";

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchPosts: (page?: number, userId?: string) => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  createPost: (postData: CreatePostData) => Promise<Post | null>;
  updatePost: (id: string, postData: UpdatePostData) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  updateMediaOrder: (
    postId: string,
    mediaOrder: { mediaId: string; order: number }[]
  ) => Promise<Post | null>;
  clearCurrentPost: () => void;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  // Fetch post list
  fetchPosts: async (page = 1, userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params: any = { page, limit: 10 };
      if (userId) params.userId = userId;

      const response = await api.get("/posts", { params });

      set({
        posts: response.data.posts,
        totalPages: response.data.meta.totalPages,
        currentPage: page,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Fetch posts error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch posts",
      });
    }
  },

  // Fetch post details
  fetchPostById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/posts/${id}`);
      set({ currentPost: response.data.post, isLoading: false });
    } catch (error: any) {
      console.error("Fetch post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch post",
      });
    }
  },

  // Create post
  createPost: async (postData: CreatePostData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/posts", postData);

      // Add new post to the current post list
      const posts = [response.data.post, ...get().posts];
      set({ posts, isLoading: false });

      return response.data.post;
    } catch (error: any) {
      console.error("Create post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create post",
      });
      return null;
    }
  },

  // Update post
  updatePost: async (id: string, postData: UpdatePostData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/posts/${id}`, postData);

      // Update post list and current post
      const updatedPost = response.data.post;
      const posts = get().posts.map((post) =>
        post.id === id ? updatedPost : post
      );

      set({
        posts,
        currentPost: updatedPost,
        isLoading: false,
      });

      return updatedPost;
    } catch (error: any) {
      console.error("Update post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update post",
      });
      return null;
    }
  },

  // Delete post
  deletePost: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/posts/${id}`);

      // Remove deleted post from the post list
      const posts = get().posts.filter((post) => post.id !== id);
      set({ posts, isLoading: false });

      return true;
    } catch (error: any) {
      console.error("Delete post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete post",
      });
      return false;
    }
  },

  // Update media order
  updateMediaOrder: async (
    postId: string,
    mediaOrder: { mediaId: string; order: number }[]
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(
        `/posts/${postId}/media-order`,
        mediaOrder
      );

      // Update current post
      const updatedPost = response.data.post;

      // Update post list
      const posts = get().posts.map((post) =>
        post.id === postId ? updatedPost : post
      );

      set({
        posts,
        currentPost: updatedPost,
        isLoading: false,
      });

      return updatedPost;
    } catch (error: any) {
      console.error("Update media order error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update media order",
      });
      return null;
    }
  },

  // Clear current post
  clearCurrentPost: () => set({ currentPost: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));
