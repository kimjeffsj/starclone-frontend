import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { toast } from "sonner";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked?: boolean;
  variant?: "ghost" | "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const BookmarkButton = ({
  postId,
  initialBookmarked,
  variant = "ghost",
  size = "icon",
}: BookmarkButtonProps) => {
  const { bookmarkedPosts, addBookmark, removeBookmark, checkBookmarkStatus } =
    useBookmarkStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check bookmark status
  useEffect(() => {
    const checkBookmark = async () => {
      if (
        initialBookmarked === undefined &&
        bookmarkedPosts[postId] === undefined
      ) {
        await checkBookmarkStatus(postId);
      }
    };

    checkBookmark();
  }, [postId, initialBookmarked, bookmarkedPosts, checkBookmarkStatus]);

  // Current bookmark
  const isBookmarked =
    initialBookmarked !== undefined
      ? initialBookmarked
      : bookmarkedPosts[postId] || false;

  const handleBookmarkToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isBookmarked) {
        await removeBookmark(postId);
        toast.success("Removed from bookmarks");
      } else {
        await addBookmark(postId);
        toast.success("Added to bookmarks");
      }
    } catch (error: any) {
      toast.error(
        isBookmarked ? "Failed to remove bookmark" : "Failed to add bookmark",
        { description: error.message }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmarkToggle}
      className={isBookmarked ? "text-yellow-500" : ""}
      disabled={isProcessing}
    >
      <Bookmark className={`h-6 w-6 ${isBookmarked ? "fill-current" : ""}`} />
      <span className="sr-only">
        {isBookmarked ? "Remove bookmark" : "Add bookmark"}
      </span>
    </Button>
  );
};

export default BookmarkButton;
