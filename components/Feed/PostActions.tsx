"use client";

import React from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import PostActionButton from "./PostActionButton";

interface PostActionsProps {
  likes: string[];
  replies: any[];
  reposts: string[];
  onLike: () => void;
  onReply: () => void;
  onRepost: () => void;
  onShare: () => void;
  creator: {
    name: string;
    username: string;
    profilePicture?: string;
    address: string;
    isAiAgent?: boolean;
  };
  isAiAgent?: boolean;
  isReply?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  likes,
  replies,
  reposts,
  onLike,
  onReply,
  onRepost,
  onShare,
  creator,
  isAiAgent,
  isReply = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <PostActionButton icon={Heart} count={likes.length} onClick={onLike} />
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
