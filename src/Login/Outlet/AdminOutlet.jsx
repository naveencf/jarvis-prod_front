import { Navigate, Outlet } from "react-router-dom";
import NavSideBar from "../../components/AdminPanel/Navbar-Sidebar/NavSideBar";

const AdminOutlet = () => {
  return (
    <div>
      <NavSideBar />
    </div>
  );
};

export default AdminOutlet;
