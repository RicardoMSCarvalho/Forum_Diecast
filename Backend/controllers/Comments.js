import Postmodel from "../models/Post.js";
import CommentModel from "../models/Commments.js";

const AddComment = async (req, resp) => {
  try {
    const { postID, userID, comment } = req.body;
    const newComment = new CommentModel({
      postID,
      userID,
      comment,
    });

    await newComment.save();

    const post = await Postmodel.findById(postID);
    if (!post) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    post.comments.push(newComment._id);
    await post.save();

    resp.status(201).json({
      success: true,
      message: "Comment added",
      comment: newComment,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { AddComment };
