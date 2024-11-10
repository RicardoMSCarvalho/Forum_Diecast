import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BaseUrl, get, post } from "../services/Endpoint";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { renderText } from "../../../Backend/controllers/Post";

export default function Post() {
  const { postID } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [singlePost, setSinglePost] = useState(null);
  const [comment, setComment] = useState("");
  const [loaddata, setLoaddata] = useState(false);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const request = await get(`/public/Singlepost/${postID}`);
        const response = request.data;
        setSinglePost(response.Post);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchSinglePost();
  }, [loaddata, postID]);

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("To be able to add a comment you need to Login");
    } else {
      try {
        const request = await post("/comment/addcomment", {
          comment,
          postID,
          userID: user._id,
        });
        const response = request.data;
        setLoaddata((prevState) => !prevState);
        if (response.success) {
          toast.success(response.message);
          setComment("");
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

  const renderDescriptionWithParagraphs = (description) => {
    const lines = renderText(description);
    return lines.map((line, index) => <div key={index}>{line}</div>);
  };

  return (
    <div className="container text-white mt-5 mb-5">
      <div className="row">
        <div className="col-md-12">
          <div className="titlepost">{singlePost && singlePost.title}</div>
          <img
            src={singlePost && `${BaseUrl}/images/${singlePost.image}`}
            alt="Post image"
            className="img-fluid mb-4"
            style={{
              borderRadius: "10px",
              maxHeight: "500px",
              objectFit: "cover",
              width: "100%",
            }}
          />

          <div className="mb-5">
            {singlePost &&
              renderDescriptionWithParagraphs(singlePost.description)}
          </div>
          <hr />

          <h3 className="mt-5 mb-4">Leave a Comment</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Comment
              </label>
              <textarea
                className="form-control"
                id="comment"
                rows="4"
                placeholder="Write your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={onSubmitComment}
            >
              Add Comment
            </button>
          </form>

          <hr />

          <h3 className="mt-5 mb-4">Comments</h3>
          {singlePost &&
            singlePost.comments &&
            singlePost.comments.map((elem, index) => {
              return (
                <div
                  className="bg-secondary p-3 rounded mb-3 d-flex"
                  key={index}
                >
                  <img
                    src={`${BaseUrl}/images/${elem.userID.profile}`}
                    alt="John Doe"
                    className="me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h5 className="mb-1">{elem.userID.fullname}</h5>
                    <p className="mb-0">{elem.comment}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
