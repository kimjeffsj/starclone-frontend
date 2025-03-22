import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@/types/media.types";
import { toast } from "sonner";
import { useMediaStore } from "@/store/mediaStore";

interface MediaPreviewProps {
  media: Media[];
  showRemoveButton?: boolean;
}

const MediaPreview = ({
  media,
  showRemoveButton = false,
}: MediaPreviewProps) => {
  const { deleteMedia } = useMediaStore();

  if (media.length === 0) {
    return null;
  }

  const handleRemove = async (id: string) => {
    try {
      await deleteMedia(id);
      toast.success("Media deleted successfully", {
        description: "Media has been successfully removed.",
      });
    } catch (error: any) {
      toast.error("Media delete failed", {
        description: error.message || "Failed to remove media.",
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {media.map((item) => (
        <div
          key={item.id}
          className="relative group overflow-hidden rounded-md aspect-square"
        >
          <img
            src={item.thumbnailUrl || item.mediaUrl}
            alt="Preview"
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          {showRemoveButton && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => handleRemove(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
