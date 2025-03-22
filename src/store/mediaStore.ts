import { create } from "zustand";
import { api } from "./authStore";
import { Media, MediaUploadOptions } from "@/types/media.types";

export interface MediaState {
  uploadedMedia: Media[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;

  uploadMedia: (
    file: File,
    options: MediaUploadOptions
  ) => Promise<Media | null>;
  uploadMultipleMedia: (
    files: File[],
    options: MediaUploadOptions
  ) => Promise<Media[]>;
  deleteMedia: (mediaId: string) => Promise<boolean>;
  clearUploadedMedia: () => void;
  clearError: () => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  uploadedMedia: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,

  // Upload single image
  uploadMedia: async (file: File, options: MediaUploadOptions) => {
    set({ isUploading: true, uploadProgress: 0, error: null });

    try {
      const formData = new FormData();
      formData.append("image", file);

      formData.append("type", options.type);
      if (options.postId) formData.append("postId", options.postId);
      if (options.resize)
        formData.append("resize", JSON.stringify(options.resize));

      const response = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            set({ uploadProgress: percentCompleted });
          }
        },
      });

      const media = response.data.media;
      const uploadedMedia = [...get().uploadedMedia, media];

      set({ uploadedMedia, isUploading: false, uploadProgress: 100 });
      return media;
    } catch (error: any) {
      console.error("Upload media error:", error);
      set({
        isUploading: false,
        error: error.response?.data?.message || "Failed to upload media",
      });
      return null;
    }
  },

  // Upload multiple images
  uploadMultipleMedia: async (files: File[], options: MediaUploadOptions) => {
    set({ isUploading: true, uploadProgress: 0, error: null });

    const uploadedItems: Media[] = [];
    let uploadedCount = 0;
    let hasError = false;

    // Upload each file sequentially
    for (const file of files) {
      try {
        const media = await get().uploadMedia(file, options);
        if (media) {
          uploadedItems.push(media);
        }

        // Update progress (equal distribution)
        uploadedCount++;
        const percentCompleted = Math.round(
          (uploadedCount * 100) / files.length
        );
        set({ uploadProgress: percentCompleted });
      } catch (err) {
        hasError = true;
        console.error("Individual upload failed:", err);
      }
    }

    if (hasError) {
      set({
        error: "Some files failed to upload. Please try again.",
        isUploading: false,
      });
    } else {
      set({
        isUploading: false,
        uploadProgress: 100,
      });
    }

    return uploadedItems;
  },

  // Delete media
  deleteMedia: async (mediaId: string) => {
    try {
      await api.delete("/media", { data: { mediaId } });

      // Remove from the uploaded media list
      const uploadedMedia = get().uploadedMedia.filter(
        (media) => media.id !== mediaId
      );
      set({ uploadedMedia });

      return true;
    } catch (error: any) {
      console.error("Delete media error:", error);
      set({
        error: error.response?.data?.message || "Failed to delete media",
      });
      return false;
    }
  },

  // Clear uploaded media list
  clearUploadedMedia: () => set({ uploadedMedia: [] }),

  // Clear error
  clearError: () => set({ error: null }),
}));
