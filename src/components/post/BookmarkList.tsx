import { useEffect } from "react";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";

const BookmarkList = () => {
  const {
    bookmarks,
    fetchBookmarks,
    isLoading,
    error,
    totalPages,
    currentPage,
  } = useBookmarkStore();

  useEffect(() => {
    const fetched = fetchBookmarks(1);
    console.log(fetched);
    console.log(bookmarks);
  }, [fetchBookmarks]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchBookmarks(currentPage + 1);
    }
  };

  if (isLoading && bookmarks.length === 0) {
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

  if (bookmarks.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-lg shadow-sm">
        <p className="text-xl text-muted-foreground">No bookmarked posts yet</p>
        <p className="text-md text-muted-foreground mt-2">
          Save posts to view them later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bookmarked posts */}
      {bookmarks.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Load more button */}
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

export default BookmarkList;
