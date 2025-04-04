import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  message: string;
  created_at: string;
  userId: string;
  userEmail?: string;
}

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentList = ({ comments, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        <p>Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg mt-4 text-center">
        <p className="text-gray-500">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {(
                  comment.userEmail || comment.userId.substring(0, 2)
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {comment.userEmail || comment.userId.substring(0, 8)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">
            {comment.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
