import { useMediaStore } from "@/store/mediaStore";
import MediaUploader from "../shared/media/MediaUploader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface ChangeProfileImageProps {
  changeProfileImageOpen: boolean;
  setChangeProfileImageOpen: (open: boolean) => void;
  onProfileImageChange?: (imageUrl: string) => void;
  currentProfileImage?: string;
}

const ChangeProfileImage = ({
  changeProfileImageOpen,
  setChangeProfileImageOpen,
  onProfileImageChange,
  currentProfileImage,
}: ChangeProfileImageProps) => {
  const { uploadedMedia, clearUploadedMedia } = useMediaStore();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    return () => {
      clearUploadedMedia();
    };
  }, [clearUploadedMedia]);

  const handleSaveImage = async () => {
    if (uploadedMedia.length === 0) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      const imageUrl = uploadedMedia[0].mediaUrl;

      if (onProfileImageChange) {
        onProfileImageChange(imageUrl);
      }

      toast.success("Profile image updated successfully");
      setChangeProfileImageOpen(false);
      clearUploadedMedia();
    } catch (error) {
      toast.error("Failed to update profile image");
    }
  };

  const handleCloseModal = () => {
    if (uploadedMedia.length > 0) {
      setShowWarning(true);
    } else {
      setChangeProfileImageOpen(false);
    }
  };

  const handleConfirmClose = () => {
    clearUploadedMedia();
    setShowWarning(false);
    setChangeProfileImageOpen(false);
  };

  return (
    <>
      <AlertDialog
        open={changeProfileImageOpen}
        onOpenChange={setChangeProfileImageOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Profile Image</AlertDialogTitle>
            <AlertDialogDescription>
              Upload a new profile image. The changes will apply once you save.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <MediaUploader type="profile" multiple={false} />

            <div className="mt-4 flex items-center justify-center gap-4">
              {currentProfileImage && !uploadedMedia.length && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Image
                  </p>
                  <img
                    src={currentProfileImage}
                    alt="Current profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-background"
                  />
                </div>
              )}

              {uploadedMedia.length > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    New Image
                  </p>
                  <img
                    src={uploadedMedia[0].mediaUrl}
                    alt="New profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-background"
                  />
                </div>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveImage}
              disabled={uploadedMedia.length === 0}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warning */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have uploaded a new profile image. If you close without
              saving, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowWarning(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Discard Changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChangeProfileImage;
