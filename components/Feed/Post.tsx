"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import Link from "next/link";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { useSession } from "next-auth/react";

export interface PostProps {
  post: {
    _id: string;
    creator: {
      name: string;
      username: string;
      profilePicture?: string;
      address: string;
      isAiAgent?: boolean;
    };
    content?: string;
    url?: string;
    imageUrl?: string;
    timestamp: Date;
    likes: string[];
    replies: any[];
    reposts: string[];
    isReply?: boolean;
  };
  isDetail?: boolean;
  onReplyAdded?: (reply: any) => void;
}

export const Post: React.FC<PostProps> = ({
  post,
  isDetail = false,
  onReplyAdded,
}) => {
  const { data: session } = (useSession() || {}) as any;
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [localReplies, setLocalReplies] = useState(post.replies);

  if (!post) {
    console.warn("Post component received null/undefined post");
    return null;
  }

  const {
    _id,
    creator,
    content,
    imageUrl,
    timestamp,
    reposts = [],
    isReply = false,
  } = post;

  const handleLike = async () => {
    if (!session?.user?.id) {
      // Handle not logged in state - maybe show a login prompt
      console.log("Please login to like posts");
      return;
    }

    try {
      const res = await fetch(`/api/post/${_id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLocalLikes(updatedPost.likes);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleReply = async (content: string) => {
    if (!session?.user?.id) {
      console.log("Please login to reply");
      return;
    }

    try {
      const res = await fetch(`/api/post/${_id}/reply`, {
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
        const newReply = await res.json();
        setLocalReplies((prev) => [newReply, ...prev]);
        onReplyAdded?.(newReply);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleRepost = async () => {
    if (!session?.user?.id) {
      console.log("Please login to repost");
      return;
    }
    // Implement repost logic here
    console.log("reposted");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Post by ${creator.username}`,
          text: content,
          url: `/post/${_id}`,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support navigator.share
      const url = `${window.location.origin}/post/${_id}`;
      navigator.clipboard
        .writeText(url)
        .then(() => console.log("Link copied to clipboard"))
        .catch((err) => console.error("Error copying to clipboard:", err));
    }
  };

  const isLikedByCurrentUser = localLikes.includes(session?.user?.id || "");

  return (
    <Card className={`border-b ${isDetail ? "rounded-none border-x-0" : ""}`}>
      <PostHeader creator={creator} timestamp={timestamp} isReply={isReply} />
      <Link href={`/post/${_id}`}>
        <PostContent content={content} imageUrl={imageUrl} />
      </Link>
      <PostActions
        postId={_id}
        likes={localLikes}
        replies={localReplies}
        reposts={reposts}
        onLike={handleLike}
        onReply={handleReply}
        onRepost={handleRepost}
        onShare={handleShare}
        isLiked={isLikedByCurrentUser}
        isAiAgent={creator.isAiAgent}
        creator={creator}
        isReply={isReply}
      />
    </Card>
  );
};

export default Post;
