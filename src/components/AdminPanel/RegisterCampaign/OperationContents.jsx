import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";

export default function OperationContents() {
  return (
    <>
    <FormContainer
    link={true}
    mainTitle={"Content Master"}
    />
      <div className="card body-padding">
       
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
                    Service Master
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
                    Content Type Master
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
                    Campaign Master
                  </div>
                </div>
              </Link>
           
            
                    </div>
          </div>

    </>
  );
}
