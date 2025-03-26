import { create } from "zustand";
import { api } from "./authStore";
import {
  Comment,
  CommentResponse,
  CommentsResponse,
  CreateCommentData,
  UpdateCommentData,
} from "@/types/comment.types";

interface CommentState {
  comments: Record<
    string,
    { items: Comment[]; totalPages: number; currentPage: number }
  >;
  isLoading: boolean;
  error: string | null;

  fetchComments: (
    postId: string,
    page?: number,
    limit?: number
  ) => Promise<Comment[]>;
  createComment: (commentData: CreateCommentData) => Promise<Comment | null>;
  updateComment: (
    commentId: string,
    updateData: UpdateCommentData
  ) => Promise<Comment | null>;
  deleteComment: (commentId: string, postId: string) => Promise<boolean>;
  clearComments: (postId?: string) => void;
  clearError: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},
  isLoading: false,
  error: null,

  // Query comments list
  fetchComments: async (postId: string, page = 1, limit = 20) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await api.get<CommentsResponse>(
        `/comments/post/${postId}`,
        {
          params: { page, limit },
        }
      );

      const { comments, meta } = response.data;

      set((state) => {
        const existingComments =
          page === 1 ? [] : state.comments[postId]?.items || [];

        return {
          comments: {
            ...state.comments,
            [postId]: {
              items: [...existingComments, ...comments],
              totalPages: meta.totalPages,
              currentPage: page,
            },
          },
          isLoading: false,
        };
      });

      return comments;
    } catch (error: any) {
      console.error("Fetch comments error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch comments",
      });
      return [];
    }
  },

  // Create comment
  createComment: async (commentData: CreateCommentData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<CommentResponse>(
        "/comments",
        commentData
      );
      const newComment = response.data.comment;

      // update comments list
      set((state) => {
        const postComments = state.comments[commentData.postId] || {
          items: [],
          totalPages: 1,
          currentPage: 1,
        };

        return {
          comments: {
            ...state.comments,
            [commentData.postId]: {
              ...postComments,
              items: [newComment, ...postComments.items],
            },
          },
          isLoading: false,
        };
      });

      return newComment;
    } catch (error: any) {
      console.error("Create comment error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create comment",
      });
      return null;
    }
  },

  // Update comment
  updateComment: async (commentId: string, updateData: UpdateCommentData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<CommentResponse>(
        `/comments/${commentId}`,
        updateData
      );
      const updatedComment = response.data.comment;

      // Update comments list
      set((state) => {
        const newComments = { ...state.comments };

        Object.keys(newComments).forEach((postId) => {
          const postComments = newComments[postId];

          const updatedItems = postComments.items.map((comment) =>
            comment.id === commentId ? updatedComment : comment
          );

          if (updatedItems.some((c) => c.id === commentId)) {
            newComments[postId] = {
              ...postComments,
              items: updatedItems,
            };
          }
        });

        return {
          comments: newComments,
          isLoading: false,
        };
      });

      return updatedComment;
    } catch (error: any) {
      console.error("Update comment error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update comment",
      });
      return null;
    }
  },

  // Delete comment
  deleteComment: async (commentId: string, postId: string) => {
    set({ isLoading: true, error: null });

    try {
      await api.delete(`/comments/${commentId}`);

      // delete comment from the list
      set((state) => {
        const postComments = state.comments[postId];

        if (!postComments) {
          return { isLoading: false };
        }

        return {
          comments: {
            ...state.comments,
            [postId]: {
              ...postComments,
              items: postComments.items.filter(
                (comment) => comment.id !== commentId
              ),
            },
          },
          isLoading: false,
        };
      });

      return true;
    } catch (error: any) {
      console.error("Delete comment error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete comment",
      });
      return false;
    }
  },

  // Clear comments
  clearComments: (postId?: string) => {
    if (postId) {
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: { items: [], totalPages: 1, currentPage: 1 },
        },
      }));
    } else {
      set({ comments: {} });
    }
  },

  clearError: () => set({ error: null }),
}));
