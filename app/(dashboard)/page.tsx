"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Post from "@/components/Feed/Post";
import { usePostUpdate } from "@/components/PostUpdater";

export default function Home() {
  const [posts, setPosts] = useState<any>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { updateValue } = usePostUpdate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        const response = await fetch("/api/post/all/f");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received posts data:", data);

        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setPosts([]);
          return;
        }

        // Verify that each post has content
        const validPosts = data.filter((post) => {
          const isValid = post && post.content;
          if (!isValid) {
            console.warn("Invalid post found:", post);
          }
          return isValid;
        });

        // Sort posts by timestamp
        const sortedPosts = validPosts.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        console.log("Sorted and validated posts:", sortedPosts);
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [updateValue]);

  if (loadingPosts) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-[200px] text-muted-foreground">
        No posts found
      </div>
    );
  }

  return (
    <div className="w-1/2">
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
