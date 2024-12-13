import { connectToDB } from '@/utils/database';
import Post from '@/models/post';
import User from '@/models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = await params;
    const post = await Post.findOne({ _id: id }).populate('creator');
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    const response = await fetch(post.url);
    if (!response.ok) {
      return new Response('Failed to fetch post data', { status: 500 });
    }

    const postData = await response.json();

    if (!postData.files || postData.files.length === 0) {
      return new Response(JSON.stringify({ content: postData.content }), {
        status: 200
      });
    }

    const fileUrl = postData.files[0].url;

    return new Response(JSON.stringify({ url: fileUrl, content: postData.content }), {
      status: 200
    });

  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch post', { status: 500 });
  }
};
