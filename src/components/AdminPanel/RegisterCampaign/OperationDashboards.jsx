import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";

export default function OperationDashboards() {
  return (
    <>
      {/* <div className="card body-padding">
        <div className="header">
          <div className="h3">Dashboards</div>
        </div>
        <div className="card-body">
          <div className="card-header"> Dashboards</div>
          <div className="card-body row">
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/manager-campaign">
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
                    Manager Campaign Dashboard
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/phase-dashboard">
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
                    Phase Dashboard
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/replacement-dashboard">
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
                    Replacement Dashboard
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/assignment-dashboard">
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
                    Assignment Dashboard
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div> */}
      <FormContainer mainTitle="Dashboard" link="true"></FormContainer>

      <div className="card body-padding">
        <div className="grid-con">
        <Link to="/admin/operationDashboard">
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
                Opreation  Dashboard
              </div>
            </div>
          </Link>
          <Link to="/admin/manager-campaign">
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
                Manager Campaign Dashboard
              </div>
            </div>
          </Link>

          <Link to="/admin/phase-dashboard">
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
                Phase Dashboard
              </div>
            </div>
          </Link>

          <Link to="/admin/replacement-dashboard">
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
                Replacement Dashboard
              </div>
            </div>
          </Link>

          <Link to="/admin/assignment-dashboard">
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
                Assignment Dashboard
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
