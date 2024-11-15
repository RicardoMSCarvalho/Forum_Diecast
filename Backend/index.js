import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/Auth.js";
import DBCon from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import PostRoutes from "./routes/Posts.js";
import DashboardRoutes from "./routes/Dashboard.js";
import CommentRoutes from "./routes/Comments.js";
import PublicRoutes from "./routes/Public.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
DBCon();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const corsOptoins = {
  origin: true,
  credentials: true,
};

app.get("/", (req, resp) => {
  resp.send("hello from server");
});

// Enable CORS
app.use(cors(corsOptoins));

app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/comment", CommentRoutes);
app.use("/public", PublicRoutes);

app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});
