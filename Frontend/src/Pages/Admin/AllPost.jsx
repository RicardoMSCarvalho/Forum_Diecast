import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BaseUrl, remove, get } from "../../services/Endpoint";
import toast from "react-hot-toast";
import { limitText } from "../../../../Backend/controllers/Post";

export default function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loadedata, setLoadedata] = useState(false);

  const renderDescriptionWithBreaks = (description) => {
    return description.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  const handleDelete = async (postID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmed) {
      try {
        const response = await remove(`/post/delete/${postID}`);
        const data = response.data;

        if (data.success) {
          toast.success(data.message);
          setLoadedata(!loadedata);
        } else {
          toast.error("Failed to delete the post.");
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
      <h1 className="text-center mb-4 text-dark">
        {posts.length > 0 ? "All Posts" : "Nothing found 😥"}
      </h1>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div
                className="card1"
                style={{
                  overflow: "hidden",
                }}
              >
                <Link to={`/post/${post._id}`}>
                  <img
                    src={`${BaseUrl}/images/${post.image}`}
                    className="card-img-top img-fluid"
                    alt={post.title}
                  />
                </Link>
                <div className="card-body-post bg-dark text-white">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">
                    {renderDescriptionWithBreaks(
                      limitText(post.description, 30, 2)
                    )}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-end bg-dark ">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-black text-center w-100 ">
            <p style={{ fontWeight: "700" }}>
              Seems like we dont have any post to show you
            </p>
            <p>
              Click <Link to="/dashboard/addpost">here</Link> to add a new post
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
