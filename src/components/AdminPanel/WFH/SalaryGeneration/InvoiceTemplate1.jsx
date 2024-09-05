import React from "react";
import "./InvoiceTemplate1.css";

const InvoiceTemplate1 = ({ data }) => {
  const handleImageError = (e) => {
    console.error("Image failed to load", e);
    e.target.style.display = "none";
  };
  return (
    <body>
      <div className="invoiceWrapper">
        <div className="invoiceBody">
          <div className="invoiceBodyInner">
            <div className="invoiceBodyUpper">
              <div className="invoiceHeading">
                <h1>Invoice</h1>
              </div>
              <div className="addressBox">
                <h3>Name : {data?.user_name}</h3>
                <h4>E-Mail : {data?.user_email_id}</h4>
                <h4>Contact No. : {data?.user_contact_no}</h4>
                <h4>
                  Address :{" "}
                  {`${data?.permanent_address} ${data?.permanent_city} ${data?.permanent_state}`}
                </h4>
                <h4>Pincode : {data?.permanent_pin_code}</h4>
              </div>
              <div className="billBox">
                <div className="billBoxLeft">
                  <h3>Bill to</h3>
                  <h4>CREATIVEFUEL PRIVATE LIMITED</h4>
                  <h4>105, Gravity Mall, Vijay Nagar</h4>
                  <h4>Indore, Madhya Pradesh</h4>
                  <h4>452010 -India</h4>
                  <h4>GSTIN 23AAJCC1807B1ZC</h4>
                </div>
                <div className="billBoxRight">
                  <h3>
                    INVOICE # <span>{data?.invoiceNo}</span>
                  </h3>
                  <h3>
                    INVOICE DATE{" "}
                    <span>
                      {data?.Creation_date?.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="invoiceTable">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="text_left">
                          Description
                        </th>
                        <th scope="col" className="text_right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td scope="row" className="text_left">
                          {data?.billing_header_name}
                        </td>
                        <td scope="row" className="text_right">
                          {data?.toPay}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td scope="col" className="text_left">
                          Total
                        </td>
                        <td scope="col" className="text_right">
                          ₹ {data?.toPay}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="invoiceBodyFooter">
              <div className="invoiceBodyFooter_left">
                <div className="signBox">
                  <img
                    // src={data?.signatureImageUrl}
                    src="https://t4.ftcdn.net/jpg/03/17/25/45/240_F_317254576_lKDALRrvGoBr7gQSa1k4kJBx7O2D15dc.jpg"
                    alt="signatures"
                    onError={handleImageError}
                  />
                </div>
                <h3>Thank You</h3>
              </div>
              <div className="invoiceBodyFooter_right">
                <h3>Terms & Conditions</h3>
                <h4>Account Details</h4>
                <h4>Beneficiary Name : {data?.user_name}</h4>
                <h4>Bank Name: {data?.bank_name}</h4>
                <h4>Account Number :{data?.account_no}</h4>
                <h4>IFSC Code: {data?.ifsc_code}</h4>
                <h4>PAN Card number-{data?.pan_no}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default InvoiceTemplate1;
