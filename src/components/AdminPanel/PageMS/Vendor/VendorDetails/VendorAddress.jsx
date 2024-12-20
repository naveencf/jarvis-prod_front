import { Accordion, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import React from "react";

const VendorAddress = ({ vendorDetails, tab1, pageVendordata }) => {
  console.log(vendorDetails, " 1  vendorDetails");
  console.log(pageVendordata, " 2  pageVendordata");

  return (
    <div>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Address
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title"> Personal Address</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      <li>
                        <span>Address:</span>
                        {tab1 === "tab1" ? (
                          <>{pageVendordata?.home_address || "N/A"}</>
                        ) : (
                          <> {vendorDetails?.home_address || "N/A"}</>
                        )}
                      </li>
                      <li>
                        <span>Country:</span>
                        {/* {SingleAccountSalesBooking?.connect_billing_street ||
                          "N/A"} */}
                        91
                      </li>
                      <li>
                        <span>City:</span>
                        {tab1 === "tab1" ? (
                          <>{pageVendordata?.home_city || "N/A"}</>
                        ) : (
                          <> {vendorDetails?.home_city || "N/A"}</>
                        )}
                      </li>
                      <li>
                        <span>State:</span>
                        {tab1 === "tab1" ? (
                          <>{pageVendordata?.home_state || "N/A"}</>
                        ) : (
                          <> {vendorDetails?.home_state || "N/A"}</>
                        )}
                      </li>
                      <li>
                        <span>Pin Code :</span>
                        {tab1 === "tab1" ? (
                          <>{pageVendordata?.home_pincode || "N/A"}</>
                        ) : (
                          <> {vendorDetails?.home_pincode || "N/A"}</>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Compnay Address</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      <li>
                        <span>Address:</span>
                        NA{" "}
                      </li>
                      <li>
                        <span>City:</span>
                        NA{" "}
                      </li>
                      <li>
                        <span>Country:</span>
                        91
                      </li>
                      <li>
                        <span>State:</span>
                        NA{" "}
                      </li>
                      <li>
                        <span>Pin Code :</span>
                        NA{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default VendorAddress;
