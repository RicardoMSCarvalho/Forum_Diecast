import { useState } from "react";
import { post } from "../../services/Endpoint";
import toast from "react-hot-toast";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (image) {
        formData.append("postimg", image);
      }
      formData.append("title", title);
      formData.append("description", description);

      const response = await post("/post/create", formData);
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setImage(null);
        setDescription("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container">
      <div className="row form-add-post">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header text-white">
              <h2 className="title-add-post">Add New Post</h2>
            </div>
            <div className="card-body p-4">
              <div method="post" encType="multipart/form-data">
                <div className="mb-4">
                  <label htmlFor="postImage" className="form-label">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="postTitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="postTitle"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="postDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="postDescription"
                    rows="6"
                    placeholder="Write your post description here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                  >
                    Submit Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
