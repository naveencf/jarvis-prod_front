import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../utils/config";

const SingleAssetUserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_sim/${id}`).then((res) => {
      const fetchedData = res.data.data;
      setData(fetchedData);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const dateofwarranty = data.warrantyDate?.split("T")?.[0];
  const warranty = dateofwarranty?.split("-").reverse().join("-");

  const dateofpurchase = data.dateOfPurchase?.split("T")?.[0];
  const purchase = dateofpurchase?.split("-").reverse().join("-");

  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />
      <div className="box">
        <div id="content">
          <FormContainer
            submitButton={false}
            mainTitle="Asset"
            title="Assets Details"
          >
            <div className="profileInfo_area">
              <div className="row profileInfo_row pt-0">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Asset Name</h3>
                    <h4>{data.assetsName}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Asset Type</h3>
                    <h4>{data.asset_type}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Asset ID</h3>
                    <h4>{data.asset_id}</h4>
                  </div>
                </div>
              </div>
              <div className="row profileInfo_row">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Asset Other ID</h3>
                    <h4>{data.assetsOtherID}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Category</h3>
                    <h4>{data.category_name}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Sub Category Name</h3>
                    <h4>{data.sub_category_name}</h4>
                  </div>
                </div>
              </div>
              <div className="row profileInfo_row">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Vendor Name</h3>
                    <h4>{data.vendor_name}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>In Warranty</h3>
                    <h4>{data.inWarranty}</h4>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="profileInfo_box">
                    <h3>Warranty Date</h3>
                    <h4>{warranty}</h4>
                  </div>
                </div>
              </div>
              <div className="row profileInfo_row">
                <div className="row profileInfo_row">
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Self Audit Period in days</h3>
                      <h4>{data.selfAuditPeriod}</h4>
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Self Audit Unit</h3>
                      <h4>{data.selfAuditUnit}</h4>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Hr Audit Period in days</h3>
                      <h4>{data.hrAuditPeriod}</h4>
                    </div>
                  </div>
                </div>
                <div className="row profileInfo_row">
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Hr Audit Unit</h3>
                      <h4>{data.hrAuditUnit}</h4>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Asset Value</h3>
                      <h4>
                        <h4>{data.assetsValue}</h4>
                      </h4>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Asset Current Value</h3>
                      <h4>{data.assetsCurrentValue}</h4>
                    </div>
                  </div>
                </div>
                <div className="row profileInfo_row">
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Date of Purchase</h3>
                      <h4>{purchase}</h4>
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Asset Finacial Type</h3>
                      <h4>{data.asset_financial_type}</h4>
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="profileInfo_box">
                      <h3>Status</h3>
                      <h4>{data.status}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

export default SingleAssetUserDetails;
