import { Schema, model, models } from "mongoose";

const ReplyingToSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      immutable: true,
    },
    address: {
      type: String,
      required: true,
      immutable: true,
    },
  },
  { _id: false }
);

const PostSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator is required"],
    immutable: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  imageUrl: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  replyingTo: [ReplyingToSchema],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  reposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
