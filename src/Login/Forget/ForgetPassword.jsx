import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import loginlogo from "../../assets/img/logo/logo_login1.png";
import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/config";
import { useGlobalContext } from "../../Context/Context";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const { toastAlert } = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setErrMessage("Please enter Email !");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with password reset and cheqe mail?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with API call
        axios
          .post(baseUrl + "forgot_pass", {
            user_email_id: email,
          })
          .then((res) => {
            setErrMessage("Successfully Sent email !");
            setEmail("");
            toastAlert("Mail Send Successfully");
            if (res.data.message === "Successfully Sent email.") {
            } else {
              setErrMessage("No such email found in database");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            setErrMessage("Failed to reset password. Please try again later.");
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

            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="authform mb-5">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-icon btn_primary" type="submit">
                    <i className="fas fa-arrow-right" />
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
