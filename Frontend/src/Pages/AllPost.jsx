import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BaseUrl, delet, get } from "../services/Endpoint";
import toast from "react-hot-toast";
import { LimitText } from "../../../Backend/controllers/Post";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loadedata, setLoadedata] = useState(false);

  const handleDelete = async (postID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      try {
        const response = await delet(`/post/delete/${postID}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadedata(!loadedata);
        } else {
          toast.error("Failed to delete the user.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const getposts = async () => {
      try {
        const response = await get("/post/getposts");
        const data = response.data;
        setPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    getposts();
  }, [loadedata]);

  return (
    <div className="container ">
      <h1 className="text-center mb-4 text-dark">All Posts</h1>
      <div className="row">
        {posts &&
          posts.map((post, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div
                className="card"
                style={{
                  overflow: "hidden",
                }}
              >
                <Link to={`/post/${post._id}`}>
                  <img
                    src={`${BaseUrl}/images/${post.image}`}
                    className="card-img-top img-fluid"
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body bg-dark text-white">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{LimitText(post.description, 20)}</p>
                </div>
                <div className="card-footer d-flex justify-content-between bg-dark ">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
