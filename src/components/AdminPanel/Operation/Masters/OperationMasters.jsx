import React from "react";
import FormContainer from "../../FormContainer";
import { Link } from "react-router-dom";

const OperationMasters = () => {
  return (
    <div>
      <FormContainer link={true} mainTitle="Campaign Master" />
      <div className="card body-padding">
        <div className="grid-con">
      
          <Link to="/admin/brandmaster">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Brand 
              </div>
            </div>
          </Link>

          <Link to="/admin/overview/agency">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Agency 
              </div>
            </div>
          </Link>

          <Link to="/admin/overview/industry">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Industry 
              </div>
            </div>
          </Link>

          <Link to="/admin/overview/goal">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Goal 
              </div>
            </div>
          </Link>

          <Link to="/admin/contentcreater">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Commitment 
              </div>
            </div>
          </Link>
        </div>
        <div className="grid-con">
          <Link to="/admin/overview/service">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Service 
              </div>
            </div>
          </Link>

          <Link to="/admin/contenttype">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Content Type 
              </div>
            </div>
          </Link>

          <Link to="/admin/campaigncommitment">
            <div
              className="card hover body-padding"
              style={{
                height: "100px",
                minWidth: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                border: "1px solid var(--primary)",
                padding: "10px",
              }}
            >
              <div
                className="pack  "
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="rounded-circle circle-card">
                  <i className="bi bi-bounding-box"></i>
                </div>
                Campaign 
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OperationMasters;
