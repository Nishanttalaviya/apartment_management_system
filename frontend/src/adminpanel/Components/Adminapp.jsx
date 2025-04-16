import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Profile from "./Profile";
import AdminMaintenancePage from "./AdminMaintenancePage ";
import AdminComplaints from "./AdminComplaints ";
import AdminHallBookingPage from "./AdminHallBookingPage ";
import AdminNoticeBoardPage from "./AdminNoticeBoardPage ";
import AdminVisitorManagementPage from "./AdminVisitorManagementPage ";
import AdminVehicleInfoPage from "./AdminVehicleInfoPage ";
import Home from "./Home";
import AdminAddMembers from "./AdminAddMembers";

const Adminapp = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prevState) => !prevState);
  };

  return (
    <div className={`wrapper ${isSidebarExpanded ? "sidebar-expanded" : ""}`}>
      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
      />
      <div className="main">
        <Navbar />
        <main className="content px-3 py-4">
          <Routes>
            <Route index element={<Home />} />
            <Route path="adminAddMembers" element={<AdminAddMembers />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="adminMaintenancePage"
              element={<AdminMaintenancePage />}
            />
            <Route path="adminComplaints" element={<AdminComplaints />} />
            <Route
              path="adminHallBookingPage"
              element={<AdminHallBookingPage />}
            />
            <Route
              path="adminNoticeBoardPage"
              element={<AdminNoticeBoardPage />}
            />
            <Route
              path="adminVisitorManagementPage"
              element={<AdminVisitorManagementPage />}
            />
            <Route
              path="adminVehicleInfoPage"
              element={<AdminVehicleInfoPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Adminapp;
