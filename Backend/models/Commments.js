import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("comments", CommentSchema);

export default CommentModel;
