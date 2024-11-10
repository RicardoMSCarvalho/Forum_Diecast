import { useEffect, useState } from "react";
import { get } from "../../services/Endpoint";

export default function Admin() {
  const [post, setPost] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const request = await get("/dashboard");
        const response = request.data;

        if (request.status === 200) {
          setPost(response.Posts);
          setUsers(response.Users);
          setComments(response.comments);
        }
      } catch (error) {
        console.error("Error when fethching for admin data" + error.message);
      }
    };
    getData();
  }, []);

  return (
    <>
      <h2 className="mb-4 text-white">Dashboard</h2>
      <div className="row">
        <div className="col-md-4">
          <div
            className="card text-white mb-4"
            style={{ backgroundColor: "rgb(35, 157, 191)" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{users ? users.length : "0"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card text-white mb-4"
            style={{ backgroundColor: "rgb(255, 184, 6)" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <p className="card-text">{post ? post.length : "0"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card text-white mb-4"
            style={{ backgroundColor: "rgb(249, 134, 2)" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Comments</h5>
              <p className="card-text">{comments ? comments.length : "0"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
