import Postmodel from "../models/Post.js";
import CommentModel from "../models/Commments.js";
import UserModal from "../models/User.js";
import fs from "fs";
import path from "path";
import { deleteImage } from "../middleware/DeleteImage.js";
import { deletePost } from "./Post.js";

const Dashboard = async (req, resp) => {
  try {
    const Users = await UserModal.find();
    const Posts = await Postmodel.find();
    const comments = await CommentModel.find();

    if (!Users && !Posts && !comments) {
      return resp
        .status(404)
        .json({ success: false, message: "No data has been Found" });
    }
    resp.status(200).json({ success: true, Users, Posts, comments });
  } catch (error) {
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const GetUsers = async (req, resp) => {
  try {
    const Users = await UserModal.find();
    if (!Users) {
      resp.status(404).json({
        success: false,
        message: "You don't have any user registered",
      });
    }
    resp.status(200).json({ success: true, Users });
  } catch (error) {
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const DeleteUser = async (req, resp) => {
  try {
    const userID = req.params.id;

    const ExistUser = await UserModal.findById(userID);
    if (!ExistUser) {
      return resp
        .status(404)
        .json({ success: false, message: "No User Found" });
    }
    const comments = await CommentModel.find({ userID });

    const postIDs = [
      ...new Set(comments.map((comment) => comment.postID.toString())),
    ];
    const commentIDs = await comments.map((comment) => comment._id);

    await Postmodel.updateMany(
      { _id: { $in: postIDs } },
      {
        $pull: {
          comments: { $in: commentIDs },
        },
      }
    );
    await CommentModel.deleteMany({
      _id: { $in: commentIDs },
    });

    if (ExistUser.role == "admin") {
      return resp.status(404).json({
        success: false,
        message: "Ups, You can't remove and Admin account",
      });
    }

    if (ExistUser.profile) {
      const deleted = await deleteImage(ExistUser.profile);
      if (!deleted) {
        return resp.status(500).json({
          success: false,
          message: "Failed to delete old profile image.",
        });
      }
    }
    const DeleteUser = await UserModal.findByIdAndDelete(userID);
    resp.status(200).json({
      success: true,
      message: "User deleted Successfully",
      User: DeleteUser,
    });
  } catch (error) {
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { Dashboard, GetUsers, DeleteUser };
