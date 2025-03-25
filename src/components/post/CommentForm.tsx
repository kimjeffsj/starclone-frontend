import { useState } from "react";
import { useCommentStore } from "@/store/commentStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface CommentFormProps {
  postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const { user } = useAuthStore();
  const { createComment, isLoading } = useCommentStore();
  const [content, setContent] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === "") {
      return;
    }

    try {
      await createComment({ postId, content: content.trim() });
      setContent("");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={user.profileImageUrl} alt={user.username} />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 relative">
        <textarea
          className="w-full min-h-[40px] bg-transparent placeholder:text-muted-foreground resize-none overflow-hidden text-sm px-3 py-2 outline-none border rounded-lg focus:border-primary transition-colors"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          rows={1}
          style={{ height: content ? "auto" : "40px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
      </div>

      <Button
        type="submit"
        variant="ghost"
        className="text-primary font-semibold hover:text-primary/90 hover:bg-transparent mt-1"
        disabled={content.trim() === "" || isLoading}
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </form>
  );
};

export default CommentForm;
