import React, { useEffect } from "react";
import "./Loader.css";
import loader from "../../../assets/imgs/other/coffee-loader.gif";
import cfloader from "../../../assets/imgs/other/cf-loader.gif";
import logo from "../../../assets/logo.png";

const Loader = () => {
  // useEffect(() => {
  //   const loader = document.querySelector(".loader");
  //   // console.log(loader, "loader>>");
  //   const delay = +loader?.dataset?.delay || 200;
  //   const dots = loader?.querySelectorAll(".loader .dot");
  //   dots?.forEach((dot, index) => {
  //     dot.style = `--delay: ${delay * index}`;
  //   });
  // }, []);
  return (
    <>
      {/* <div className="loader-overlay">
        <main>
          <div className="loader js-loader" data-delay="200">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </main>
      </div> */}
      <div className="loader-overlay">
        <div className="loaderCup">
          <div className="loaderLogo">
            <img src={logo} />
          </div>
          <img src={cfloader} className="cup" />
        </div>
      </div>
    </>
  );
};

export default Loader;
