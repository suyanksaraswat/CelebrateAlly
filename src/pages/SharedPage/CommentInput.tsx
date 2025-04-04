import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

interface CommentInputProps {
  sharedId: string;
  userId: string;
  onCommentAdded: () => void;
  supabase: any;
}

const CommentInput = ({
  sharedId,
  userId,
  onCommentAdded,
  supabase,
}: CommentInputProps) => {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert({
        message: message.trim(),
        sharedId: sharedId,
        userId: userId,
        userEmail: user?.email,
      });

      if (error) throw error;

      setMessage("");

      toast.success("Your comment has been posted successfully");
      onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);

      toast.error(error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        placeholder="Write a comment..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] w-full"
      />
      <Button
        type="submit"
        className="mt-2"
        disabled={isSubmitting || !message.trim()}
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};

export default CommentInput;
