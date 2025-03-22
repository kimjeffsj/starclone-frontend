import { ImageIcon, Upload } from "lucide-react";
import { Progress } from "../../ui/progress";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaStore } from "@/store/mediaStore";

interface MediaUploaderProps {
  type: "profile" | "post";
  postId?: string;
  multiple?: boolean;
}

const MediaUploader = ({
  type,
  postId,
  multiple = true,
}: MediaUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    uploadMedia,
    uploadMultipleMedia,
    isUploading,
    uploadProgress,
    error,
  } = useMediaStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const options = {
        type,
        postId,
        resize: {
          width: type === "profile" ? 400 : 1080,
          quality: 80,
        },
      };

      if (multiple && files.length > 1) {
        await uploadMultipleMedia(Array.from(files), options);
        toast.success("Upload successful ", {
          description: `${files.length} files have been uploaded.`,
        });
      } else {
        await uploadMedia(files[0], options);
        toast.success("Upload successful", {
          description: "File has been uploaded.",
        });
      }
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload file.",
      });
    }

    // Input fields reset
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

    // Filter image files
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
      const options = {
        type,
        postId,
        resize: {
          width: type === "profile" ? 400 : 1080,
          quality: 80,
        },
      };

      if (multiple && imageFiles.length > 1) {
        await uploadMultipleMedia(imageFiles, options);
        toast.success("Upload successful", {
          description: `${imageFiles.length} files have been uploaded.`,
        });
      } else {
        await uploadMedia(imageFiles[0], options);
        toast.success("Upload successful", {
          description: "File has been uploaded.",
        });
      }
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload file.",
      });
    }
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
    </div>
  );
};

export default MediaUploader;
