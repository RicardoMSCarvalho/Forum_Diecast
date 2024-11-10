import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Dashboard/Sidebar";
import { useSelector } from "react-redux";

export default function Adminlayout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <div className="total">
        <Navbar />
        <div className="d-flex" style={{ minHeight: "800px" }}>
          <Sidebar />
          <div className="content flex-grow-1 p-4 bg-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
