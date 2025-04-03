import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Assets/css/landingstyle.css";
import login from "../Assets/image/login.jpg";
import logo from "../Assets/image/rnvlogo.png";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    // For demo purposes - just navigate to dashboard
    navigate("/userapp");
    
    // If you want to remember the email (without actual auth)
    if (formData.rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    }
  };

  return (
    <div className="signin-container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="row w-100">
        <div className="w-100" style={{ height: "20px", backgroundColor: "#052C65" }}></div>

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
              onClick={() => navigate(-1)}
              className="btn text-dark fs-5"
              aria-label="Go back"
            >
              ← Back
            </button>
          </div>

          <div className="text-center mb-4">
            <img
              src={logo}
              className="img-fluid mb-2"
              style={{ width: "250px" }}
              alt="Company Logo"
            />
            <h3>Sign In</h3>
            <p className="text-muted">Sign in with your details to continue</p>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              style={{ backgroundColor: "#052C65" }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-3 text-center w-100" style={{ maxWidth: "400px" }}>
            <p className="text-muted">
              Forgot Password? <Link to="/forgot-password">Click here</Link>
            </p>
            <p className="text-muted">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;