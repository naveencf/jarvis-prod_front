import axios from "axios";
import { useState } from "react";
import "./Login.css";
import "./LoginResponsive.css";
import { useNavigate } from "react-router-dom";
import loginlogo from "../assets/img/logo/logo_login1.png";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../Context/Context";
import { baseUrl } from "../utils/config";

const Login = () => {
  const { toastError } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "login_user", {
        user_login_id: email,
        user_login_password: password,
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

          if (status == "Active") {
            if (deptId == 36 && onboardStatus == 1) {
              navigate("/admin/sales-dashboard");
            } else {
              navigate("/");
            }
            sessionStorage.setItem("token", token);
            setTimeout(() => {
              sessionStorage.removeItem("token");
              navigate("/login");
            }
              , 1000 * 60 * 60 * 10); // 10 hours
          } else {
            navigate("/login");
            toastError("You are an inactive user");
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
          <div
            className="authtext authbrand_spacing"
            style={{ display: "none" }}
          >
            <h1>Welcome.</h1>
            <p>
              To Creativefuel <br /> A Leading Marketing Agency. <br /> Let's
              onboard you to your next home.
            </p>
          </div>
          <div className="authlogo authbrand_spacing">
            <img src={loginlogo} alt="CreativeFuel" />
          </div>
          <div className="authform_area">
            <div className="authform_head">
              <h2 style={{ color: "black" }}>Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="authform">
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
                  <input
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "password" : "text"}
                  />
                </div>
                {isError !== "" && (
                  <div className="form-group errorMessage">
                    <span>{isError?.response?.data?.error}</span>
                  </div>
                )}
                <div className="form-group">
                  <button className="btn btn-icon btn_primary" type="submit">
                    <i className="fas fa-arrow-right" />
                  </button>
                </div>
                <div className="forgotPassword form-group">
                  <button
                    style={{ color: "blue" }}
                    className="btn link_btn"
                    type="submit"
                    onClick={() => {
                      navigate("/forget-password");
                    }}
                  >
                    Forget Password ?
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* </div>
      </div> */}
    </>
  );
};
export default Login;
