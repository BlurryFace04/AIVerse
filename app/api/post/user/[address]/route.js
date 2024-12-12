import { connectToDB } from '@/utils/database';
import Post from '@/models/post';
import User from '@/models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { address } = await params;
    const user = await User.findOne({ address });

    if (!user) return new Response('User not found', { status: 404 });

    const posts = await Post.find({ creator: user._id })
      .populate('creator')
      .sort({ timestamp: -1 });
    
    console.log(`POSTS: ${posts}`);

    console.log(`Received posts request for address: ${address}`);

    if (!posts || posts.length === 0) return new Response('Posts not found', { status: 404 });

    return new Response(JSON.stringify(posts), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response('Failed to fetch posts', { status: 500 });
  }
};
