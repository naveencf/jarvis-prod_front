import * as React from "react";
import Dialog from "@mui/material/Dialog";
import VendorDetailAccordion from "./VendorDetailAccordion";
import { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";
import logo from "/logo.png";
import {
  AddressBook,
  CashRegister,
  Files,
  File,
  CurrencyInr,
  Bank,
} from "@phosphor-icons/react";

import { Link } from "react-router-dom";
// import VendorDetailsNew from "./VendorDetails/VendorDetailsNew";
import VendorInformation from "./VendorDetails/VendorInformation";
import VendorAddress from "./VendorDetails/VendorAddress";
import VendorPages from "./VendorDetails/VendorPages";
import VendorPurchase from "./VendorDetails/VendorPurchase";
import VendorDocuments from "./VendorDetails/VendorDocuments";
import VendorBankDetails from "./VendorDetails/VendorBankDetails";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VendorDetails({
  vendorDetails,
  setVendorDetails,
  tab1,
}) {
  const [open, setOpen] = React.useState(true);
  const [bankRows, setBankRows] = useState([]);
  console.log(vendorDetails, "vendorDetails");
  const sendingId = {
    _id: vendorDetails._id,
  };
  const queryParams = new URLSearchParams(sendingId).toString();

  const handleClose = () => {
    setOpen(false);
    setVendorDetails(null);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="AccountInfo">
        <div className="sales-sidebar">
          <div className="topbarBrand-1">
            <div className="branding">
              <div className="logo-1">
                <img src={logo} className="logo-img" alt="logo" width={40} />
              </div>
              <div className="brandtext">
                Creative <span>fuel</span>
              </div>
            </div>
          </div>
          <div className="navbar-nav sidebar">
            <div className="links">
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("VendorInformation")}
                >
                  <i className="ph">
                    <CashRegister weight="duotone" />
                  </i>
                  <span> Personal Details</span>
                </div>
              </div>
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("Address")}
                >
                  <i className="ph">
                    <AddressBook weight="duotone" />
                  </i>
                  <span>
                    Address <span className="badgeNum"></span>
                  </span>
                </div>
              </div>
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("pages")}
                >
                  <i className="ph">
                    <File size={32} />
                  </i>
                  <span>
                    Pages
                    <span className="badgeNum">{"salesLength"}</span>
                  </span>
                </div>
              </div>
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("VendorPurchase")}
                >
                  <i className="ph">
                    {" "}
                    <CurrencyInr size={32} />
                  </i>
                  <span>
                    Purchase <span className="badgeNum"></span>
                  </span>
                </div>
              </div>
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("Documents")}
                >
                  <i className="ph">
                    {" "}
                    <Files size={32} />{" "}
                  </i>
                  <span>
                    Documents <span className="badgeNum"></span>
                  </span>
                </div>
              </div>
              <div className="nav-item nav-item-single">
                <div
                  className="nav-btn nav-link"
                  onClick={() => handleClickScroll("BankDetails")}
                >
                  <i className="ph">
                    {" "}
                    <Bank size={32} />
                  </i>
                  <span>
                    Payment Details <span className="badgeNum"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sales-accountinfo-view">
          <div className="actionNavbar">
            <button className="icon text-danger" onClick={() => handleClose()}>
              <i class="bi bi-x"></i>
            </button>
            <ul>
              <li>
                <Link to={`/admin/pms-page-master?${queryParams}`}>
                  <button className="btn cmnbtn btn_sm btn-primary ml-2">
                    Add Page
                  </button>
                </Link>
              </li>
              <li>
                <Link
                  to={`/admin/pms-vendor-master/${
                    tab1 === "tab1"
                      ? vendorDetails?.vendor_id
                      : vendorDetails?._id
                  }`}
                >
                  <button className="btn cmnbtn btn_sm btn-primary ml-2">
                    <i className="bi bi-pencil" />
                    Edit
                  </button>
                </Link>
              </li>
            </ul>
          </div>

          <section id="VendorInformation">
            <VendorInformation
              vendorDetails={vendorDetails}
              bankRows={bankRows}
              tab1={tab1}
            />
          </section>
          <section id="Address">
            <VendorAddress vendorDetails={vendorDetails} />
          </section>
          <section id="pages">
            <VendorPages vendorDetails={vendorDetails} tab1={tab1} />
          </section>
          <section id="VendorPurchase">
            <VendorPurchase vendorDetails={vendorDetails} />
          </section>
          <section id="Documents">
            <VendorDocuments vendorDetails={vendorDetails} />
          </section>
          <section id="BankDetails">
            <VendorBankDetails vendorDetails={vendorDetails} />
          </section>
        </div>
      </div>

      {/* <VendorDetailAccordion vendorDetails={vendorDetails} bankRows={bankRows} tab1={tab1}/> */}
    </Dialog>
  );
}
