import express from "express";
import { isAdmin } from "../middleware/CheckAdmin.js";
import { Dashboard, DeleteUser, GetUsers } from "../controllers/Dashboard.js";

const DashboardRoutes = express.Router();

DashboardRoutes.get("/", isAdmin, Dashboard);
DashboardRoutes.get("/users", isAdmin, GetUsers);
DashboardRoutes.delete("/delete/:id", isAdmin, DeleteUser);

export default DashboardRoutes;
