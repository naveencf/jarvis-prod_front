import DataTable from "react-data-table-component";

const UserSummaryOverview = ({ filterData, hardRender, tabOne, tabTwo }) => {
  //   const activeColumns = tabOne ? columnsTab1 : columnsTab2;
  return (
    <>
      <div className="card mb-4">
        <div className="data_tbl table-responsive">
          {tabOne && (
            <div className="profileInfo_area">
              <div className="row profileInfo_row pt-0">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Bank Name</h3>
                    <h4>
                      {filterData.bank_name ? filterData.bank_name : "NA"}
                    </h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Account Number</h3>
                    <h4>
                      {filterData.account_no ? filterData.account_no : "NA"}
                    </h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>IFSC</h3>
                    <h4>
                      {filterData.ifsc_code ? filterData.ifsc_code : "NA"}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="row profileInfo_row pt-0">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>PAN Number</h3>
                    <h4>{filterData.pan_no ? filterData.pan_no : "NA"}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Beneficiary</h3>
                    <h4>
                      {filterData.beneficiary ? filterData.beneficiary : "NA"}
                    </h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Permanent Address</h3>
                    <h4>
                      {filterData.permanent_address
                        ? filterData.permanent_address
                        : "NA"}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="row profileInfo_row pt-0">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>State</h3>
                    <h4>
                      {filterData.permanent_state
                        ? filterData.permanent_state
                        : "NA"}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>upi_Id</h3>
                  <h4>{filterData.upi_Id ? filterData.upi_Id : "NA"}</h4>
                </div>
              </div>
            </div>
          )}
          {tabTwo && (
            <div className="profileInfo_area">
              {filterData.map((d) => (
                <div className="row profileInfo_row pt-0">
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Doc Type</h3>
                      <h4>{d?.doc_type ? d?.doc_type : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Doc Image</h3>
                      <img
                        style={{ height: "250px", width: "250px" }}
                        src={d?.doc_image_url}
                        alt="NA"
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Description</h3>
                      <h4>{d?.description ? d?.description : "NA"}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSummaryOverview;
