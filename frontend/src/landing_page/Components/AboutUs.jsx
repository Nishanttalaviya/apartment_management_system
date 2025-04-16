// import { useEffect } from "react";
// import AOS from "aos"; // Import AOS
// import "aos/dist/aos.css"; // Import AOS styles
import c4 from "../Assets/image/2.jpg";

const AboutUs = () => {
    // useEffect(() => {
    //   AOS.init({
    //     duration: 1000, // Default duration for all animations
    //     easing: "ease-in-out", // Smooth animation effect
    //     once: true, // Animation triggers only once
    //     mirror: false, // Disable animation on scroll back
    //   });
    //   AOS.refresh(); // Refresh animations after initialization
    // }, []);
  
    return (
      <div id="aboutUs" className="container py-5 scroll-section">
        {/* Section Header */}
        <div
          className="text-center mb-5"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <h2 className="fw-bold">About Us</h2>
          <p className="text-muted">Our Introduction</p>
        </div>

        {/* Content Section */}
        <div className="row align-items-center">
          {/* Left Content - Image */}
          <div
            className="col-md-4 d-flex justify-content-center"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <img
              src={c4} // Replace with your image URL
              alt="About Us"
              style={{
                width: "400px",
                height: "400px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right Content */}
          <div className="col-md-8">
            <div className="row g-3">
              {/* Card 1 */}
              <div
                className="col-md-4"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="200"
              >
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <span className="fs-2 text-primary">
                      <i className="bi bi-lock"></i>
                    </span>
                    <h6 className="mt-3 fw-bold">Real-Time Communication</h6>
                    <p className="text-muted small">
                      Connect residents and management effortlessly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="col-md-4"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="400"
              >
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <span className="fs-2 text-primary">
                      <i className="bi bi-tools"></i>
                    </span>
                    <h6 className="mt-3 fw-bold">Maintenance</h6>
                    <p className="text-muted small">
                      Simplify maintenance requests and resolutions for better
                      service quality.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="col-md-4"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="600"
              >
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <span className="fs-2 text-primary">
                      <i className="bi bi-shield-lock"></i>
                    </span>
                    <h6 className="mt-3 fw-bold">Data Security</h6>
                    <p className="text-muted small">
                      Ensure data safety and reliability for all apartment
                      management tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div
              className="mt-4"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="800"
            >
              <p className="text-muted">
                We are a dedicated team focused on making apartment living and
                management smarter, simpler, and stress-free. With a blend of
                innovative technology and user-centric design, our platform
                ensures better communication, transparent management, and a
                seamless living experience. Join us in revolutionizing the way
                apartments are managed!
              </p>
            </div>

            {/* Button Section */}
            <div
              className="mt-3"
              data-aos="fade-up"
              data-aos-duration="1200"
              data-aos-delay="1000"
            >
              <button className="btn btn-outline-dark">Know More</button>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUs;