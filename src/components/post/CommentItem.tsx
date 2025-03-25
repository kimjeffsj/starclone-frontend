import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/formatDate.utils";
import { Comment } from "@/types/comment.types";
import { useAuthStore } from "@/store/authStore";
import { useCommentStore } from "@/store/commentStore";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { user } = useAuthStore();
  const { updateComment, deleteComment } = useCommentStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAuthor = user?.id === comment.user.id;

  const handleEdit = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (editContent.trim() === "") return;
    if (editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateComment(comment.id, { content: editContent });
      toast.success("Comment updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteComment(comment.id, comment.postId);
      toast.success("Comment deleted");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2 py-2 group">
      <Link to={`/profile/${comment.user.username}`} className="shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={comment.user.profileImageUrl}
            alt={comment.user.username}
          />
          <AvatarFallback>
            {comment.user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your comment..."
              className="w-full"
              disabled={isSubmitting}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleUpdate}
                disabled={isSubmitting || editContent.trim() === ""}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start">
              <Link
                to={`/profile/${comment.user.username}`}
                className="font-semibold text-sm mr-2"
              >
                {comment.user.username}
              </Link>
              <p className="text-sm break-words">{comment.content}</p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {/* TODO: Comment reply */}
              {/* <Button variant="link" size="sm" className="text-xs p-0 h-auto">Reply</Button> */}
            </div>
          </div>
        )}
      </div>

      {isAuthor && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Comment menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this comment? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
