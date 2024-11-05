import Postmodel from "../models/Post.js";

const GetSinglePost = async (req, resp) => {
  try {
    const postID = req.params.id;
    const Post = await Postmodel.findById(postID).populate({
      path: "comments",
      populate: {
        path: "userID",
      },
    });

    if (!Post) {
      return resp
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    resp.status(200).json({ success: true, Post });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { GetSinglePost };
