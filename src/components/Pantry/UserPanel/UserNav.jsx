import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../../assets/img/logo/logo-icon.png";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import {baseUrl} from '../../../utils/config'

const UserNav = () => {
  const location = window.location.pathname;
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  const loginUserId = decodedToken.id;

  const handleLogOut = () => {
    sessionStorage.clear("token");
    navigate("/login");
  };

  const [loginUserData, setLoginUserData] = useState([]);
  useEffect(() => {
    axios
      .post(baseUrl+"login_user_data", {
        user_id: loginUserId,
      })
      .then((res) => setLoginUserData(res.data));
  }, []);

  // Toggle Dark/Light Theme
  useEffect(() => {
    document.getElementById("theme-toggle").addEventListener("click", (e) => {
      const checked = e.target.checked;
      document.body.setAttribute("theme", checked ? "dark" : "light");
    });
  }, []);

  return (
    <>
      <header>
        <div className="header user_header">
          <div className="container">
            <nav className="navbar navbar-expand-lg">
              <a className="navbar-brand" href="/">
                <img src={logo} alt="Logo" />
                <h4>
                  Creative<span>Fuel</span>{" "}
                  {location === "/pantry-user" && (
                    <span className="text-black-50">Pantry</span>
                  )}
                </h4>
              </a>
              <ul className="navbar-nav right_nav ms-auto">
                <li className="nav-item">
                  <div className="theme-switch">
                    <input type="checkbox" id="theme-toggle" />
                    <label htmlFor="theme-toggle" />
                  </div>
                </li>
                <li className="nav-item dropdown no-arrow user_dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span>{userName}</span>
                    {loginUserData[0]?.image == null ? (
                      <img
                        className="img-profile"
                        src={imageTest1}
                        style={{
                          height: "40px",
                          borderRadius: "50%",
                          width: "40px",
                        }}
                      />
                    ) : (
                      // loginUserData.map((d) => (
                      <img
                        key={1}
                        className="img-profile"
                        src={loginUserData[0]?.image}
                        alt="user"
                        style={{
                          height: "40px",
                          borderRadius: "50%",
                          width: "40px",
                        }}
                      />
                      // ))
                    )}
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in mt16"
                    aria-labelledby="userDropdown"
                  >
                    {/* <Link to="/profile">
                      <a className="dropdown-item">
                        <i className="bi bi-person" />
                        Profile
                      </a>
                    </Link> */}
                    <a onClick={handleLogOut} className="dropdown-item">
                      <i className="bi bi-box-arrow-left" />
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                {/* <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Home
                    </a>
                  </li>
                </ul> */}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default UserNav;
