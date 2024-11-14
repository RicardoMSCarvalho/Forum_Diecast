import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Post from "./Pages/Post";

import UserLayout from "./Layout/UserLayout";
import Admin from "./Pages/Admin/Admin";
import Adminlayout from "./Layout/Adminlayout";
import AddPost from "./Pages/Admin/AddPost";
import User from "./Pages/Admin/User";
import AllPost from "./Pages/Admin/AllPost";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Toaster } from "react-hot-toast";
import Profile from "./Pages/Profile";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="bottom-right" />
           <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="post/:postID" element={<Post />}/>
                <Route path="/profile/:userID" element={<Profile />}/>
              </Route>
              <Route path="/dashboard" element={<Adminlayout />}>
                <Route index element={<Admin />} />
                <Route path="addpost" element={<AddPost />} />
                <Route path="users" element={<User />} />
                <Route path="allposts" element={<AllPost />} />
              </Route>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
      </BrowserRouter>
    </>
  );
}
