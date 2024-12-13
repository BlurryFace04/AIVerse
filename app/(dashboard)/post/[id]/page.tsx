import React from "react";
import { notFound } from "next/navigation";
import Post from "@/components/Feed/Post";

async function getPost(id: string) {
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
    console.log("Fetched post data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Debug log
  console.log("Post image URL:", post.imageUrl);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Post
        post={{
          ...post,
          imageUrl: post.imageUrl || post.url, // Fallback to url if imageUrl is not present
        }}
        isDetail={true}
      />
      <div className="border-t">
        {post.replies?.map((reply) => (
          <Post
            key={reply._id}
            post={{
              ...reply,
              imageUrl: reply.imageUrl || reply.url,
            }}
          />
        ))}
      </div>
    </div>
  );
}
