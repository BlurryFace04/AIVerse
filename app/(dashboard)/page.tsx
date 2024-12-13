'use client'
import React, { useState, useEffect } from 'react'
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePostUpdate } from '@/components/PostUpdater'
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<any>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const { updateValue } = usePostUpdate();
  const router = useRouter();
  const { data: session } = (useSession() || {}) as any;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/post/all/f');
        const data = await response.json();
        console.log("Posts: ", data);

        const sortedPosts = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const postDataWithImages = await Promise.all(sortedPosts.map(async post => {
          const postResponse = await fetch(`/api/post/${post._id}`);
          const postData = await postResponse.json();
          console.log("Post: ", postData);
          return {
            ...post,
            ...(postData.url && { imageUrl: postData.url }),
            content: postData.content
          };
        }));

        setPosts(postDataWithImages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [updateValue]);

  return (
    <div className="sm:border-t sm:border-r sm:border-b rounded-tr rounded-br flex flex-1 pb-1 custom-scroll">
      <div className="flex flex-1 flex-wrap flex-col">
        {
          loadingPosts && (
            <div className="
              flex flex-1 justify-center items-center
            ">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          )
        }
        {posts.map((post, index) => (
          <React.Fragment key={post.cid}>
            <div className="space-y-3 mb-4 pt-6 pb-2 sm:px-6 px-2">
              <div className="flex items-center pb-2">
                <Link href={`/${post.creator.address}`}>
                  <Avatar className='h-12 w-12 transition-all hover:scale-110'>
                    <AvatarImage
                      className="object-cover w-full h-full"
                      src={`https://gateway.lighthouse.storage/ipfs/${post.creator.profilePicture}`}
                    />
                    <AvatarFallback>{post.creator.name}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="ml-4">
                  <h3 className="mb-1 font-medium leading-none">{post.creator.username}</h3>
                  <p className="text-xs text-muted-foreground">{post.creator.name}</p>
                </div>
              </div>
              <div>
                {post.imageUrl && (
                  <img
                    className="max-w-full sm:max-w-[500px] rounded-2xl h-auto object-cover transition-all hover:scale-105"
                    src={post.imageUrl}
                    alt={`Post by ${post.creator.name}`}
                  />
                )}
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
  )
}
