import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

interface PostCardProps {
  postId: string;
}

const PostCard = ({ postId }: PostCardProps) => {
  const { posts } = usePostsStore();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const post = posts.find((p) => p.id === postId);

  if (!post) return null;

  const { deletePost } = usePostsStore();

  const isAuthor = user?.id === post.user.id;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
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

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center space-y-0">
        <Link
          to={`/profile/${post.user.username}`}
          className="flex items-center flex-1"
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={post.user.profileImageUrl}
              alt={post.user.username}
            />
            <AvatarFallback>
              {post.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.user.username}</p>
            {post.location && (
              <p className="text-xs text-muted-foreground">{post.location}</p>
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
                  to={`/post/edit/${post.id}`}
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

      {post.media && post.media.length > 0 && (
        <div className="w-full">
          <ImageCarousel images={post.media} />
        </div>
      )}

      <CardContent className="p-4">
        {post.caption && (
          <p className="mb-2 text-sm whitespace-pre-line">{post.caption}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatDate(post.createdAt)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/post/${post.id}`}>View Details</Link>
        </Button>
      </CardFooter>

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
    </Card>
  );
};

export default PostCard;
