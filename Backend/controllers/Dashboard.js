import Postmodel from "../models/Post.js";
import CommentModel from "../models/Commments.js";
import UserModal from "../models/User.js";
import fs from "fs";
import path from "path";

const Dashboard = async (req, resp) => {
  try {
    const Users = await UserModal.find();
    const Posts = await Postmodel.find();
    const comments = await CommentModel.find();

    if (!Users && !Posts && !comments) {
      return resp
        .status(404)
        .json({ success: false, message: "Not Data Found" });
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
const Delete = async (req, resp) => {
  try {
    const userID = req.params.id;

    const ExistUser = await UserModal.findById(userID);
    if (!ExistUser) {
      return resp
        .status(404)
        .json({ success: false, message: "No User Found" });
    }
    if (ExistUser.role == "admin") {
      return resp.status(404).json({
        success: false,
        message: "Soory Your Admin You Can't Delete You Account",
      });
    }
    if (ExistUser.profile) {
      const profilePath = path.join("public/images", ExistUser.profile);
      fs.promises
        .unlink(profilePath)
        .then(() => console.log("Profile image deleted"))
        .catch((error) =>
          console.error("Error deleting profile image:", error)
        );
    }
    const DeleteUser = await UserModal.findByIdAndDelete(userID);
    resp.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      User: DeleteUser,
    });
  } catch (error) {
    return resp
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { Dashboard, GetUsers, Delete };
