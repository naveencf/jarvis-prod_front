import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginlogo from "../assets/img/logo/logo_login1.png";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../utils/config";
import useIPAddress from "../components/AdminPanel/HRMS/User/UserDashboard/LoginHistory/UseIPAddress";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { constant } from "../utils/constants";

const GOOGLE_MAPS_API_KEY = "AIzaSyCk0q-yHS182mYMIc_IH9oOn3Tii-4UVeg";
const GOOGLE_CLIENT_ID = constant.GOOGLE_CLIENT_ID_FOR_LOGIN;

const Login = () => {
  const ip = useIPAddress();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Function to get the user's current location
  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      // setIsError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, latitude, longitude }));

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          if (response.data.results.length > 0) {
            const address = response.data.results[0].formatted_address;
            setLocation((prev) => ({ ...prev, address }));
          } else {
            // setIsError("Address not found.");
          }
        } catch (error) {
          // setIsError("Failed to fetch address.");
        }
      },
      (error) => {
        setIsError("");
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // 🔹 Login API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await axios
      .post(baseUrl + "login_user", {
        user_login_id: email,
        user_login_password: password,
        ip_address: ip,
        current_location: location.address, // ✅ Sending Address in Payload
      })
      .then((res) => {
        const token = res.data?.token;

        if (!token) {
          setIsError("Invalid credentials or token missing");
          return;
        }

        const decodedToken = jwtDecode(token);
        const {
          user_status: status,
          dept_id: deptId,
          onboard_status: onboardStatus,
        } = decodedToken;

        if (status !== "Active") {
          setIsError("Account is inactive");
          return navigate("/login");
        }

        // Store token and navigate based on dept and onboardStatus
        sessionStorage.setItem("token", token);

        if (deptId === 36 && (onboardStatus === 0 || onboardStatus === 1)) {
          navigate("/admin/sales-dashboard");
        } else if (deptId === 20) {
          navigate("/admin/pantry");
        } else {
          navigate("/");
        }

        // Auto logout after 10 hours
        setTimeout(() => {
          sessionStorage.removeItem("token");
          navigate("/login");
        }, 1000 * 60 * 60 * 10);
      })

      .catch((error) => {
        setIsError(error?.response?.data?.error || "Login failed");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(baseUrl + "login_user_with_google", {
        token: credentialResponse.credential,
        ip_address: ip,
        current_location: location.address,
      });
      // You can decode, store token, and navigate similarly to normal login
      const token = response.data.data.token;
      const decodedToken = jwtDecode(token);
      const status = decodedToken.user_status;
      const deptId = decodedToken.dept_id;
      const onboardStatus = decodedToken.onboard_status;

      if (status === "Active") {
        if (deptId === 36 && (onboardStatus === 1 || onboardStatus === 0)) {
          navigate("/admin/sales-dashboard");
        } else if (deptId === 20) {
          navigate("/admin/pantry");
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
      }
    } catch (error) {
      console.error("Google Login failed:", error.response?.data?.message || error.message);
      setIsError(error.response?.data?.message || error.message);
      // setIsError("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                    required
                  />
                </div>

                {/* Password input */}
                <div className="form-group input-group password-input-container">
                  <input
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </span>
                </div>

                {/* Error message */}
                {isError && (
                  <div className="form-group errorMessage">
                    <span>{isError}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="form-group">
                  <button
                    className="btn btn-icon btn_primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin" />
                    ) : (
                      <i className="fas fa-arrow-right" />
                    )}
                  </button>
                </div>

                {/* Forgot password link */}
                <div className="forgotPassword form-group">
                  <button
                    style={{ color: "blue" }}
                    className="btn link_btn"
                    type="button"
                    onClick={() => navigate("/forget-password")}
                  >
                    Forget Password?
                  </button>
                </div>
              </div>
            </form>

            {/* 🔹 Google Login Section */}
            <div className="google-login-section" style={{ marginTop: "10px",marginBottom: "10px", textAlign: "center" }}>
              <p style={{ marginBottom: "10px", fontWeight: "bold" }}>OR</p>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  setIsError("Google login failed.");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};

export default Login;
