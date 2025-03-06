import React from "react";
import FormContainer from "../../AdminPanel/FormContainer";

const AuditedDataView = ({ columns, modalData, setToggleModal }) => {
  return (
    <>
      <div className="flexCenterBetween formHeadingM0 mb16">
        <FormContainer mainTitle={"Audited Data"} link={"true"} />
        <div className="icon-1" onClick={() => setToggleModal(false)}>
          X
        </div>
      </div>
      <div className="card shadow-none m0">
        <div className="row auditedDataViewModal">
          {modalData?.postImage && (
            <div className="col-md-2">
              <div className="auditedDataViewBox">
                <p>Post Image :</p>
                <img
                  src={modalData?.postImage}
                  style={{
                    width: "100px",
                    aspectRatio: "6/9",
                  }}
                />
              </div>
            </div>
          )}
          {modalData?.story_image && (
            <div className="col-md-2">
              <div className="auditedDataViewBox">
                <p>Story Image :</p>
                <img
                  src={modalData?.story_image}
                  style={{
                    width: "100px",
                    aspectRatio: "6/9",
                  }}
                />
              </div>
            </div>
          )}
          <div className="col-md-8">
            <div className="auditedDataViewBox">
              <ul>
                {columns?.map((col) => {
                  if (
                    col.key != "Sr.No" &&
                    col.key != "action" &&
                    col.key != "pageedits" &&
                    col.key != "postLinks" &&
                    col.key != "Pageedits" &&
                    col.key !== "postStatus" &&
                    col.key !== "postImage" &&
                    col.key !== "story_image" &&
                    col.key !== "price_key"
                  ) {
                    return (
                      <li>
                        <span>{col.name} : </span>
                        {modalData[col.key]}
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
          {/* <div className="col-md-8">
            <div className="auditedDataViewBox">
              <ul>
                <li>
                  <span>Platform : </span>instagram
                </li>
                <li>
                  <span>Vendor Name : </span>adultsociety (rohit)
                </li>
                <li>
                  <span>Short Code : </span>DGql2kxTUMU
                </li>
                <li>
                  <span>Phase Date : </span>01-03-2025
                </li>
                <li>
                  <span>Caption : </span>
                </li>
                <li>
                  <span>Like Count : </span>15151
                </li>
                <li>
                  <span>Posted On : </span>02/03/2025
                </li>
                <li>
                  <span>Story Link : </span>
                </li>
                <li>
                  <span>Link : </span>
                  https://www.instagram.com/reel/DGql2kxTUMU/?igsh=MTFrYXlvOGZhcGRzNw==
                </li>
                <li>
                  <span>Page Name : </span>adultsociety
                </li>
                <li>
                  <span>Campaign Name : </span>66bf5bc094ecc3848a21db9c
                </li>
                <li>
                  <span>Amount : </span>0
                </li>
                <li>
                  <span>Comment Count : </span>150
                </li>
                <li>
                  <span>Play Count : </span>982333
                </li>
                <li>
                  <span>Post Type : </span>REEL
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
      <div className="card d-none">
        <div className="card-body">
          <div className="row">
            {columns?.map((col) => {
              if (
                col.key != "Sr.No" &&
                col.key != "action" &&
                col.key != "pageedits" &&
                col.key != "postLinks" &&
                col.key != "Pageedits" &&
                col.key !== "postStatus"
              ) {
                if (col.key === "postImage") {
                  return (
                    <div className="col-md-6">
                      <div className="flex-row">
                        <p className="mr-2">{col.name}</p>:
                        <img
                          src={modalData[col.key]}
                          alt="postImage"
                          style={{
                            width: "100px",
                            // height: "100px",
                            aspectRatio: "6/9",
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="col-md-6">
                    <div className="flex-row">
                      <p className="mr-2">{col.name}</p>:
                      <p className="ml-2">{modalData[col.key]}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditedDataView;
