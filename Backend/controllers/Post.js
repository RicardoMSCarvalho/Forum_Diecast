import Postmodel from "../models/Post.js";
import CommentModel from "../models/Commments.js";
import { deleteImage } from "../middleware/DeleteImage.js";

const create = async (req, resp) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.file)
      return resp.status(400).json({
        success: false,
        message: "You can leave empty fields",
      });

    const imagePath = req.file.filename;

    const createPost = new Postmodel({
      title,
      description,
      image: imagePath,
    });

    await createPost.save();

    resp.status(201).json({
      success: true,
      message: "A new post has been created",
      post: createPost,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const update = async (req, resp) => {
  try {
    const { title, description } = req.body;
    const postId = req.params.id;

    const postToUpdate = await Postmodel.findById(postId);
    if (!postToUpdate) {
      return resp
        .status(404)
        .json({ success: false, message: "Post could not be found" });
    }

    if (title) postToUpdate.title = title;
    if (description) postToUpdate.description = description;
    if (req.file) postToUpdate.image = req.file.filename;

    await postToUpdate.save();
    resp.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: postToUpdate,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPosts = async (req, resp) => {
  try {
    const posts = await Postmodel.find().sort("-createdAt");

    if (!posts) {
      return resp
        .status(404)
        .json({ success: false, message: "Posts not found" });
    }
    resp.status(200).json({ success: true, posts });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deletePost = async (req, resp) => {
  try {
    const postID = req.params.id;
    const postToDelete = await Postmodel.findById(postID).populate("comments");

    if (!postToDelete) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (postToDelete.comments.length > 0) {
      await CommentModel.deleteMany({
        _id: { $in: postToDelete.comments.map((comment) => comment._id) },
      });
    }

    if (postToDelete.image) {
      await deleteImage(postToDelete.image);
    }

    const deletedPost = await Postmodel.findByIdAndDelete(postID);

    resp.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const limitText = (text, charLimit, paragraphLimit) => {
  if (!text) return "";
  const paragraphs = text.split(/\n\n/);

  if (paragraphs.length > paragraphLimit) {
    text = paragraphs.slice(0, paragraphLimit).join("\n\n");
  }

  if (text.length > charLimit) {
    return text.substring(0, charLimit) + "...";
  }

  return text;
};

const renderText = (description) => {
  return description.split("\n");
};

export { create, update, getPosts, deletePost, limitText, renderText };
