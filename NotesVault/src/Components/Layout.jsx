// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
//import Footer from "/Components/Footer.jsx";
import Footer from "./Footer/Footer";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <Outlet /> {/*Children will come here*/}
      <Footer />
    </>
  );
};

export default Layout;
