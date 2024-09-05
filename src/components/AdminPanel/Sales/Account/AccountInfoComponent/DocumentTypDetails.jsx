import React, { useEffect } from "react";
import { useGetSingleDocumentOverviewQuery } from "../../../../Store/API/Sales/DocumentOverview";
import { useGetAllDocumentTypeQuery } from "../../../../Store/API/Sales/DocumentTypeApi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../../../Finance/Loader/Loader";

// Function to determine file type and return the corresponding icon
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

const DocumentTypDetails = ({ SingleAccount, setDocCount }) => {
  const {
    data: DocumentTypeData,
    isLoading: DocumentTypeLoading,
    error: DocumentTypeError,
  } = useGetSingleDocumentOverviewQuery(
    `${SingleAccount?.account_id}?_id=false`,
    {
      skip: !SingleAccount?.account_id,
    }
  );

  const {
    data: AllDocumentTypeData,
    isLoading: AllDocumentTypeLoading,
    error: AllDocumentTypeError,
  } = useGetAllDocumentTypeQuery();

  useEffect(() => {
    setDocCount(DocumentTypeData?.data?.length);
  }, [DocumentTypeData]);

  let isLoading = DocumentTypeLoading || AllDocumentTypeLoading;

  return (
    <>
      {isLoading && <Loader />}
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
              {DocumentTypeData?.data?.map((document, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                >
                  <div className="card saleAccDetailCard">
                    <div className="card-header justify-content-between">
                      <h4 className="card-title justify-content-start flex-row gap-2">
                        <i className="bi bi-file-earmark-text-fill"></i>
                        {
                          AllDocumentTypeData?.find(
                            (doc) => doc._id === document.document_master_id
                          )?.document_name
                        }
                      </h4>
                      <ul className="flex-row gap-2">
                        <li>
                          <a
                            className="icon-1 sm"
                            target="_blank"
                            href={document?.document_image_upload}
                            download
                          >
                            <i className="bi bi-eye" title="View"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="icon-1 sm"
                            // target="_blank"
                            href={document?.document_image_upload}
                            download
                          >
                            <i className="bi bi-download" title="Download"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body document-holder p0">
                      {["jpg", "jpeg", "png", "gif"].includes(
                        document.document_image_upload
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
                          src={document?.document_image_upload}
                          alt="Document"
                        />
                      ) : (
                        <div className="DocImage" style={{ display: "grid" }}>
                          <i
                            className={getFileIcon(
                              document.document_image_upload
                            )}
                            style={{ fontSize: "3rem", color: "#4D7345" }}
                          ></i>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <p>
                        {document?.document_name} :
                        <span>{document?.document_no || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default DocumentTypDetails;
