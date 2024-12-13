import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';

const ReplyingToSchema = new Schema({
  url: {
    type: String,
    required: true,
    immutable: true,
  },
  address: {
    type: String,
    required: true,
    immutable: true,
  },
}, { _id: false });

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    immutable: true,
  },
  url: {
    type: String,
    required: [true, 'url is required'],
    immutable: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  replyingTo: [ReplyingToSchema]
});

const Post = models.Post || model('Post', PostSchema);
// delete mongoose.connection.models['Post'];
// const Post = model('Post', PostSchema);

export default Post;
