import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginlogo from "../assets/img/logo/logo_login1.png";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../Context/Context";
import { baseUrl } from "../utils/config";
import "./Login.css"; // Add relevant CSS
import "./LoginResponsive.css";
import useIPAddress from "../components/AdminPanel/User/UserDashboard/LoginHistory/UseIPAddress";

const Login = () => {
  const ip = useIPAddress();
  // const { toastError } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "login_user", {
        user_login_id: email,
        user_login_password: password,
        ip_address: ip,
      })
      .then((res) => {
        if (!res.data.token) {
          navigate("/login");
        } else {
          const token = res.data.token;
          const decodedToken = jwtDecode(token);
          const status = decodedToken.user_status;
          const deptId = decodedToken.dept_id;
          const onboardStatus = decodedToken.onboard_status;

          if (status === "Active") {
            if (deptId === 36 && (onboardStatus === 1 || onboardStatus === 0)) {
              navigate("/admin/sales-dashboard");
            } else {
              navigate("/");
            }
            sessionStorage.setItem("token", token);
            setTimeout(() => {
              sessionStorage.removeItem("token");
              navigate("/login");
            }, 1000 * 60 * 60 * 10); // 10 hours
          } else {
            navigate("/login");
            // toastError("You are an inactive user");
          }
        }
      })
      .catch((error) => {
        setIsError(error);
      });
  };

  return (
    <>
      <section className="section authwrapper">
        <div className="authbox">
          <div className="authlogo authbrand_spacing">
            <img src={loginlogo} alt="CreativeFuel" />
          </div>
          <div className="authform_area">
            <div className="authform_head">
              <h2 style={{ color: "black" }}>Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="authform">
                {/* Email input */}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      className="form-control"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      className="password-toggle-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer", marginLeft: "-30px" }}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </span>
                  </div>
                </div>

                {/* Display error message */}
                {isError !== "" && (
                  <div className="form-group errorMessage">
                    <span>{isError?.response?.data?.error}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="form-group">
                  <button className="btn btn-icon btn_primary" type="submit">
                    <i className="fas fa-arrow-right" />
                  </button>
                </div>

                {/* Forgot password link */}
                <div className="forgotPassword form-group">
                  <button
                    style={{ color: "blue" }}
                    className="btn link_btn"
                    type="button"
                    onClick={() => {
                      navigate("/forget-password");
                    }}
                  >
                    Forget Password?
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
