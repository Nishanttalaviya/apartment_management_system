import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Adminapp from "../adminpanel/Components/Adminapp";
import LandingApp from "../landing_page/Components/Landingapp";
import Home from "../userpanel/Components/Home";
const AppRoute = () => {
  return (
    <Router>
      <Routes>
      <Route path="/landingapp" element={<LandingApp />} />
        <Route path="/userapp" element={<Home />} />
        <Route path="/adminapp" element={<Adminapp />} />
      </Routes>
    </Router>
  )
}

export default AppRoute