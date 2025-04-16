import { Link, useNavigate } from "react-router-dom";
import "../Assets/css/landingstyle.css";
import login from "../Assets/image/login.jpg";
import logo from "../Assets/image/rnvlogo.png";
import { useState } from "react";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4545/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and member data
      localStorage.setItem("token", data.token);
      localStorage.setItem("member", JSON.stringify(data.member));

      // Redirect to user dashboard
      navigate("/user");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signin-container d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="row w-100">
        <div
          className="w-100"
          style={{ height: "20px", backgroundColor: "#052C65" }}
        ></div>

        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-5">
          <img src={login} alt="Efficient Living" className="img-fluid" />
          <h2 className="mt-4 text-center">Efficient Living Starts Here</h2>
          <p className="text-center">
            Our platform is built to meet the needs of apartment communities
            with intuitive, practical, and accessible features.
          </p>
        </div>

        {/* Right Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-5">
          {/* Back Arrow Button */}
          <div className="d-flex justify-content-start w-100 mb-3">
            <button
              onClick={() => navigate("/")}
              className="btn text-dark fs-5"
            >
              ← Back
            </button>
          </div>

          <div className="text-center mb-4">
            <img
              src={logo}
              className="img-fluid mb-2"
              style={{ width: "250px" }}
            />
            <h3>Sign In</h3>
            <p className="text-muted">Sign in with your details to continue</p>
          </div>

          {error && (
            <div
              className="alert alert-danger w-100"
              style={{ maxWidth: "400px" }}
            >
              {error}
            </div>
          )}

          <form
            className="w-100"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSignIn}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
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
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#052C65" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-3 text-muted">
            Forgot Password? <Link to="/Forget">Click here</Link>
          </p>
          <Link
            to="/Signin"
            className="mt-3 text-muted"
            style={{ textDecoration: "none" }}
          >
            &larr; Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;