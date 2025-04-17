import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingApp from "./landing_page/Components/Landingapp";
import Userapp from "./userpanel/Components/Userapp";
import Adminapp from "./adminpanel/Components/Adminapp";
import ProtectedRoute from "./ProtectedRoute"; // Import the new component

function App() {
  const token = localStorage.getItem("token");
  window.authToken = token;

  return (
    <Router>
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
