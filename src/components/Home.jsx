// import { Navigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";
// const Home = () => {
//   const storedToken = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(storedToken);
//   const status = decodedToken.onboard_status;
//   return (
//     <>
//       {status !== 2 ? (
//         <Navigate to={"/admin"} />
//       ) : (
//         <Navigate to={"/pre-onboard-user-form"} />
//       )}
//     </>
//   );
// };
// export default Home;

import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Home = () => {
  const storedToken = sessionStorage.getItem("token");

  // If no token found, redirect to login
  if (!storedToken) {
    return <Navigate to="/login" />;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(storedToken);
  } catch (error) {
    console.error("Invalid token:", error);
    // Invalid token, redirect to login
    return <Navigate to="/login" />;
  }

  const status = decodedToken?.onboard_status;

  return (
    <>
      {status !== 2 ? (
        <Navigate to="/admin" />
      ) : (
        <Navigate to="/pre-onboard-user-form" />
      )}
    </>
  );
};

export default Home;
