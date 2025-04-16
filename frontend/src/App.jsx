import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingApp from "./landing_page/Components/Landingapp";
import Userapp from "./userpanel/Components/Userapp";
import Adminapp from "./adminpanel/Components/Adminapp";
// import LandingApp from "./landing_page/Components/Landingapp";

function App() {
  const token = localStorage.getItem("token");
  window.authToken = token;

  return (
      <Adminapp />
  );
}

export default App;
