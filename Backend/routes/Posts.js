import express from "express";
import { create, deletePost, getPosts, update } from "../controllers/Post.js";
import { upload } from "../middleware/Multer.js";
import { isAdmin } from "../middleware/CheckAdmin.js";

const PostRoutes = express.Router();

PostRoutes.post("/create", isAdmin, upload.single("postimg"), create);
PostRoutes.patch("/update/:id", isAdmin, upload.single("postimg"), update);
PostRoutes.get("/getposts", getPosts);
PostRoutes.delete("/delete/:id", deletePost);

export default PostRoutes;
