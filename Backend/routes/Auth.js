import express from "express";
import { Login, Logout, Register, Update } from "../controllers/Auth.js";
import { upload } from "../middleware/Multer.js";
import { isLogin } from "../middleware/CheckAdmin.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", upload.single("profile"), Register);
AuthRoutes.post("/login", Login);
AuthRoutes.patch("/profile/:id", isLogin, upload.single("profile"), Update);
AuthRoutes.post("/logout", Logout);
export default AuthRoutes;
