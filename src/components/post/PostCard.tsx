import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostsStore } from "@/store/postStore";
import { toast } from "sonner";
import ImageCarousel from "../shared/media/ImageCarousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { formatDate } from "@/utils/formatDate.utils";
import { useLikeStore } from "@/store/likeStore";
import LikeUsersModal from "./LikeUsersModal";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import BookmarkButton from "./BookmarkButton";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { Post } from "@/types/post.types";

interface PostCardProps {
  postId?: string; // ID로 포스트를 찾는 경우 (기존 방식)
  post?: Post; // 직접 포스트 객체를 전달하는 경우 (새로운 방식)
}

const PostCard = ({ postId, post: initialPost }: PostCardProps) => {
  const { posts, deletePost, likePost, unlikePost } = usePostsStore();
  const { checkLikeStatus } = useLikeStore();
  const { checkBookmarkStatus } = useBookmarkStore();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const currentPost =
    initialPost || (postId ? posts.find((p) => p.id === postId) : undefined);

  useEffect(() => {
    const checkPostStatuses = async () => {
      try {
        if (currentPost) {
          const id = currentPost.id;

          if (currentPost.isLiked === undefined) {
            await checkLikeStatus(id);
          }

          if (currentPost.isBookmarked === undefined) {
            await checkBookmarkStatus(id);
          }
        }
      } catch (error) {
        console.error("Failed to check post statuses", error);
      }
    };

    checkPostStatuses();
  }, [currentPost, checkLikeStatus, checkBookmarkStatus]);

  if (!currentPost) return null;

  const isAuthor = user?.id === currentPost.user.id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(currentPost.id);
      toast.success("Post deleted", {
        description: "The post has been successfully deleted.",
      });
    } catch (error: any) {
      toast.error("Post delete failed", {
        description: error.message || "Failed to delete the post.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (currentPost.isLiked) {
        await unlikePost(currentPost.id);
        toast.success("Post unliked");
      } else {
        await likePost(currentPost.id);
        toast.success("Post liked");
      }
    } catch (error) {
      toast.error("Action failed", {
        description: "Failed to update like status",
      });
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center space-y-0">
        <Link
          to={`/profile/${currentPost.user.username}`}
          className="flex items-center flex-1"
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={currentPost.user.profileImageUrl}
              alt={currentPost.user.username}
            />
            <AvatarFallback>
              {currentPost.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{currentPost.user.username}</p>
            {currentPost.location && (
              <p className="text-xs text-muted-foreground">
                {currentPost.location}
              </p>
            )}
          </div>
        </Link>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Post Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={`/post/edit/${currentPost.id}`}
                  className="cursor-pointer flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {currentPost.media && currentPost.media.length > 0 && (
        <div className="w-full">
          <ImageCarousel
            images={currentPost.media.filter(
              (media) =>
                media &&
                typeof media === "object" &&
                "mediaUrl" in media &&
                media.mediaUrl
            )}
          />
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLikeToggle}
              className={currentPost.isLiked ? "text-pink-500" : ""}
            >
              <Heart
                className={`h-6 w-6 ${
                  currentPost.isLiked ? "fill-current" : ""
                }`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
          <BookmarkButton
            postId={currentPost.id}
            initialBookmarked={currentPost.isBookmarked}
          />
        </div>

        {currentPost.likeCount !== undefined && currentPost.likeCount > 0 && (
          <div className="mb-4">
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-semibold flex items-center gap-1"
              onClick={() => setShowLikesModal(true)}
            >
              <span>
                {currentPost.likeCount}{" "}
                {currentPost.likeCount === 1 ? "like" : "likes"}
              </span>
            </Button>
          </div>
        )}

        <div className="flex items-start mb-3">
          <Link
            to={`/profile/${currentPost.user.username}`}
            className="font-semibold text-sm mr-2"
          >
            {currentPost.user.username}
          </Link>
          {currentPost.caption && (
            <p className="text-sm whitespace-pre-line">{currentPost.caption}</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {formatDate(currentPost.createdAt)}
        </p>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-xs font-semibold mb-4">Comments</h3>

          <CommentList postId={currentPost.id} maxDisplay={2} />

          <div className="mt-4">
            <CommentForm postId={currentPost.id} />
          </div>
        </div>
      </CardContent>

      {/* Confirm delete */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Likes Modal */}
      <LikeUsersModal
        postId={currentPost.id}
        open={showLikesModal}
        onOpenChange={setShowLikesModal}
      />
    </Card>
  );
};

export default PostCard;
