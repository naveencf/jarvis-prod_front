import React, { useEffect, useState } from "react";
import { useGetSinglePOCQuery } from "../../../../Store/API/Sales/PointOfContactApi";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../../../Finance/Loader/Loader";

const PocDetails = ({ SingleAccount, setPocCount }) => {
  const {
    data: PocData,
    isLoading: PocLoading,
    error: PocError,
  } = useGetSinglePOCQuery(`${SingleAccount?.account_id}?_id=false`, {
    skip: !SingleAccount?.account_id,
  });

  useEffect(() => {
    if (PocData !== "undefined") {
      setPocCount(PocData?.length);
    }
  }, [PocData]);

  return (
    <div>
      {PocLoading && <Loader />}
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            className="flexCenter"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Point of Contact
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              {PocData?.map((poc, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                >
                  <div className="card saleAccDetailCard">
                    <div className="card-header">
                      <h4 className="card-title">
                        {poc?.contact_name}
                        <ul>
                          {poc?.social_platforms?.map((plat) => (
                            <li>
                              <a target="__blank" href={plat?.link}>
                                <i className={`bi bi-${plat.platform}`}></i>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul className="saleAccDetailInfo">
                        <li>
                          <span>Contact Number:</span>
                          {poc?.contact_no || "N/A"}
                        </li>
                        <li>
                          <span>Alt. Contact Number:</span>
                          {poc?.alternative_contact_no || "N/A"}
                        </li>
                        <li>
                          <span>Department:</span>
                          {poc?.department_name || "N/A"}
                        </li>
                        <li>
                          <span>Designation:</span>
                          {poc?.designation || "N/A"}
                        </li>
                        {/* {poc?.social_platforms?.map((plat) => (
                          <li>
                            <span>{plat?.platform}:</span>
                            <a target="__blank" href={plat.link}>
                              {plat?.link}
                            </a>
                          </li>
                        ))} */}
                        <li>
                          <span>Description:</span>
                          {poc?.description || "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default PocDetails;
