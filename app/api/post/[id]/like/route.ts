// app/api/post/[id]/like/route.ts
import { connectToDB } from "@/utils/database";
import Post from "@/models/post";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const userId = req.body.userId;

    const post = await Post.findById(params.id);
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response("Failed to like/unlike post", { status: 500 });
  }
};
