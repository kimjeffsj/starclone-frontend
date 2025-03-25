import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFollowStore } from "@/store/followStore";
import { Button } from "@/components/ui/button";
import UserListItem from "./UserListItem";

interface FollowingModalProps {
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FollowingModal = ({
  username,
  open,
  onOpenChange,
}: FollowingModalProps) => {
  const { following, getFollowing, isLoading } = useFollowStore();
  const [page, setPage] = useState(1);

  // Load data when modal opens
  useEffect(() => {
    if (open) {
      // First page load
      getFollowing(username, 1);
    } else {
      // Reset status when modal closes
      setPage(1);
    }
  }, [open, username, getFollowing]);

  const followingList = following[username] || {
    users: [],
    hasMore: false,
    total: 0,
  };

  const handleLoadMore = () => {
    if (followingList.hasMore && !isLoading) {
      getFollowing(username, page + 1);
      setPage(page + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Following</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {followingList.users.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-4">
              Not following anyone yet
            </p>
          ) : (
            <ul className="space-y-4">
              {followingList.users.map((user) => (
                <li key={user.id}>
                  <UserListItem
                    user={user}
                    onUserClick={() => onOpenChange(false)}
                  />
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}

          {followingList.hasMore && followingList.users.length > 0 && (
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

export default FollowingModal;
