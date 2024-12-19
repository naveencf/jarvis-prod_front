import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";

import { useState } from "react";
import logo from "/logo.png";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullSizeModal() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Vendor Name
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <>
          <div className="AccountInfo">
            <div className="sales-sidebar">
              <div className="topbarBrand-1">
                <div className="branding">
                  <div className="logo-1">
                    <img
                      src={logo}
                      className="logo-img"
                      alt="logo"
                      width={40}
                    />
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
                      // onClick={() => handleClickScroll("DetailView")}
                    >
                      <i className="ph">
                        {/* <CashRegister weight="duotone" /> */}
                      </i>
                      <span> PerSonal Details</span>
                    </div>
                  </div>
                  <div className="nav-item nav-item-single">
                    <div
                      className="nav-btn nav-link"
                      // onClick={() => handleClickScroll("ContactView")}
                    >
                      <i className="ph">
                        {/* <AddressBook weight="duotone" /> */}
                      </i>
                      <span>
                        Address <span className="badgeNum"></span>
                      </span>
                    </div>
                  </div>
                  <div className="nav-item nav-item-single">
                    <div
                      className="nav-btn nav-link"
                      // onClick={() => handleClickScroll("SalesView")}
                    >
                      <i className="ph">
                        {/* <ChartLineUp weight="duotone" /> */}
                      </i>
                      <span>
                        Bank Detail
                        <span className="badgeNum">{"salesLength"}</span>
                      </span>
                    </div>
                  </div>
                  <div className="nav-item nav-item-single">
                    <div
                      className="nav-btn nav-link"
                      // onClick={() => handleClickScroll("DocumentsView")}
                    >
                      <i className="ph">{/* <File weight="duotone" /> */}</i>
                      <span>
                        Documents <span className="badgeNum"></span>
                      </span>
                    </div>
                  </div>
                  <div className="nav-item nav-item-single">
                    <div
                      className="nav-btn nav-link"
                      // onClick={() => handleClickScroll("TimelineView")}
                    >
                      <i className="ph">{/* <File weight="duotone" /> */}</i>
                      <span>Pages</span>
                    </div>
                  </div>
                  <div className="nav-item nav-item-single">
                    <div
                      className="nav-btn nav-link"
                      // onClick={() => handleClickScroll("PaymentView")}
                    >
                      <i className="ph">{/* <File weight="duotone" /> */}</i>
                      <span>Purchase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sales-accountinfo-view">
              <div className="actionNavbar">
                <button className="icon" onClick={() => handleClose()}>
                  <i class="bi bi-x"></i>
                </button>
                <ul>
                  <li>
                    <a
                      className="btn cmnbtn btn_sm btn-primary ml-2"
                      // onClick={() =>  navigate(`/admin/create-sales-account/${SingleAccount?._id}`)
                      // }
                    >
                      + Add Pages
                    </a>
                  </li>
                  <li>
                    <a
                      className="btn cmnbtn btn_sm btn-primary ml-2 "
                      // onClick={() => navigate(`/admin/create-sales-account/${SingleAccount?._id}`)
                      // }
                    >
                      <i className="bi bi-pencil" />
                      Edit
                    </a>
                  </li>
                </ul>
              </div>

              <section id="DetailView">
                {/* <SalesDetail
            SingleAccount={SingleAccount}
            Si ngleAccountLoading={SingleAccountLoading}
          /> */}
              </section>
              <section id="DetailView">
                {/* <SalesDetail
            SingleAccount={SingleAccount}
            Si ngleAccountLoading={SingleAccountLoading}
          /> */}
              </section>
            </div>
          </div>
        </>
      </Dialog>
    </>
  );
}
