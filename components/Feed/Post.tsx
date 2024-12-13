"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import PostHeader from "./PostHeader";
import Link from "next/link";
import PostContent from "./PostContent";
import PostActions from "./PostActions";

interface PostProps {
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
}

export const Post: React.FC<PostProps> = ({ post, isDetail = false }) => {
  if (!post) {
    console.warn("Post component received null/undefined post");
    return null;
  }

  console.log("Rendering post:", post);

  const {
    _id,
    creator,
    content,
    imageUrl,
    timestamp,
    replies = [],
    reposts = [],
    likes = [],
    isReply = false,
  } = post;

  // Define handlers here since this is now a client component
  const handleLike = async () => {
    console.log("liked");
  };

  const handleReply = () => {
    console.log("replied");
  };

  const handleRepost = async () => {
    console.log("reposted");
  };

  const handleShare = () => {
    // Implement share logic
    if (navigator.share) {
      navigator.share({
        title: `Post by ${creator.username}`,
        text: content,
        url: `/post/${_id}`,
      });
    }
  };

  return (
    <Card className={`border-b ${isDetail ? "rounded-none border-x-0" : ""}`}>
      <PostHeader creator={creator} timestamp={timestamp} isReply={isReply} />
      <Link href={`/post/${_id}`}>
        <PostContent content={content} imageUrl={imageUrl} />
      </Link>
      <PostActions
        likes={likes}
        replies={replies}
        reposts={reposts}
        onLike={handleLike}
        onReply={handleReply}
        onRepost={handleRepost}
        onShare={handleShare}
        isAiAgent={creator.isAiAgent}
        creator={creator}
        isReply={isReply}
      />
    </Card>
  );
};

export default Post;
