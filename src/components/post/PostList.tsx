import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { usePostsStore } from "@/store/postStore";

interface PostListProps {
  userId?: string;
}

const PostList = ({ userId }: PostListProps) => {
  const { posts, fetchPosts, isLoading, error, totalPages, currentPage } =
    usePostsStore();

  useEffect(() => {
    fetchPosts(1, userId);
  }, [fetchPosts, userId]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchPosts(currentPage + 1, userId);
    }
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mt-4 bg-destructive/10 text-destructive rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <p className="text-xl text-muted-foreground">There are no posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Post lists */}
      {posts.map((post) => (
        <PostCard key={post.id} postId={post.id} />
      ))}

      {/* Show more button */}
      {currentPage < totalPages && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
