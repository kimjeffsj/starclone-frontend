import { create } from "zustand";
import { api } from "./authStore";
import { Media, MediaResponse, MediaUploadOptions } from "@/types/media.types";

export interface PreviewMedia {
  id: string; // Local id
  file: File;
  previewUrl: string;
  isUploaded: boolean;
}

export interface MediaState {
  uploadedMedia: Media[];
  previewMedia: PreviewMedia[]; // local preview
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;

  addPreview: (files: File[]) => void;
  removePreview: (previewId: string) => void;
  clearPreviews: () => void;

  uploadAllPreviews: (options: MediaUploadOptions) => Promise<Media[]>;

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
  previewMedia: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,

  // Add preview
  addPreview: (files: File[]) => {
    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      isUploaded: false,
    }));

    set((state) => ({
      previewMedia: [...state.previewMedia, ...newPreviews],
    }));
  },

  // Delete preview
  removePreview: (previewId: string) => {
    set((state) => {
      // delete preview url
      const previewToRemove = state.previewMedia.find(
        (p) => p.id === previewId
      );
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.previewUrl);
      }

      return {
        previewMedia: state.previewMedia.filter((p) => p.id !== previewId),
      };
    });
  },

  // Delete all previews
  clearPreviews: () => {
    const { previewMedia } = get();

    // delete all preview urls
    previewMedia.forEach((preview) => {
      URL.revokeObjectURL(preview.previewUrl);
    });

    set({ previewMedia: [] });
  },

  // Upload all previews to server
  uploadAllPreviews: async (options: MediaUploadOptions) => {
    const { previewMedia } = get();
    set({ isUploading: true, uploadProgress: 0 });

    const uploadedItems: Media[] = [];
    const totalFiles = previewMedia.length;
    let processedCount = 0;

    try {
      for (const preview of previewMedia) {
        if (!preview.isUploaded) {
          const media = await get().uploadMedia(preview.file, options);
          if (media) {
            uploadedItems.push(media);

            // change states to uploaded
            set((state) => ({
              previewMedia: state.previewMedia.map((p) =>
                p.id === preview.id ? { ...p, isUploaded: true } : p
              ),
            }));
          }
        }

        processedCount++;
        const percentCompleted = Math.round(
          (processedCount * 100) / totalFiles
        );
        set({ uploadProgress: percentCompleted });
      }

      // Clear preview after uploaded
      get().clearPreviews();

      set({ isUploading: false, uploadProgress: 100 });
      return uploadedItems;
    } catch (error) {
      console.error("Failed to upload previews:", error);
      set({
        isUploading: false,
        error: error instanceof Error ? error.message : "Upload failed",
      });
      return [];
    }
  },

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

      const response = await api.post<MediaResponse>(
        "/media/upload",
        formData,
        {
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
        } as any
      );

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
      await api.delete(`/media/${mediaId}`);

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
