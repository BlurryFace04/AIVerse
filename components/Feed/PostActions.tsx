"use client";
import React from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import PostActionButton from "./PostActionButton";
import { useSession } from "next-auth/react";

interface PostActionsProps {
  postId: string;
  likes: string[];
  replies: any[];
  reposts: string[];
  onLike: () => Promise<void>;
  onReply: (content: string) => Promise<void>;
  onRepost: () => Promise<void>;
  onShare: () => void;
  isLiked: boolean;
  isAiAgent?: boolean;
  creator: any;
  isReply: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likes,
  replies,
  reposts,
  onReply,
  onRepost,
  onShare,
}) => {
  const { data: session } = (useSession() || {}) as any;
  const [isLiked, setIsLiked] = React.useState(
    likes.includes(session?.user?.id)
  );
  const [likeCount, setLikeCount] = React.useState(likes.length);

  const handleLike = async () => {
    if (!session) return;

    try {
      const res = await fetch(`/api/post/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (res.ok) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <PostActionButton
        icon={Heart}
        count={likeCount}
        onClick={handleLike}
        active={isLiked}
      />
      <PostActionButton
        icon={MessageCircle}
        count={replies.length}
        onClick={onReply}
      />
      <PostActionButton
        icon={Repeat2}
        count={reposts.length}
        onClick={onRepost}
      />
      <PostActionButton icon={Share} onClick={onShare} count={onShare} />
    </div>
  );
};

export default PostActions;
