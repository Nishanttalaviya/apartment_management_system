import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./Home";
import Maintenance from "./Maintenance";
import Complain from "./Complain";
import Booking from "./Booking";
import NoticeBoard from "./NoticeBoard";
import VehicleInfo from "./VehicleInfo";
import Footer from "./Footer";
<<<<<<< HEAD
=======

>>>>>>> 77432883d7ed313c05228b7e989f36b04db53a6b
import AddVisitorPage from "./AddVisitorPage";

const Userapp = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
<<<<<<< HEAD
          <Route index element={<Home />} />
          <Route path="maintenance/*" element={<Maintenance />} />
          <Route path="complain" element={<Complain />} />
          <Route path="booking" element={<Booking />} />
          <Route path="notice-board" element={<NoticeBoard />} />
          <Route path="vehicle-info" element={<VehicleInfo />} />
          <Route path="addVisitorPage" element={<AddVisitorPage />} />
=======
          <Route path="/" element={<Home />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/complain" element={<Complain />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/vehicle-info" element={<VehicleInfo />} />
          <Route path="/addVisitorPage" element={<AddVisitorPage />} />
>>>>>>> 77432883d7ed313c05228b7e989f36b04db53a6b
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default Userapp;
