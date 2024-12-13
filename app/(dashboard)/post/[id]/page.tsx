"use client";

import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Post, { PostProps } from "@/components/Feed/Post";
import CommentForm from "@/components/Feed/CommentForm";

type PostType = PostProps["post"];

async function getPost(id: string): Promise<PostType | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/post/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Fetched post data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default function PostPage() {
  const params = useParams<{ id: string }>();

  const [post, setPost] = useState<PostType | null>(null);
  const [replies, setReplies] = useState<PostType[]>([]);

  React.useEffect(() => {
    const fetchPost = async () => {
      const data = await getPost(params.id);
      if (!data) notFound();
      setPost(data);
      setReplies(data.replies || []);
    };
    fetchPost();
  }, [params.id]); // Changed from params.id to id

  const handleCommentAdded = (newComment: PostType) => {
    setReplies((prev) => [newComment, ...prev]);
  };

  if (!post) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Post post={post} isDetail={true} onReplyAdded={handleCommentAdded} />
      <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
      <div className="border-t">
        {replies.map((reply) => (
          <Post key={reply._id} post={reply} />
        ))}
      </div>
    </div>
  );
}
