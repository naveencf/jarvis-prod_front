import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import loginlogo from "../../assets/img/logo/logo_login1.png";
import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/config";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setErrMessage("Please enter your email!");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the password reset and check your email?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true); // Start loading
        axios
          .post(`${baseUrl}forgot_pass`, { PersonalEmail: email })
          .then((res) => {
            setLoading(false); // Stop loading
            if (res.data?.message === "Successfully Sent email.") {
              Swal.fire({
                title: "Success!",
                text: "An email has been sent successfully for password reset.",
                icon: "success",
                confirmButtonText: "OK",
              });
              setErrMessage("");
              setEmail(""); // Clear email input
            } else {
              Swal.fire({
                title: "Error!",
                text: res.data?.message || "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
              });
              setErrMessage(res.data?.message || "Unexpected response. Please try again.");
            }
          })
          .catch((error) => {
            setLoading(false); // Stop loading
            const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again later.";
            console.error("Error:", error);
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "OK",
            });
            setErrMessage(errorMessage);
          });
      }
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
              <h2 style={{ color: "black" }}>Forgot Password</h2>
              <p>Please fill associated email id to get your password</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="authform mb-5">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} // Disable input when loading
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-icon btn_primary"
                    type="submit"
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <i className="fas fa-arrow-right" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn-xs"
                    style={{ float: "right" }}
                  >
                    <Link to={`/login`}>Login</Link>
                  </button>
                </div>
                <div className="form-group errorMessage">
                  <p>{errMessage}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
