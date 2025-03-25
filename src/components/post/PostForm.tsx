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
import { FormInput, formSchema } from "./validations/post.schema";
import { usePostsStore } from "@/store/postStore";
import { toast } from "sonner";
import MediaUploader from "../shared/media/MediaUploader";

const PostForm = () => {
  const { id } = useParams(); // Post ID used in edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  // List of media IDs to remove (only used in edit mode)
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { previewMedia, clearUploadedMedia, clearPreviews, uploadAllPreviews } =
    useMediaStore();

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
      clearPreviews();
    };
  }, [
    isEditMode,
    id,
    fetchPostById,
    clearCurrentPost,
    clearUploadedMedia,
    clearPreviews,
  ]);

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
    // 미리보기가 없고 편집 중이 아니거나 기존 이미지를 모두 삭제하려는 경우
    if (
      previewMedia.length === 0 &&
      (!isEditMode ||
        (currentPost?.media &&
          removeMediaIds.length >= currentPost.media.length))
    ) {
      toast.error("Image required", {
        description: "You must have at least one image for your post.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 미리보기 이미지 업로드
      let mediaIds: string[] = [];

      if (previewMedia.length > 0) {
        const options = {
          type: "post" as const,
          postId: id, // 편집 모드일 경우 postId 전달
          resize: {
            width: 1080,
            quality: 80,
          },
        };

        const uploadedItems = await uploadAllPreviews(options);
        mediaIds = uploadedItems.map((media) => media.id);
      }

      // 2. 게시물 생성 또는 업데이트
      if (isEditMode && id) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRemoveMedia = (mediaId: string) => {
    if (removeMediaIds.includes(mediaId)) {
      // 이미 제거 목록에 있으면 제거 취소
      setRemoveMediaIds((prev) => prev.filter((id) => id !== mediaId));
    } else {
      // 제거 목록에 추가
      setRemoveMediaIds((prev) => [...prev, mediaId]);
    }
  };

  if (isEditMode && isLoading && !currentPost) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
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
            {/* 미디어 업로더 */}
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <MediaUploader type="post" multiple={true} showPreview={true} />
            </FormItem>

            {/* 기존 이미지 (편집 모드) */}
            {isEditMode &&
              currentPost?.media &&
              currentPost.media.length > 0 && (
                <FormItem>
                  <FormLabel>Current Images</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {currentPost.media.map((media) => (
                      <div
                        key={media.id}
                        className={`
                        relative group overflow-hidden rounded-md aspect-square
                        ${removeMediaIds.includes(media.id) ? "opacity-50" : ""}
                      `}
                      >
                        <img
                          src={media.mediaUrl}
                          alt="Media"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant={
                              removeMediaIds.includes(media.id)
                                ? "secondary"
                                : "destructive"
                            }
                            size="sm"
                            onClick={() => toggleRemoveMedia(media.id)}
                          >
                            {removeMediaIds.includes(media.id)
                              ? "Keep"
                              : "Remove"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </FormItem>
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                  ? "Update"
                  : "Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
