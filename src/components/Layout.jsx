import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Layout() {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <ToastContainer/>
        </div>

    );
  }
  
  export default Layout;
 