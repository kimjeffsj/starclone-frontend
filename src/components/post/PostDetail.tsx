import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePostsStore } from "@/store/postStore";
import { toast } from "sonner";
import ImageCarousel from "../shared/media/ImageCarousel";
import { formatDate } from "@/utils/formatDate.utils";
import { useLikeStore } from "@/store/likeStore";
import LikeUsersModal from "./LikeUsersModal";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { checkLikeStatus } = useLikeStore();
  const [showLikesModal, setShowLikesModal] = useState(false);

  const {
    currentPost,
    fetchPostById,
    deletePost,
    likePost,
    unlikePost,
    isLoading,
    error,
  } = usePostsStore();

  useEffect(() => {
    const checkPostLikeStatus = async () => {
      if (currentPost && currentPost.isLiked === undefined && id) {
        await checkLikeStatus(id);
      }
    };

    checkPostLikeStatus();
  }, [currentPost, id, checkLikeStatus]);

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);

  const handleDelete = async () => {
    if (!currentPost) return;

    try {
      const success = await deletePost(currentPost.id);
      if (success) {
        toast.success("Post deleted", {
          description: "Post has been successfully deleted.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast.success("Post delete failed", {
        description: error.message || "Failed to delete post.",
      });
    }
  };

  const handleLikeToggle = async () => {
    if (!currentPost) return;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-destructive/10 text-destructive rounded-md">
        <p className="font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <Button onClick={() => navigate("/")}>Home</Button>
      </div>
    );
  }

  const isAuthor = user?.id === currentPost.user.id;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
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
            <CardTitle className="text-base">
              {currentPost.user.username}
            </CardTitle>
            {currentPost.location && (
              <CardDescription className="text-xs">
                {currentPost.location}
              </CardDescription>
            )}
          </div>
        </Link>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Post menu</span>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Do you want to delete this post?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The post will be permanently
                      deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {currentPost.media.length > 0 && (
        <div className="overflow-hidden">
          <ImageCarousel images={currentPost.media} />
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLikeToggle}
            className={currentPost.isLiked ? "text-pink-500" : ""}
          >
            <Heart
              className={`h-6 w-6 ${currentPost.isLiked ? "fill-current" : ""}`}
            />
            <span className="ml-2">{currentPost.likeCount || 0}</span>
          </Button>
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

        {currentPost.caption && (
          <div className="mb-4 whitespace-pre-line">
            <span className="font-semibold">{currentPost.user.username}</span>{" "}
            {currentPost.caption}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {formatDate(currentPost.createdAt)}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      </CardFooter>

      {/* Likes Modal */}
      {id && (
        <LikeUsersModal
          postId={id}
          open={showLikesModal}
          onOpenChange={setShowLikesModal}
        />
      )}
    </Card>
  );
};

export default PostDetail;
