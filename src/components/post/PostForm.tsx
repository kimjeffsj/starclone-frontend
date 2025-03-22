import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaStore } from "@/store/mediaStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormInput, formSchema } from "./validations/post.schema";
import { usePostsStore } from "@/store/postStore";
import { toast } from "sonner";
import MediaUploader from "../shared/media/MediaUploader";
import MediaPreview from "../shared/media/MediaPreview";

const PostForm = () => {
  const { id } = useParams(); // Post ID used in edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  // List of media IDs to remove (only used in edit mode)
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);
  const { uploadedMedia, clearUploadedMedia } = useMediaStore();
  const {
    currentPost,
    fetchPostById,
    createPost,
    updatePost,
    isLoading,
    error,
    clearCurrentPost,
  } = usePostsStore();

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      location: "",
    },
  });

  // Load existing post information in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchPostById(id);
    }

    return () => {
      clearCurrentPost();
      clearUploadedMedia();
    };
  }, [isEditMode, id, fetchPostById, clearCurrentPost, clearUploadedMedia]);

  // Initialize form with existing post information in edit mode
  useEffect(() => {
    if (isEditMode && currentPost) {
      form.reset({
        caption: currentPost.caption || "",
        location: currentPost.location || "",
      });
    }
  }, [isEditMode, currentPost, form]);

  // Form submission handler
  const onSubmit = async (values: FormInput) => {
    // Uploaded media ID list
    const mediaIds = uploadedMedia.map((media) => media.id);

    try {
      if (isEditMode && id) {
        // Edit mode: Update existing post
        const updateData = {
          ...values,
          mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
          removeMediaIds:
            removeMediaIds.length > 0 ? removeMediaIds : undefined,
        };

        const updatedPost = await updatePost(id, updateData);
        if (updatedPost) {
          toast.success("Post updated", {
            description: "Post has been successfully updated.",
          });
          navigate(`/post/${updatedPost.id}`);
        }
      } else {
        // Create mode: Create new post
        if (mediaIds.length === 0) {
          toast("Image required", {
            description: "You must upload at least one image.",
          });
          return;
        }

        const newPost = await createPost({
          ...values,
          mediaIds,
        });

        if (newPost) {
          toast.success("Post created", {
            description: "New post has been successfully created.",
          });
          navigate(`/post/${newPost.id}`);
        }
      }
    } catch (error: any) {
      toast.error(isEditMode ? "Post update failed" : "Post create failed", {
        description: error.message || "An error occurred. Please try again.",
      });
    }
  };

  // Handle removing existing media (edit mode)
  const handleRemoveExistingMedia = (mediaId: string) => {
    setRemoveMediaIds((prev) => [...prev, mediaId]);
  };

  // Handle undoing removal (edit mode)
  const handleUndoRemove = (mediaId: string) => {
    setRemoveMediaIds((prev) => prev.filter((id) => id !== mediaId));
  };

  if (isEditMode && isLoading && !currentPost) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Post" : "Create New Post"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Edit post content and media"
            : "Upload photos and write content"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Media uploader */}
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <MediaUploader type="post" postId={id} />
            </FormItem>

            {/* Uploaded media preview */}
            {uploadedMedia.length > 0 && (
              <FormItem>
                <FormLabel>Newly Uploaded Images</FormLabel>
                <MediaPreview media={uploadedMedia} showRemoveButton />
              </FormItem>
            )}

            {/* Existing media preview (edit mode) */}
            {isEditMode &&
              currentPost?.media &&
              currentPost.media.length > 0 && (
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Existing Images</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {currentPost.media
                        .filter((media) => !removeMediaIds.includes(media.id))
                        .map((media) => (
                          <div
                            key={media.id}
                            className="relative group overflow-hidden rounded-md aspect-square"
                          >
                            <img
                              src={media.mediaUrl}
                              alt="Media"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRemoveExistingMedia(media.id)
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </FormItem>

                  {/* Display media to be removed */}
                  {removeMediaIds.length > 0 && (
                    <FormItem>
                      <FormLabel>Images to be Removed</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {currentPost.media
                          .filter((media) => removeMediaIds.includes(media.id))
                          .map((media) => (
                            <div
                              key={media.id}
                              className="relative group overflow-hidden rounded-md aspect-square"
                            >
                              <img
                                src={media.mediaUrl}
                                alt="Media"
                                className="w-full h-full object-cover opacity-50"
                              />
                              <Badge className="absolute top-2 right-2 bg-red-500">
                                To Be Removed
                              </Badge>
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleUndoRemove(media.id)}
                                >
                                  Restore
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </FormItem>
                  )}
                </div>
              )}

            {/* Location input */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Add location (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Caption input */}
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter content..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can enter up to 2200 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-destructive text-sm">{error}</div>}

            {/* Submit button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : isEditMode ? "Update" : "Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
