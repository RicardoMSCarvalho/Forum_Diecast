import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Postmodel = mongoose.model("posts", PostSchema);

export default Postmodel;
