import jwt from "jsonwebtoken";
import UserModal from "../models/User.js";
import bcrypt from "bcryptjs";

import { deleteImage } from "../middleware/DeleteImage.js";

const Register = async (req, resp) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password || !req.file) {
      return resp.status(400).json({
        success: false,
        message: "Please provided all the necessary details",
      });
    }

    const imagePath = req.file.filename;

    const existUser = await UserModal.findOne({ email });
    if (existUser) {
      return resp
        .status(301)
        .json({ success: false, message: "User Already Exist Please Login" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModal({
      fullname: fullname,
      email,
      password: hashPassword,
      profile: imagePath,
    });
    await newUser.save();
    resp.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    resp.status(500).json({ error: "Error during registration" });
  }
};

const Login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const FindUser = await UserModal.findOne({ email });
    if (!FindUser) {
      return resp.status(404).json({
        success: false,
        message: "Account not found. Please register.",
      });
    }
    const comparePassword = await bcrypt.compare(password, FindUser.password);
    if (!comparePassword) {
      return resp
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userID: FindUser._id }, process.env.JWT_SECRET);
    resp.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return resp.status(200).json({
      success: true,
      message: "Login successfully",
      user: FindUser,
      token,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: "Internal server error" });
  }
};

const Logout = async (req, resp) => {
  try {
    resp.clearCookie("token");
    return resp.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const Update = async (req, resp) => {
  try {
    const userID = req.params.id;
    const { fullname, oldpassword, newpassword } = req.body;

    if ((!oldpassword && newpassword) || (oldpassword && !newpassword))
      return resp.status(400).json({
        message: "You need to fill both password fields",
      });

    const ExistUser = await UserModal.findById(userID);
    if (!ExistUser) {
      return resp
        .status(404)
        .json({ success: false, message: "Account not found." });
    }

    if (fullname) {
      ExistUser.fullname = fullname;
    }
    if (oldpassword) {
      const comparePassword = await bcrypt.compare(
        oldpassword,
        ExistUser.password
      );
      if (!comparePassword) {
        return resp
          .status(401)
          .json({ success: false, message: "Old password is incorrect." });
      }
    }

    if (oldpassword && newpassword) {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      ExistUser.password = hashedPassword;
    } else if (oldpassword && !newpassword) {
      return resp.status(400).json({
        success: false,
        message: "New password is required when old password is provided.",
      });
    }
    if (req.file) {
      const deleted = await deleteImage(ExistUser.profile);
      if (!deleted) {
        return resp.status(500).json({
          success: false,
          message: "Failed to delete old profile image.",
        });
      }
      const imagePath = req.file.filename;
      ExistUser.profile = imagePath;
    }

    await ExistUser.save();

    resp.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: ExistUser,
    });
  } catch (error) {
    resp.status(500).json(error.message);
  }
};

export { Register, Login, Logout, Update };
