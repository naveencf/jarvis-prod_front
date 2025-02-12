import React from "react";
import FormContainer from "../../AdminPanel/FormContainer";

const AuditedDataView = ({ columns, modalData, setToggleModal }) => {
  return (
    <>
      <div className="icon-1" onClick={() => setToggleModal(false)}>
        X
      </div>
      <FormContainer mainTitle={"Audited Data"} link={"true"} />
      <div className="card">
        <div className="card-body">
          <div className="row">
            {columns?.map((col) => {
              if (
                col.key != "Sr.No" &&
                col.key != "action" &&
                col.key != "pageedits" &&
                col.key != "postLinks" &&
                col.key != "Pageedits"
              ) {
                if (col.key === "postImage") {
                  return (
                    <div className="col-md-6">
                      <div className="flex-row">
                        <p className="mr-2">{col.name}</p>:
                        <img
                          src={modalData[col.key]}
                          alt="postImage"
                          style={{
                            width: "100px",
                            // height: "100px",
                            aspectRatio: "6/9",
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="col-md-6">
                    <div className="flex-row">
                      <p className="mr-2">{col.name}</p>:
                      <p className="ml-2">{modalData[col.key]}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditedDataView;
