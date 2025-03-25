import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFollowStore } from "@/store/followStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface FollowButtonProps {
  username: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const FollowButton = ({
  username,
  variant = "default",
  size = "default",
}: FollowButtonProps) => {
  const { user } = useAuthStore();
  const {
    followStatus,
    followUser,
    unfollowUser,
    checkFollowStatus,
    isLoading,
  } = useFollowStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // If the current user is the same as the profile being viewed, don't show follow button
  if (user?.username === username) {
    return null;
  }

  useEffect(() => {
    if (user && username) {
      checkFollowStatus(username);
    }
  }, [username, user, checkFollowStatus]);

  const isFollowing = followStatus[username] || false;

  const handleFollowAction = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isFollowing) {
        await unfollowUser(username);
        toast.success(`Unfollowed @${username}`);
      } else {
        await followUser(username);
        toast.success(`Now following @${username}`);
      }
    } catch (error: any) {
      toast.error(isFollowing ? "Failed to unfollow" : "Failed to follow", {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleFollowAction}
      variant={isFollowing ? "outline" : variant}
      size={size}
      disabled={isProcessing || isLoading}
    >
      {isProcessing ? (
        <span className="flex items-center">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
          {isFollowing ? "Unfollowing..." : "Following..."}
        </span>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;
