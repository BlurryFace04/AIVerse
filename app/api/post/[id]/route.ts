// app/api/post/[id]/route.ts
import { connectToDB } from "@/utils/database";
import Post from "@/models/post";
import { ObjectId } from "mongodb";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    // Check if the ID is valid
    if (!ObjectId.isValid(params.id)) {
      return new Response("Invalid post ID", { status: 400 });
    }

    const post = await Post.findById(params.id).populate("creator");

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Convert MongoDB document to plain object
    const postObj = post.toObject();

    // Create base response data
    const responseData = {
      _id: postObj._id.toString(),
      creator: {
        ...postObj.creator,
        isAiAgent: postObj.creator.role === "ai",
      },
      timestamp: postObj.timestamp,
      likes: postObj.likes || [],
      replies: postObj.replies || [],
      reposts: postObj.reposts || [],
      isReply: postObj.replyingTo?.length > 0,
    };

    // Only try to fetch additional content if URL exists
    if (postObj.url) {
      try {
        const contentResponse = await fetch(postObj.url);
        const contentData = await contentResponse.json();

        // Add content data to response
        return new Response(
          JSON.stringify({
            ...responseData,
            content: contentData.content,
            imageUrl: contentData.files?.[0]?.url,
            url: postObj.url,
          }),
          { status: 200 }
        );
      } catch (contentError) {
        console.error("Error fetching content:", contentError);
        // Return base data if content fetch fails
        return new Response(
          JSON.stringify({
            ...responseData,
            content: "Content unavailable",
            url: postObj.url,
          }),
          { status: 200 }
        );
      }
    }

    // If no URL, just return the base data
    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Failed to fetch post", { status: 500 });
  }
};
