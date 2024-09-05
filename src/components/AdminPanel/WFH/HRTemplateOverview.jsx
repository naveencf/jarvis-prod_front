import React, { useCallback, useEffect, useState } from "react";
import useInvoiceTemplateImages from "./Templates/Hooks/useInvoiceTemplateImages";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import TemplateAssignedUsers from "./TemplateAssignedUsers";
import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";

const templateImages = useInvoiceTemplateImages();

const HRTemplateOverview = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [isTemplatePreviewModalOpen, setIsTemplatePreviewModalOpen] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSeletedTemplateUsersModalOpen, setIsSelectedUsersModalOpen] =
    useState(false);
  const [templateWiseData, setTemplateWiseData] = useState([]);

  useEffect(() => {
    const getTemplateData = async () => {
      try {
        const response = await axios.get(
          baseUrl + "get_all_users_with_invoiceno"
        );
        setTemplateWiseData(response.data.message);
      } catch (error) {
        console.error("Data fetching error", error);
      }
    };
    getTemplateData();
  }, []);

  const selectedTemplateUsers = useCallback(
    (templateId) => {
      return templateWiseData.find((item) => item._id == templateId);
    },
    [templateWiseData]
  );

  function openTemplatePreviewModal(image) {
    setPreviewImage(image);
    setIsTemplatePreviewModalOpen(true);
  }

  function closeTemplatePreviewModal() {
    setIsTemplatePreviewModalOpen(false);
  }

  function openSelectedTemplateUsersModal() {
    setIsSelectedUsersModalOpen(true);
  }

  function closeSelectedTemplateUsersModal() {
    setIsSelectedUsersModalOpen(false);
  }

  return (
    <>
      <div className="action_heading mb12">
        <div className="action_title">
          <FormContainer mainTitle={"Invoice"} link={true} />
        </div>
        <div className="action_btns">
          <Link to="/admin/billing-overview">
            <button type="button" className="btn cmnbtn btn_sm btn-primary">
              Billing
            </button>
          </Link>
          {/* <Link to="/admin/total-NDG">
          <button type="button" className="btn cmnbtn btn_sm btn-primary">
            Total & NDG
          </button>
        </Link> */}
        </div>
      </div>
      <div className="invoiceTempWrapper">
        <div className="row">
          {templateImages.map((d) => (
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 invoiceTempCol">
              <label className="invoiceTempCard card" key={d.temp_id}>
                <div className="card-header">
                  <h5 className="card-title">Template No: {d.temp_id}</h5>
                </div>
                <div className="card-body p0">
                  <input
                    type="radio"
                    value={selectedTemplate}
                    name="transfer-radio"
                    checked={selectedTemplate === d.temp_id}
                    onChange={() => setSelectedTemplate(d.temp_id)}
                  />
                  <span className="cstm-radio-btn">
                    <i className="bi bi-check2" />
                    <div className="boy_img">
                      <img
                        src={d.image}
                        alt="img"
                        onClick={() => openTemplatePreviewModal(d.image)}
                      />
                    </div>
                  </span>
                </div>
                <div className="card-footer">
                  <h6>Assigned:</h6>
                  <span
                    onClick={() => {
                      openSelectedTemplateUsersModal();
                    }}
                  >
                    {selectedTemplateUsers(d.temp_id)?.count
                      ? selectedTemplateUsers(d.temp_id)?.count
                      : 0}

                    <i className="bi bi-eye" />
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isTemplatePreviewModalOpen}
        onRequestClose={closeTemplatePreviewModal}
        contentLabel="Image Preview"
        appElement={document.getElementById("root")}
        style={{
          content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            maxWidth: "80vw",
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}
      >
        <div className="d-flex flex-column ">
          <img src={previewImage} alt="Preview" style={{ width: "100%" }} />
          <button
            className="btn btn-secondary"
            onClick={closeTemplatePreviewModal}
          >
            Close
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isSeletedTemplateUsersModalOpen}
        onRequestClose={closeSelectedTemplateUsersModal}
        contentLabel="Users Preview"
        appElement={document.getElementById("root")}
      >
        <TemplateAssignedUsers
          usersData={selectedTemplateUsers(selectedTemplate)?.users}
        />
      </Modal>
    </>
  );
};

export default HRTemplateOverview;
