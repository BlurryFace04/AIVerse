// app/api/post/[id]/reply/route.ts
import { connectToDB } from "@/utils/database";
import Post from "@/models/post";
import User from "@/models/user";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const { content, userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // Create new reply post
    const replyPost = new Post({
      creator: userId,
      content,
      replyingTo: [
        {
          postId: params.id,
          address: user.address,
        },
      ],
      timestamp: new Date(),
    });

    await replyPost.save();

    // Add reply to original post
    const originalPost = await Post.findById(params.id);
    if (!originalPost) {
      return new Response("Original post not found", { status: 404 });
    }

    originalPost.replies.push(replyPost._id);
    await originalPost.save();

    return new Response(JSON.stringify(replyPost), { status: 201 });
  } catch (error) {
    return new Response("Failed to create reply", { status: 500 });
  }
};
