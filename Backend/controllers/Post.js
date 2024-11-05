import Postmodel from "../models/Post.js";
import fs from "fs";
import path from "path";

const create = async (req, resp) => {
  try {
    const { title, description, image } = req.body;
    if (!title || !description || image)
      return resp
        .status(400)
        .json({ success: false, message: "All the fields are required" });

    if (!req.file) {
      return resp
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }
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
        .json({ success: false, message: "Post couldnt be found" });
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
        .json({ success: false, message: "Post not found" });
    }
    resp.status(200).json({ success: true, posts });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deletePost = async (req, resp) => {
  try {
    const postID = req.params.id;
    const posts = await Postmodel.findById(postID);

    if (!posts) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (posts.image) {
      const profilePath = path.join("public/images", posts.image);
      fs.promises
        .unlink(profilePath)
        .then(() => console.log("Profile image deleted"))
        .catch((error) =>
          console.error("Error deleting profile image:", error.message)
        );
    }
    const deletepost = await Postmodel.findByIdAndDelete(postID);
    resp.status(200).json({
      success: true,
      message: "Post Delete Successfully",
      post: deletepost,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const LimitText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

export { create, update, getPosts, deletePost, LimitText };
