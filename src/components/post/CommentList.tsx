import { useEffect } from "react";
import { useCommentStore } from "@/store/commentStore";
import CommentItem from "./CommentItem";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  postId: string;
  maxDisplay?: number;
  showAll?: boolean;
}

const CommentList = ({
  postId,
  maxDisplay = 3,
  showAll = false,
}: CommentListProps) => {
  const { comments, fetchComments, isLoading, clearComments } =
    useCommentStore();

  const postComments = comments[postId] || {
    items: [],
    totalPages: 1,
    currentPage: 1,
  };

  useEffect(() => {
    fetchComments(postId);

    return () => {
      if (!showAll) {
        clearComments(postId);
      }
    };
  }, [postId, fetchComments, clearComments, showAll]);

  const handleLoadMore = () => {
    if (postComments.currentPage < postComments.totalPages) {
      fetchComments(postId, postComments.currentPage + 1);
    }
  };

  const displayComments = showAll
    ? postComments.items
    : postComments.items.slice(0, maxDisplay);

  if (isLoading && displayComments.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayComments.length > 0 ? (
        <>
          {displayComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {showAll && postComments.currentPage < postComments.totalPages && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load more comments"}
              </Button>
            </div>
          )}

          {!showAll && postComments.items.length > maxDisplay && (
            <div className="text-sm text-muted-foreground mt-2">
              <Button
                variant="link"
                className="h-auto p-0 text-muted-foreground"
                asChild
              >
                <a href={`/post/${postId}`}>
                  View all {postComments.items.length} comments
                </a>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-2 text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentList;
