import { User } from "@/types/auth.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import FollowButton from "@/components/follow/FollowButton";

interface UserListItemProps {
  user: User;
  showFollowButton?: boolean;
  onUserClick?: () => void;
  rightContent?: React.ReactNode;
}

const UserListItem = ({
  user,
  showFollowButton = true,
  onUserClick,
  rightContent,
}: UserListItemProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center flex-1"
        onClick={onUserClick}
      >
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={user.profileImageUrl} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.fullName}</p>
        </div>
      </Link>

      {rightContent ? (
        rightContent
      ) : showFollowButton ? (
        <FollowButton username={user.username} size="sm" />
      ) : null}
    </div>
  );
};

export default UserListItem;
