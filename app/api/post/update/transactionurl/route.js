import { connectToDB } from '@/utils/database';
import Post from '@/models/post';

const fuji_explorer = 'https://testnet.snowtrace.io/tx/';

export const PATCH = async (req) => {
  try {
    await connectToDB();

    const { cid, hash } = await req.json();

    const transactionUrl = fuji_explorer + hash;

    const post = await Post.findOne({ cid: cid });
    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    post.transactionUrl = transactionUrl;
    await post.save();

    return new Response(JSON.stringify({ success: true, message: 'Transaction URL updated', transactionUrl }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
