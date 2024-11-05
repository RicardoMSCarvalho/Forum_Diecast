import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/AuthSlice";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post("/auth/login", value);
      const response = request.data;

      if (request.status == 200) {
        dispatch(setUser(response.user));
        navigate("/");
        toast.success(response.message);
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
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-4">
          <div className="mb-4 text-dark text-decoration-none d-flex align-items-center">
            <Link to={"/"}>
              <span className="h4 mb-0 fw-bold text-white">MiniCollector</span>
            </Link>
          </div>
          <div className="card shadow-sm w-100" style={{ maxWidth: "400px" }}>
            <div className="card-body p-4">
              <h1 className="h5 mb-4 fw-bold text-dark">
                <center>Log in</center>
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    className="form-control"
                    id="email"
                    placeholder="example@gmail.com"
                    value={value.email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    value={value.password}
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Optional content can be added here */}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Log in
                </button>
              </form>
              <p className="mt-3 mb-0 text-muted">
                Create a new account?
                <Link to="/register" className="text-primary">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
