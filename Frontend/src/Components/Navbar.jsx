import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl, post } from "../services/Endpoint";
import { removeUser } from "../redux/AuthSlice";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      const request = await post("/auth/logout");
      const response = request.data;
      if (request.status == 200) {
        navigate("/login");
        dispatch(removeUser());
        toast.success(response.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <nav className="navbar">
      <Link to={"/"}>
        <div className="logo">MiniCollector</div>
      </Link>
      <div className="d-flex align-items-center">
        {!user ? (
          <Link to={"/login"}>
            <button className="btn_sign mx-3">Sign in</button>
          </Link>
        ) : (
          <div className="dropdown">
            <div
              className="avatar-container"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={`${BaseUrl}/images/${user.profile}`}
                alt="Avatar"
                style={{ objectFit: "cover" }}
                className="img-fluid h-100 w-100"
              />
            </div>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              {user.role == "admin" ? (
                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              ) : (
                ""
              )}
              <li>
                <Link className="dropdown-item" to={`/profile/${user._id}`}>
                  Profile
                </Link>
              </li>
              <li>
                <a
                  className="dropdown-item "
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
