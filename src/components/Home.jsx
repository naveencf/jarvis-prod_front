import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
const Home = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const status = decodedToken.onboard_status;
  return (
    <>
      {status !== 2 ? (
        <Navigate to={"/admin"} />
      ) : (
        <Navigate to={"/pre-onboard-user-from"} />
      )}
    </>
  );
};
export default Home;
