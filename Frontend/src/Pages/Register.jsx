import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Register() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [value, setValue] = useState({
    fullname: "",
    email: "",
    password: "",
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue({ ...value, image: file });
  };

  const handleImageClick = () => {
    document.getElementById("image").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", value.fullname);
    formData.append("email", value.email);
    formData.append("password", value.password);
    formData.append("profile", value.image);

    try {
      const response = await post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (data.success) {
        navigate("/login");
        toast.success(data.message);
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
  };

  return (
    <>
      <section className="bg-light">
        <div className="centered-container">
          <div href="#" className="div-logo">
            <Link to={"/"}>
              <span className="form-logo">MiniCollector</span>
            </Link>
          </div>
          <div className="box-form">
            <div className="card-body p-4">
              <h1 className="h5 fw-bold text-dark">
                <center>Create an account</center>
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="text-center">
                  <div className="d-flex justify-content-center ">
                    <img
                      src={value.image ? URL.createObjectURL(value.image) : ""}
                      alt="Click to add image"
                      width="100"
                      height="100"
                      style={{ cursor: "pointer", backgroundColor: "white" }}
                      onClick={handleImageClick}
                    />
                  </div>
                  <input
                    type="file"
                    className="form-control d-none"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fullname" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    placeholder="John Doe"
                    value={value.fullname}
                    onChange={(e) =>
                      setValue({ ...value, fullname: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@company.com"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="••••••••"
                    value={value.password}
                    onChange={(e) =>
                      setValue({ ...value, password: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Sign up
                </button>
              </form>
              <p className="text-details">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
