import { ImageIcon, Upload } from "lucide-react";
import { Progress } from "../../ui/progress";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaStore } from "@/store/mediaStore";
import { Button } from "@/components/ui/button";

interface MediaUploaderProps {
  type: "profile" | "post";
  postId?: string;
  multiple?: boolean;
  showPreview?: boolean;
}

const MediaUploader = ({
  type,
  // postId,
  multiple = true,
  showPreview = true,
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    previewMedia,
    addPreview,
    removePreview,
    isUploading,
    uploadProgress,
    error,
  } = useMediaStore();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.error("Not supported file", {
          description: "Only image files can be uploaded.",
        });
        return;
      }

      // Add preview
      addPreview(imageFiles);
      toast.success("Images added to preview", {
        description: `${imageFiles.length} ${
          imageFiles.length > 1 ? "files" : "file"
        } ready for upload.`,
      });
    } catch (error: any) {
      toast.error("Failed to process files", {
        description: error.message || "Please try again.",
      });
    }

    // Reset fields
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Filter images
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("Not supported file", {
        description: "Only image files can be uploaded.",
      });
      return;
    }

    try {
      addPreview(imageFiles);
      toast.success("Images added to preview", {
        description: `${imageFiles.length} ${
          imageFiles.length > 1 ? "files" : "file"
        } ready for upload.`,
      });
    } catch (error: any) {
      toast.error("Failed to process files", {
        description: error.message || "Please try again.",
      });
    }
  };

  const renderPreviews = () => {
    if (!showPreview || previewMedia.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">
          Preview ({previewMedia.length})
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {previewMedia.map((media) => (
            <div
              key={media.id}
              className="relative group overflow-hidden rounded-md aspect-square"
            >
              <img
                src={media.previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePreview(media.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mb-4">
      {error && (
        <div className="p-3 mb-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }
          ${isUploading ? "pointer-events-none" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="space-y-3">
            <Progress value={uploadProgress} className="h-2 w-full" />
            <p className="text-sm text-gray-600">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {type === "profile" ? (
              <ImageIcon className="h-12 w-12 text-gray-400" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-600">
                {type === "profile" ? "Upload Profile Image" : "Upload Images"}
              </p>
              <p className="text-sm text-gray-500">
                Click or drag and drop files
              </p>
              <p className="text-xs text-gray-400">
                {type === "profile"
                  ? "JPG, PNG, WebP (max 5MB)"
                  : `JPG, PNG, WebP (max 10MB)${
                      multiple ? ", multiple uploads allowed" : ""
                    }`}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg, image/png, image/webp"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {/* Preview */}
      {renderPreviews()}
    </div>
  );
};

export default MediaUploader;
