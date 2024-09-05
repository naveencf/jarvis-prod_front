import { Navigate, Outlet } from "react-router-dom";
const Protected = () => {
  const token = sessionStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to={"/login"} />;
};

export default Protected;
