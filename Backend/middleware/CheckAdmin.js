import jwt from "jsonwebtoken";
import UserModal from "../models/User.js";

const isAdmin = async (req, resp, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return resp
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModal.findById(decoded.userID);

    if (!user) {
      return resp.status(403).json({ message: "Unauthorized: User not found" });
    }

    if (user.role !== "admin") {
      return resp
        .status(403)
        .json({ message: "Unauthorized: User is not an admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    return resp.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
const isLogin = async (req, resp, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return resp.status(401).json({ message: "Unauthorized: Please Login " });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModal.findById(decoded.userID);
    if (!user) {
      return resp.status(403).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return resp.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export { isAdmin, isLogin };
