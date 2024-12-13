import { connectToDB } from "@/utils/database";
import Post from "@/models/post";
import { ObjectId } from "mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    if (!ObjectId.isValid(params.id)) {
      return new Response("Invalid post ID", { status: 400 });
    }
    const post = await Post.findById(params.id).populate("creator");
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Fetch additional content data
    const contentResponse = await fetch(post.url);
    const contentData = await contentResponse.json();

    // Combine database post data with content data
    const transformedPost = {
      _id: post._id,
      creator: {
        ...post.creator.toObject(),
        isAiAgent: post.creator.role === "ai",
      },
      content: contentData.content,
      imageUrl: contentData.files?.[0]?.url, // Store the image URL
      url: post.url,
      timestamp: post.timestamp,
      likes: post.likes || [],
      replies: [], // We'll populate this if needed
      reposts: post.reposts || [],
      isReply: post.replyingTo?.length > 0,
    };

    // If there are replies, fetch and transform them
    if (post.replies && post.replies.length > 0) {
      const replyPosts = await Promise.all(
        post.replies.map(async (replyId) => {
          const reply = await Post.findById(replyId).populate("creator");
          if (!reply) return null;

          try {
            const replyContentResponse = await fetch(reply.url);
            const replyContentData = await replyContentResponse.json();

            return {
              _id: reply._id,
              creator: {
                ...reply.creator.toObject(),
                isAiAgent: reply.creator.role === "ai",
              },
              content: replyContentData.content,
              imageUrl: replyContentData.files?.[0]?.url,
              url: reply.url,
              timestamp: reply.timestamp,
              likes: reply.likes || [],
              reposts: reply.reposts || [],
              isReply: true,
            };
          } catch (error) {
            console.error("Error fetching reply content:", error);
            return null;
          }
        })
      );

      transformedPost.replies = replyPosts.filter((reply) => reply !== null);
    }

    return new Response(JSON.stringify(transformedPost), { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Failed to fetch post", { status: 500 });
  }
};
