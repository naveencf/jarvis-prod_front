import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetPmsPaymentMethodQuery } from "../../../../Store/reduxBaseURL";

const VendorBankDetails = ({ vendorDetails }) => {
  const { data: payData } = useGetPmsPaymentMethodQuery();

  if (!vendorDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Bank Details
          </AccordionSummary>
          <AccordionDetails className="p0 border-0">
            <div className="row">
              {/* Payment Method Section */}
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Payment Method</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      <li>
                        {payData?.find(
                          (item) => item?._id === vendorDetails?.payment_method
                        )?.payMethod_name || "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {vendorDetails?.payment_method === "666856874366007df1dfacde" ? (
                <>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card saleAccDetailCard">
                      <div className="card-header">
                        <h4 className="card-title">Account Number</h4>
                      </div>
                      <div className="card-body">
                        <ul className="saleAccDetailInfo">
                          <li>{vendorDetails?.account_no || "N/A"}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card saleAccDetailCard">
                      <div className="card-header">
                        <h4 className="card-title">IFSC</h4>
                      </div>
                      <div className="card-body">
                        <ul className="saleAccDetailInfo">
                          <li>{vendorDetails?.ifsc || "N/A"}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="card saleAccDetailCard">
                      <div className="card-header">
                        <h4 className="card-title">UPI Id</h4>
                      </div>
                      <div className="card-body">
                        <ul className="saleAccDetailInfo">
                          <li>{"N/A"}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default VendorBankDetails;
