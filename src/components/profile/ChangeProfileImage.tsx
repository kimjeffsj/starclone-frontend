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
import { ArrowDown, ArrowRight, X } from "lucide-react";

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
  const {
    previewMedia,
    clearUploadedMedia,
    clearPreviews,
    uploadAllPreviews,
    removePreview,
  } = useMediaStore();

  const [showWarning, setShowWarning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      clearUploadedMedia();
      clearPreviews();
    };
  }, [clearUploadedMedia, clearPreviews]);

  const handleSaveImage = async () => {
    if (previewMedia.length === 0) {
      toast.error("Please upload an image first");
      return;
    }

    setIsUploading(true);

    try {
      const options = {
        type: "profile" as const,
        resize: {
          width: 400,
          quality: 80,
        },
      };

      const uploadedMedia = await uploadAllPreviews(options);

      if (uploadedMedia.length > 0) {
        const imageUrl = uploadedMedia[0].mediaUrl;
        if (onProfileImageChange) {
          onProfileImageChange(imageUrl);
        }
        toast.success("Profile image updated successfully");
        setChangeProfileImageOpen(false);
      } else {
        toast.error("Failed to upload profile image");
      }
    } catch (error) {
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
      clearUploadedMedia();
      clearPreviews();
    }
  };

  const handleCloseModal = () => {
    if (previewMedia.length > 0) {
      setShowWarning(true);
    } else {
      setChangeProfileImageOpen(false);
    }
  };

  const handleConfirmClose = () => {
    clearUploadedMedia();
    clearPreviews();
    setShowWarning(false);
    setChangeProfileImageOpen(false);
  };

  const handleRemoveNewImage = () => {
    if (previewMedia.length > 0) {
      // previewMedia의 첫 번째 항목 삭제
      removePreview(previewMedia[0].id);
      toast.info("New image removed");
    }
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
              Upload a new profile image and click Save to apply changes.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            {previewMedia.length === 0 ? (
              <MediaUploader
                type="profile"
                multiple={false}
                showPreview={false}
              />
            ) : null}

            <div className="mt-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Current image */}
                {currentProfileImage && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Current image
                    </p>
                    <div className="relative">
                      <img
                        src={currentProfileImage}
                        alt="Current profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-background"
                      />
                    </div>
                  </div>
                )}

                {currentProfileImage && previewMedia.length > 0 && (
                  <div className="flex items-center justify-center md:h-32">
                    <div className="hidden md:block">
                      <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="block md:hidden">
                      <ArrowDown className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                )}

                {/* New image */}
                {previewMedia.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary mb-2">
                      New image
                    </p>
                    <div className="relative">
                      <img
                        src={previewMedia[0].previewUrl}
                        alt="New profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/50"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 rounded-full shadow-md h-8 w-8"
                        onClick={handleRemoveNewImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveImage}
              disabled={previewMedia.length === 0 || isUploading}
            >
              {isUploading ? "Saving..." : "Save"}
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
              You have selected a new profile image. If you close without
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
