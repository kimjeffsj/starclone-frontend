export interface Media {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  type: string;
  width?: number;
  height?: number;
  order: number;
}

export interface MediaUploadOptions {
  type: "profile" | "post";
  postId?: string;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}
