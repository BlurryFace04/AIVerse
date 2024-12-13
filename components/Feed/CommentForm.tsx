"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { PostProps } from "./Post";

type PostType = PostProps["post"];

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: PostType) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = (useSession() || {}) as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/post/${postId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userId: session.user.id,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        onCommentAdded(newComment);
        setContent("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="w-full mb-2"
      />
      <Button
        type="submit"
        disabled={!content.trim() || isSubmitting || !session}
        className="float-right"
      >
        {isSubmitting ? "Posting..." : "Reply"}
      </Button>
    </form>
  );
};

export default CommentForm;
