import { NavLink, useNavigate } from "react-router-dom";
import "../Assets/css/userstyle.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Define all paths with absolute URLs
  const paths = {
    home: "/user",
    maintenance: "/user/maintenance",
    complain: "/user/complain",
    booking: "/user/booking",
    noticeBoard: "/user/notice-board",
    addVisitor: "/user/addVisitorPage",
    vehicleInfo: "/user/vehicle-info",
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#052C65" }}
    >
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold text-white fs-2"
          to={paths.home}
        >
          RNV
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.home}
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.maintenance}
              >
                Maintenance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.complain}
              >
                Complain
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.booking}
              >
                Booking
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.noticeBoard}
              >
                Notice Board
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.addVisitor}
              >
                Add Visitor
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to={paths.vehicleInfo}
              >
                Vehicle Info
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("memberid");
                  navigate("/sign_in", { replace: true });
                  window.location.reload();
                }}
                className={({ isActive }) =>
                  `nav-link text-white ${isActive ? "active" : ""}`
                }
                to="/user/logout"
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
