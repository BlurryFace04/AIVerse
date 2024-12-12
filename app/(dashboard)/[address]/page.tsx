'use client';

import React, { useEffect, useState, use } from 'react';
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown';

interface Params {
  address: string
}

export default function UserProfilePage({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data based on params.address
        const userResponse = await fetch(`/api/user/${params.address}`);
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch posts for this user
        const postsResponse = await fetch(`/api/post/user/${params.address}`);
        const postsData = await postsResponse.json();

        const sortedPosts = postsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const postDataWithImages = await Promise.all(sortedPosts.map(async post => {
          const imageResponse = await fetch(`/api/post/${post.cid}`);
          const imageData = await imageResponse.json();
          console.log("Image: ", imageData);
          return {
            ...post,
            imageCid: imageData.cid,
            content: imageData.content
          };
        }));

        setPosts(postDataWithImages);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.address]);

  return (
    <div className="sm:border-t sm:border-r sm:border-b rounded-tr rounded-br flex flex-1 pb-1">
      { user && (
      <div className="w-full">
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-950 to-black h-40"></div>

          <div className="absolute top-20 left-12">
            <Avatar className="rounded-xl overflow-hidden w-40 h-40 border-4 border-black">
              <AvatarImage
                className="object-cover w-full h-full"
                src={`https://gateway.lighthouse.storage/ipfs/${user.profilePicture}`}
              />
            </Avatar>
          </div>

          <div className="absolute top-44 left-60">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-md text-zinc-400">@{user.username}</p>
          </div>

          {(posts.length > 0 || loading) && <Separator className='mt-28'/>}

          <div className='flex flex-1 flex-wrap flex-col'>
          <div className="flex flex-1 flex-wrap flex-col">

          {
            loading && (
              <div className="
                flex flex-1 justify-center items-center mt-24 mb-20
              ">
                <Loader2 className="h-12 w-12 animate-spin" />
              </div>
            )
          }
          </div>
            {posts.map((post, index) => (
              <React.Fragment key={post.cid}>
                <div className="space-y-3 mb-4 pt-6 pb-2 sm:px-6 px-2">
                  <div>
                    <a href={post.transactionUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        className="max-w-full sm:max-w-[500px] rounded-2xl h-auto object-cover transition-all hover:scale-105"
                        src={`https://gateway.lighthouse.storage/ipfs/${post.imageCid}`}
                        alt={`Post by ${post.creator.name}`}
                      />
                    </a>
                  </div>
                  <div>
                    <ReactMarkdown className="mt-4 break-words">
                      {post.content.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '[LINK]($1)')}
                    </ReactMarkdown>
                  </div>
                </div>
                {index !== posts.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
