import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingApp from "./landing_page/Components/Landingapp";
import Userapp from "./userpanel/Components/Userapp";
import Adminapp from "./adminpanel/Components/Adminapp";
import ProtectedRoute from "./ProtectedRoute"; // Import the new component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = localStorage.getItem("token");
  window.authToken = token;

  return (
    <Router>
      {/* ✅ Toast Container added here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/*" element={<LandingApp />} />

        {/* Protected Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <Userapp />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/*" element={<Adminapp />} />
      </Routes>
    </Router>
  );
}

export default App;
