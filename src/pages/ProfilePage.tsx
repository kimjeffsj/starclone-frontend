import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/store/authStore";
import PostList from "@/components/post/PostList";
import { AuthResponse, User } from "@/types/auth.types";
import FollowStats from "@/components/follow/FollowStats";
import FollowButton from "@/components/follow/FollowButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Grid,
  Link as LinkIcon,
  Pencil,
  Camera,
  Bookmark,
  Grid3X3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  ProfileFormInput,
  profileFormSchema,
} from "@/components/profile/validations/profile.schema";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangeProfileImage from "@/components/profile/ChangeProfileImage";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [changeProfileImageOpen, setChangeProfileImageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { user: currentUser } = useAuthStore();

  const isOwnProfile = currentUser?.username === username;

  // Profile edit form
  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      website: "",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<AuthResponse>(`/users/${username}`);

        setUser(response.data.user);

        if (isOwnProfile) {
          form.reset({
            fullName: response.data.user.fullName || "",
            bio: response.data.user.bio || "",
            website: response.data.user.website || "",
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const handleProfileUpdate = (values: ProfileFormInput) => {
    // TODO: Implement profile update
    console.log("Updated profile inputs: values", values);
    toast.success("Profile updated successfully");
    setIsEditProfileOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive text-center">
        <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The user you are looking for doesn't exist or may have been removed.
        </p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Profile Header */}
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={user.profileImageUrl} alt={user.username} />
              <AvatarFallback className="text-4xl bg-primary/10">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full shadow-md"
                onClick={() => setChangeProfileImageOpen(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <div className="flex items-center gap-1 text-muted-foreground justify-center md:justify-start">
                  {user.fullName && (
                    <span className="text-sm">{user.fullName}</span>
                  )}
                </div>
              </div>

              {isOwnProfile ? (
                <Button onClick={() => setIsEditProfileOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <FollowButton username={user.username} />
              )}
            </div>

            <FollowStats username={user.username} />

            {user.bio && <p className="text-sm max-w-md">{user.bio}</p>}

            {user.website && (
              <div className="flex items-center gap-1 text-sm text-primary justify-center md:justify-start">
                <LinkIcon className="h-3 w-3" />
                <a
                  href={
                    user.website.startsWith("http")
                      ? user.website
                      : `https://${user.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {user.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 bg-card rounded-lg p-1 border shadow-sm">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>Saved</span>
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span>Tagged</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <PostList userId={user.id} />
        </TabsContent>

        {/* Saved post */}
        {/* TODO: Saved post implement */}
        <TabsContent value="saved" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg border">
            <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Saved Posts</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              When you save posts, they will appear here.
            </p>
          </div>
        </TabsContent>

        {/* Tagged post */}
        {/* TODO: Tagged post implement */}
        <TabsContent value="tagged" className="mt-0">
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg border">
            <Grid3X3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Tagged Posts</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              When people tag you in posts, they will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <ChangeProfileImage
        changeProfileImageOpen={changeProfileImageOpen}
        setChangeProfileImageOpen={setChangeProfileImageOpen}
        currentProfileImage={user?.profileImageUrl}
      />

      {/* Edit Profile */}
      <EditProfileForm
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        form={form}
        handleProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default ProfilePage;
