import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormContainer from "../../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../../Context/Context";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../../../AdminPanel/RegisterCampaign/Loader/Loader";
import { baseUrl } from "../../../../../utils/config";

const getFileIcon = (fileName) => {
  const fileExtension = fileName?.split(".")?.pop()?.toLowerCase();
  const iconMap = {
    pdf: "bi bi-file-earmark-pdf-fill",
    doc: "bi bi-file-earmark-word-fill",
    docx: "bi bi-file-earmark-word-fill",
    xls: "bi bi-file-earmark-excel-fill",
    xlsx: "bi bi-file-earmark-excel-fill",
    ppt: "bi bi-file-earmark-ppt-fill",
    pptx: "bi bi-file-earmark-ppt-fill",
    txt: "bi bi-file-earmark-text-fill",
    default: "bi bi-file-earmark-fill",
  };
  return iconMap[fileExtension] || iconMap["default"];
};

const PendingInvoiceCustomerDeatils = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [gstNumClick, setGSTNumClick] = useState([]);
  const [singleAccountData, setSingleAccountData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const gstApiToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";

  const token = sessionStorage.getItem("token");

  const getSingleAccountList = async () => {
    await axios
      .get(baseUrl + `accounts/get_document_overview/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        const matchedData = res?.data?.data?.filter(
          (overview) =>
            overview.document_master_id == "665dbc0d1df407940c078fd5"
        );
        console.log(matchedData, "matchedData--->>");
        setSingleAccountData(matchedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    getSingleAccountList();
  }, []);

  const handleGSTNumberClick = async (data) => {
    console.log(data?.document_no?.trim(),"data-->>-->>>")

    const payload = {
      flag: 2,
      gstNo: data?.document_no?.trim(),
    };

    await axios
      .post(`https://insights.ist:8080/api/v1/get_gst_details`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gstApiToken}`,
        },
      })
      .then((res) => {
        setGSTNumClick(res?.data?.data);
      })
      .catch((error) => {
        console.log(error, "ERROR---------------");
      });
  };

  console.log("gstNumClick:", gstNumClick);
  return (
    <div>
      <FormContainer title="Account Detail" submitButton={false}>
        {singleAccountData?.map((data, index) => (
          <section id="DetailView">
            <div className="cardAccordion">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Details
                </AccordionSummary>
                <AccordionDetails>
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title">Account Details</h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            <li>
                              <span>Account Name</span>
                              {/* {SingleAccountType?.account_type_name || "N/A"} */}
                            </li>
                            {/* <li>
                        <span>Descriptions:</span>
                        {SingleAccount?.description || "N/A"}
                      </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title"> GST Number</h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            <li onClick={() => handleGSTNumberClick(data)}>
                              <span>GST Number</span>
                              <a href="#" style={{ color: "blue" }}>
                                {data?.document_no || "N/A"}
                              </a>
                            </li>
                            {/* <li>
                        <span>Descriptions:</span>
                        {SingleCompanyType?.description || "N/A"}
                      </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="cardAccordion">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Documents
                </AccordionSummary>
                <AccordionDetails>
                  <div className="row">
                    <div
                      key={index}
                      className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                    >
                      <div className="card saleAccDetailCard">
                        <div className="card-header justify-content-between">
                          <h4 className="card-title justify-content-start flex-row gap-2">
                            <i className="bi bi-file-earmark-text-fill"></i>
                            GST Image
                          </h4>
                          <ul className="flex-row gap-2">
                            <li>
                              <a
                                className="icon-1 sm"
                                target="_blank"
                                href={data?.document_image_upload}
                                download
                              >
                                <i className="bi bi-eye" title="View"></i>
                              </a>
                            </li>
                            <li>
                              <a
                                className="icon-1 sm"
                                // target="_blank"
                                href={data?.document_image_upload}
                                download
                              >
                                <i
                                  className="bi bi-download"
                                  title="Download"
                                ></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="card-body document-holder p0">
                          {["jpg", "jpeg", "png", "gif"].includes(
                            data?.document_image_upload
                              ?.split(".")
                              ?.pop()
                              ?.toLowerCase()
                          ) ? (
                            <img
                              className="DocImage"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/error.jpg";
                              }}
                              src={data?.document_image_upload}
                              alt="Document"
                            />
                          ) : (
                            <div
                              className="DocImage"
                              style={{ display: "grid" }}
                            >
                              <i
                                className={getFileIcon(
                                  data?.document_image_upload
                                )}
                                style={{
                                  fontSize: "3rem",
                                  color: "#4D7345",
                                }}
                              ></i>
                            </div>
                          )}
                        </div>
                        <div className="card-footer">
                          <p>
                            {data?.document_name} :
                            <span>{data?.document_no || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </section>
        ))}
        {gstNumClick && Object.keys(gstNumClick).length > 0 && (
          <section id="DetailView">
            <div className="cardAccordion">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  GST Number Details
                </AccordionSummary>
                <AccordionDetails>
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title">GST Details</h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            <li>
                              <span> Trade Name</span>
                              {gstNumClick?.enrichment_details?.online_provider
                                ?.details?.trade_name?.value || "N/A"}
                            </li>
                            {/* <li>
                        <span>Descriptions:</span>
                        {SingleAccount?.description || "N/A"}
                      </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title">Business Details</h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            <li>
                              <span> Legal Business Name</span>
                              {gstNumClick?.enrichment_details?.online_provider
                                ?.details?.legal_name?.value || "N/A"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title">
                            {" "}
                            Constitution OF Business
                          </h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            <li>
                              <span>Constitution OF Business:</span>
                              {gstNumClick?.enrichment_details?.online_provider
                                ?.details?.constitution?.value || "N/A"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                      <div className="card saleAccDetailCard">
                        <div className="card-header">
                          <h4 className="card-title">Address</h4>
                        </div>
                        <div className="card-body">
                          <ul className="saleAccDetailInfo">
                            {/* <li>
                        <span>Connected Office:</span>
                        {SingleAccountSalesBooking?.connected_office || "N/A"}
                      </li> */}
                            <li>
                              <span>Address:</span>
                              {gstNumClick?.enrichment_details?.online_provider
                                ?.details?.primary_address?.value || "N/A"}
                            </li>
                            <li>
                              <span>GST In:</span>
                              {gstNumClick?.enrichment_details?.online_provider
                                ?.details?.gstin?.value || "N/A"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </section>
        )}
      </FormContainer>
    </div>
  );
};

export default PendingInvoiceCustomerDeatils;
