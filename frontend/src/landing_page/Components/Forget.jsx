import "../Assets/css/landingstyle.css"; // Optional custom styles
import logo from "../Assets/image/rnvlogo.png"; // Update the path to your logo
import forget from "../Assets/image/forget.jpg"; // Update the path to your logo
import { Link } from "react-router-dom";

const Forget = () => {
  return (
    <div
      className="container-fluid p-0"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      {/* Top Bar */}
      <div className="w-100" style={{ height: "20px", backgroundColor: "#052C65" }}></div>
      

      {/* Main Content */}
      <div className="row w-100 h-100">
        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-whaite">
          <img
            src={logo}
            alt="RNV Estate Logo"
            className="img-fluid mb-3"
            style={{ width: "200px" }}
          />
          <h3 className="text-center mb-3">Forgot Password</h3>
          <p className="text-center text-muted mb-4">
            Enter your email to reset your password
          </p>
          <form className="w-100" style={{ maxWidth: "400px" }}>
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
              />
            </div>
            <br/>
            <button type="submit" className="btn w-100" style={{ backgroundColor: "#052C65", color: "#fff" }}>
            <Link to="/Reset" style={{ color: "#fff", textDecoration: "none", display: "block", width: "100%" }}>Send OTP</Link>
            </button>
          </form>
        

        </div>

        {/* Right Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light px-5 py-4">
          <div className="text-center">
            <img
              src={forget} // Path to the uploaded image
              alt="Forgot Password Illustration"
              className="img-fluid mb-3"
              style={{ maxWidth: "80%" }}
            />
            <h4>Efficient Living Starts Here</h4>
            <p className="text-muted">
              Our platform is built to meet the needs of apartment communities
              with intuitive, practical, and accessible features.
            </p>
            <p className="text-muted small">
              Copyright © 2023 RNV Designed by RNV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
