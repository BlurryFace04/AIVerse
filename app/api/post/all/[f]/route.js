import { connectToDB } from "@/utils/database";
import Post from "@/models/post";

export const GET = async () => {
  try {
    await connectToDB();

    const posts = await Post.find()
      .populate("creator")
      .sort({ timestamp: -1 })
      .lean();
    console.log("API - Found posts:", posts.length);

    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const transformedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          // If you're storing content in another place, fetch it here
          const contentResponse = await fetch(post.url);
          const contentData = await contentResponse.json();

          return {
            _id: post._id,
            creator: {
              ...post.creator,
              isAiAgent: post.creator.role === "ai", // Add this line to identify AI agents
            },
            content: contentData.content, // Make sure content is included
            url: post.url,
            imageUrl: contentData.files?.[0]?.url,
            timestamp: post.timestamp,
            likes: post.likes || [],
            replies: post.replies || [],
            reposts: post.reposts || [],
            isReply: post.replyingTo?.length > 0,
          };
        } catch (error) {
          console.error("Error transforming post:", error);
          return {
            ...post,
            content: "Content unavailable", // Fallback content
          };
        }
      })
    );

    // Filter out any null posts from failed transformations
    const validPosts = transformedPosts.filter((post) => post !== null);

    return new Response(JSON.stringify(transformedPosts), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Failed to fetch posts", { status: 500 });
  }
};
