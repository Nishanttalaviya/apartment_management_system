import "../Assets/css/landingstyle.css"; // Minimal additional custom styles

const LandingFooter = () => {
  return (
    <footer className=" py-5" style={{ backgroundColor: "#D9D9D9", color:"#052C65" }}>
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-4 mb-4">
          <h2 className=" fw-bold">RNV</h2>
          <p>Copyright © 2026 RNV</p>
            <p>Designed by RNV</p>
          </div>

          {/* About Us */}
          <div className="col-md-4 mb-4" style={{color:"#052C65"}}>
            <h5>About Us</h5>
            <p>
              To bridge the gap between residents and management through
              intuitive technology, ensuring better communication, transparency,
              and convenience for all.
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4"style={{color:"#052C65"}}>
            <h5>Contact Info</h5>
            <p>Umiya Chowck, Rajkot, Gujarat</p>
            <p>+91 7984767883</p>
            <p>rnv123@gmail.com</p>
          </div>
        </div>

        {/* Social Links and Bottom Links */}
        <div className="row align-items-center mt-4"style={{color:"#052C65"}}>
          {/* Follow Us Section */}
          <div className="col-md-6 d-flex align-items-center">
            <p className="mb-0 me-3">Follow Us</p>
            <div className="d-flex gap-3">
              <i className="bi bi-instagram fs-4"></i>
              <i className="bi bi-facebook fs-4"></i>
              <i className="bi bi-twitter fs-4"></i>
              <i className="bi bi-linkedin fs-4"></i>
            </div>
          </div>

          {/* Privacy and Terms Links */}
          <div className="col-md-6 text-md-end text-center mt-3 mt-md-0">
            <a href="#privacy" className="mx-2">
              Privacy
            </a>
            <a href="#terms" className="mx-2">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;