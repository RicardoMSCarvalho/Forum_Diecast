import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/Endpoint";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/AuthSlice";
import toast from "react-hot-toast";

export default function Login() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
        <div className="container-login">
          <div className="div-logo">
            <Link to={"/"}>
              <span className="form-logo">MiniCollector</span>
            </Link>
          </div>
          <div className="box-form">
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

                <button type="submit" className="btn btn-primary w-100">
                  Log in
                </button>
              </form>
              <p className="text-details">
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
