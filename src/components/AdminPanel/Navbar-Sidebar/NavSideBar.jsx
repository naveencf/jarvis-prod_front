import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useEffect } from "react";
import $ from "jquery";

const NavSideBar = () => {
  useEffect(() => {
    (function ($) {
      "use strict"; // Start of use strict

      // Toggle the side navigation
      $("#sidebarToggle, #sidebarToggleTop").on("click", function () {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
          $(".sidebar .collapse").collapse("hide");
        }
      });

      // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
      $("body.fixed-nav .sidebar").on(
        "mousewheel DOMMouseScroll wheel",
        function (e) {
          if ($(window).width() > 768) {
            var e0 = e.originalEvent,
              delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
          }
        }
      );

      // Scroll to top button appear

      $(document).on("scroll", function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
          $(".scroll-to-top").fadeIn();
        } else {
          $(".scroll-to-top").fadeOut();
        }
      });

      // Smooth scrolling using jQuery easing
      $(document).on("click", "a.scroll-to-top", function (e) {
        var $anchor = $(this);
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $($anchor.attr("href")).offset().top,
            },
            1000,
            "easeInOutExpo"
          );
        e.preventDefault();
      });

      // Toggle Dark/Light Theme
      document.getElementById("theme-toggle").addEventListener("click", (e) => {
        const checked = e.target.checked;
        document.body.setAttribute("theme", checked ? "dark" : "light");
      });

      // Toggle Active Class on Sidebars
      // $(document).ready(function () {
      //   $("#accordionSidebar .nav-item").click(function () {
      //     $(".nav-item").removeClass("active");
      //     // $('.nav-item .collapse').removeClass("show");
      //     $(this).addClass("active");
      //   });
      // });

      //
      // $(document).ready(function () {
      //   $("#accordionSidebar .nav-item-single").click(function () {
      //     $("#accordionSidebar .nav-item")
      //       .find(".nav-link")
      //       .addClass("collapsed");
      //     $("#accordionSidebar .nav-item")
      //       .find(".collapse")
      //       .removeClass("show");
      //   });
      // });
    })($); // End of use strict
  }, []);

  return (
    <>
      <Navbar />
      <SideBar />
      <Outlet />
    </>
  );
};

export default NavSideBar;
