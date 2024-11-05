import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseUrl, get } from "../services/Endpoint";
import { LimitText } from "../../../Backend/controllers/Post";
export default function LatestPost() {
  const navigation = useNavigate();
  const [posts, setPosts] = useState([]);

  const handlePost = (id) => {
    navigation(`/post/${id}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const request = await get("/post/getposts");
        const response = request.data;
        setPosts(response.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="container">
        <div className="mb-5 ">
          <h2 className="fw-bold fs-1 text-white">Latest Posts</h2>
        </div>
        <div className="row">
          {posts &&
            posts.map((elem) => {
              return (
                <div className="col-md-4 mb-4" key={elem._id}>
                  <div
                    className="card"
                    style={{
                      borderWidth: "2px",
                      backgroundColor: "#2b2b2b",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`${BaseUrl}/images/${elem.image}`}
                      className="card-img-top img-fluid"
                      alt={elem.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body bg-dark text-white">
                      <h5 className="card-title">{elem.title}</h5>
                      <p className="card-text">
                        {LimitText(elem.description, 20)}
                      </p>
                      <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={() => handlePost(elem._id)}
                      >
                        Read Article
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
