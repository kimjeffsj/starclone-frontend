import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLikeStore } from "@/store/likeStore";
import { User } from "@/types/auth.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface LikeUsersModalProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LikeUsersModal = ({
  postId,
  open,
  onOpenChange,
}: LikeUsersModalProps) => {
  const { fetchLikeUsers, isLoading } = useLikeStore();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load data when modal opens
  useEffect(() => {
    if (open) {
      // First page load
      loadUsers(1);
    } else {
      // Reset status when modal closes
      setUsers([]);
      setPage(1);
      setHasMore(true);
    }
  }, [open, postId]);

  const loadUsers = async (pageNum: number) => {
    try {
      const loadedUsers = await fetchLikeUsers(postId, pageNum);

      if (pageNum === 1) {
        setUsers(loadedUsers);
      } else {
        setUsers((prev) => [...prev, ...loadedUsers]);
      }

      setHasMore(loadedUsers.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadUsers(page + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Likes</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {users.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-4">
              No likes yet
            </p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id} className="flex items-center">
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-center flex-1"
                    onClick={() => onOpenChange(false)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={user.profileImageUrl}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.fullName}
                      </p>
                    </div>
                  </Link>
                  {/* TODO: Follow Button */}
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}

          {hasMore && users.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikeUsersModal;
