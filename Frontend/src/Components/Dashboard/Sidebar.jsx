import { FaUsers } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdPostAdd } from "react-icons/md";
import { ImStack } from "react-icons/im";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="p-3">
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <Link className="nav-link text-white" to="/dashboard">
              <AiFillDashboard
                className="me-2"
                width="20px"
                height="1.5em"
                color="orange"
              />
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link className="nav-link text-white" to="/dashboard/addpost">
              <MdPostAdd
                color="lightGreen"
                className="me-2"
                width="1.5em"
                height="1.5em"
              />
              Add Post
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link className="nav-link text-white" to="/dashboard/users">
              <FaUsers
                color="red"
                width="1.5em"
                height="1.5em"
                className="me-2"
              />
              All Users
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link className="nav-link text-white" to="/dashboard/allposts">
              <ImStack color="yellow" className="me-2" /> All Posts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
