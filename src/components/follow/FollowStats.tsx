import { useState, useEffect } from "react";
import { useFollowStore } from "@/store/followStore";
import { Button } from "@/components/ui/button";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";

interface FollowStatsProps {
  username: string;
}

const FollowStats = ({ username }: FollowStatsProps) => {
  const { counts, getFollowCounts, isLoading } = useFollowStore();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    if (username) {
      getFollowCounts(username);
    }
  }, [username, getFollowCounts]);

  const userCounts = counts[username] || { followers: 0, following: 0 };

  return (
    <div className="flex gap-4 mt-2">
      <Button
        variant="ghost"
        className="px-2 py-1 h-auto"
        onClick={() => setShowFollowersModal(true)}
        disabled={isLoading}
      >
        <span className="font-bold mr-1">{userCounts.followers}</span>
        <span className="text-muted-foreground">
          {userCounts.followers === 1 ? "follower" : "followers"}
        </span>
      </Button>

      <Button
        variant="ghost"
        className="px-2 py-1 h-auto"
        onClick={() => setShowFollowingModal(true)}
        disabled={isLoading}
      >
        <span className="font-bold mr-1">{userCounts.following}</span>
        <span className="text-muted-foreground">following</span>
      </Button>

      {/* Follower and Following modals */}
      <FollowersModal
        username={username}
        open={showFollowersModal}
        onOpenChange={setShowFollowersModal}
      />

      <FollowingModal
        username={username}
        open={showFollowingModal}
        onOpenChange={setShowFollowingModal}
      />
    </div>
  );
};

export default FollowStats;
