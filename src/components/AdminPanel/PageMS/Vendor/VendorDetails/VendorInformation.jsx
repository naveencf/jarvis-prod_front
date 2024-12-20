import React from "react";
import coverImage from "../../../../../../src/assets/imgs/other/cover1.jpg";
import formatString from "../../../../../utils/formatString";
import {
  useGetAllVendorTypeQuery,
  useGetPmsPlatformQuery,
} from "../../../../Store/reduxBaseURL";

const VendorInformation = ({ vendorDetails, tab1, pageVendordata }) => {
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];

  const { data: vendorType } = useGetAllVendorTypeQuery();
  const vendorTypeData = vendorType?.data || [];

  return (
    <div className="card">
      <div className="card-body p0">
        <div className="saleAccWrapper">
          {/* Cover Image Section */}
          <div className="saleAccCover">
            <div className="saleAccCoverImg">
              <img src={coverImage} alt="cover" />
            </div>
          </div>

          {/* Vendor Title Section */}
          <div className="saleAccTitle">
            <div className="saleAccTitleHead row">
              <div className="saleAccTitleImgCol col">
                <div className="saleAccTitleImg"></div>
              </div>
              <div className="saleAccTitleTxtCol col">
                <div className="saleAccTitleTxt">
                  <h2>{formatString(vendorDetails?.vendor_name || "NA")}</h2>
                  <p>
                    <b>Platform: </b>
                    {formatString(
                      tab1 === "tab1"
                        ? pageVendordata?.vendor_platform
                          ? platformData.find(
                              (ele) =>
                                ele._id ===
                                (pageVendordata.vendor_platform ||
                                  vendorDetails.vendor_platform)
                            )?.platform_name || "NA"
                          : "NA"
                        : vendorDetails?.vendor_platform
                        ? platformData.find(
                            (ele) => ele._id === vendorDetails.vendor_platform
                          )?.platform_name || "NA"
                        : "NA"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Details Section */}
          <div className="saleAccDetails">
            <ul>
              <li>
                <span className="icon">
                  <i className="bi bi-telephone"></i>
                </span>
                <h4>
                  <b>Phone: </b>
                  {tab1 === "tab1" ? (
                    <>{pageVendordata?.mobile || "NA"}</>
                  ) : (
                    <>{vendorDetails?.mobile || "NA"}</>
                  )}
                </h4>
              </li>

              {/* Vendor Type */}
              <li>
                <span className="icon">
                  <i className="bi bi-justify"></i>
                </span>
                <h4>
                  <b>Vendor Type: </b>

                  {tab1 === "tab1" ? (
                    <>
                      {pageVendordata?.vendor_type
                        ? vendorTypeData.find(
                            (ele) => ele._id === pageVendordata.vendor_type
                          )?.type_name || "NA"
                        : "NA"}
                    </>
                  ) : (
                    <>
                      {vendorDetails?.vendor_type
                        ? vendorTypeData.find(
                            (ele) => ele._id === vendorDetails.vendor_type
                          )?.type_name || "NA"
                        : "NA"}
                    </>
                  )}
                </h4>
              </li>

              {/* Vendor Category */}
              <li>
                <span className="icon">
                  <i className="bi bi-tag"></i>
                </span>
                <h4>
                  <b>Category: </b>
                  {tab1 === "tab1" ? (
                    <>{pageVendordata?.vendor_category || "NA"}</>
                  ) : (
                    <>{vendorDetails?.vendor_category || "NA"}</>
                  )}
                </h4>
              </li>             
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorInformation;
