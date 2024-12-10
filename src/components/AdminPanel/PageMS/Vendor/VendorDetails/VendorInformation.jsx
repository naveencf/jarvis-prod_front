

import React from "react";
import coverImage from "../../../../../../src/assets/imgs/other/cover1.jpg";
import {
  useGetAllVendorTypeQuery,
  useGetPmsPlatformQuery,
} from "../../../../Store/reduxBaseURL";
import formatString from "../../../../../utils/formatString";

const VendorInformation = ({ vendorDetails, bankRows, tab1 }) => {
  const { data: paltform } = useGetPmsPlatformQuery();
  const platformData = paltform?.data || [];

  const { data: vendorType } = useGetAllVendorTypeQuery();
  const vendorTypeData = vendorType?.data || [];
  return (
    <>
      <div className="card">
        <div className="card-body p0">
          <div className="saleAccWrapper">
            <div className="saleAccCover">
              <div className="saleAccCoverImg">
                <img src={coverImage} alt="coverimage" />
              </div>
            </div>
            <div className="saleAccTitle">
              <div className="saleAccTitleHead row">
                <div className="saleAccTitleImgCol col">
                  <div className="saleAccTitleImg">
                    {/* <img src={SingleAccount?.account_image_url} alt="logo" /> */}
                  </div>
                </div>
                <div className="saleAccTitleTxtCol col">
                  <div className="saleAccTitleTxt">
                    <h2>{formatString(vendorDetails?.vendor_name)}</h2>
                    <p>
                      <b> Platform : </b>
                      {formatString(vendorDetails?.vendor_platform
                        ? platformData.find(
                            (ele) => ele._id == vendorDetails.vendor_platform
                          )?.platform_name
                        : "NA")}
                    </p>
                  </div>
                  <div className="saleAccTitleSocial">
                    <ul className="saleAccSocialInfo"></ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="saleAccDetails">
              <ul>
                <li>
                  <span className="icon">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <h4>
                    <b>Phone</b>
                    {vendorDetails?.mobile}
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i class="bi bi-justify"></i>
                  </span>
                  <h4>
                    <b>Vendor Type</b>
                    {vendorDetails?.vendor_type
                      ? vendorTypeData.find(
                          (ele) => ele._id == vendorDetails?.vendor_type
                        )?.type_name
                      : "NA"}
                  </h4>
                </li>
                <li>
                  <span className="icon">
                  <i class="bi bi-tag"></i>
                  </span>
                  <h4>
                    <b>Category</b>
                    {vendorDetails?.vendor_category}
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i className="bi bi-buildings"></i>
                  </span>
                  <h4>
                    <b>No. of Offices</b>
                    {/* {SingleAccountSalesBooking?.how_many_offices || "N/A"} */}
                  </h4>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorInformation;
