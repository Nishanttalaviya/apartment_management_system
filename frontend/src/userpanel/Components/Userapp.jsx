import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./Home";
import Maintenance from "./Maintenance";
import Complain from "./Complain";
import Booking from "./Booking";
import NoticeBoard from "./NoticeBoard";
import VehicleInfo from "./VehicleInfo";
import Footer from "./Footer";
import AddVisitorPage from "./AddVisitorPage";

const Userapp = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
          <Route path="maintenance/*" element={<Maintenance />} />
          <Route path="complain" element={<Complain />} />
          <Route path="booking" element={<Booking />} />
          <Route path="notice-board" element={<NoticeBoard />} />
          <Route path="vehicle-info" element={<VehicleInfo />} />
          <Route path="addVisitorPage" element={<AddVisitorPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default Userapp;
