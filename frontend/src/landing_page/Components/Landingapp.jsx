import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";
import Signin from "./Signin";
import Forget from "./Forget";
import Reset from "./Reset";
import Confirm from "./Confirm";
import HeroSection from "./HeroSection";
import AboutUs from "./AboutUs";
import WhyChooseUs from "./WhyChooseUs";
import Services from "./Services";
import Apartments from "./Apartments";
import ContactUs from "./ContactUs";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter = [
    "/sign_in",
    "/forget",
    "/reset",
    "/confirm",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbarFooter && <LandingNavbar />}
      {children}
      {!hideNavbarFooter && <LandingFooter />}
    </>
  );
};

const LandingApp = () => {
  return (
    <Routes>
      {/* Home Page with Navbar & Footer */}
      <Route
        path="/"
        element={
          <Layout>
            <HeroSection />
            <AboutUs />
            <WhyChooseUs />
            <Services />
            <Apartments />
            <ContactUs />
          </Layout>
        }
      />

      {/* Dynamic Pages without Navbar & Footer */}
      <Route path="/sign_in" element={<Signin />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/confirm" element={<Confirm />} />
    </Routes>
  );
};

export default LandingApp;
