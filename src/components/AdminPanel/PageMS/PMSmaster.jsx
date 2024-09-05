import FormContainer from "../FormContainer";
import { Link } from "react-router-dom";

export default function PMSmaster() {
  return (
    <>
      {/* <FormContainer mainTitle="Master" title="Master" submitButton={false}>
        <div className="row grid-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Page</h5>
              <div className="card-text">
                <div className="row">
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-profile-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Profile Type
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Category
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-page-category"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Page Ownership
                    </Link>
                  </div>{" "}
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-platform"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Platform
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Vendor Type</h5>
              <div className="card-text">
                <div className="row">
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-vendor-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Vendor Type
                    </Link>
                  </div>{" "}
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-pay-method"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Payment Mehtod
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-pay-cycle"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Payment Cycle
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-group-link-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Group Link Type
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-vendor-group-link"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Vendor Group Link
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-price-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Price
                    </Link>
                  </div>{" "}
                  <div className="col-md-6">
                    <Link
                      to="/admin/pms-platform-price-type"
                      className="btn btn-primary btn-sm"
                      id="pageName"
                    >
                      Platform Price
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormContainer> */}
      <div className="card body-padding">
        <div className="header">
          <div className="h3">Master</div>
        </div>
        <div className="card-body">
          <div className="card-header"> Page</div>
          <div className="card-body row">
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-profile-type">
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
                    Profile Type
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-page-category">
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
                    Page Category
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2-md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-page-ownership">
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
                    Page Ownership
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2 md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-platform">
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
                    Platform
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2 md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-platform-price-type">
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
                    Platform Price
                  </div>
                </div>
              </Link>
            </div>
            {/* <div
              className="d-flex gap4 col mb-2 md-6"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-platform-price-type">
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
                    Platform Price
                  </div>
                </div>
              </Link>
            </div> */}
          </div>
          <div className="card-header"> Vendor </div>

          <div className="card-body row">
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-vendor-type">
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
                    Vendor Type
                  </div>
                </div>
              </Link>
            </div>
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-pay-method">
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
                    Payment Mehtod
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-pay-cycle">
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
                    Payment Cycle
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-vendor-group-link">
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
                    Group Link Type
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-vendor-group-link">
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
                    Vendor Group Link
                  </div>
                </div>
              </Link>
            </div>{" "}
            <div
              className="d-flex gap4 col mb-2"
              style={{ flexWrap: "wrap", gap: "10px" }}
            >
              <Link to="/admin/pms-price-type">
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
                    Price
                  </div>
                </div>
              </Link>
            </div>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
