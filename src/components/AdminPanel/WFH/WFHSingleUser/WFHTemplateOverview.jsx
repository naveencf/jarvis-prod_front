import React, { useState } from "react";
import useInvoiceTemplateImages from "../Templates/Hooks/useInvoiceTemplateImages";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Modal from "react-modal";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";

const templateImages = useInvoiceTemplateImages();

const WFHTemplateOverview = ({ closeTemplateModal, handleSubmit }) => {
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleTemplateUpdate() {
    const formData = new FormData();

    formData.append("user_id", loginUserId);
    formData.append("invoice_template_no", selectedTemplate);
    if (selectedTemplate) {
      await axios.put(`${baseUrl}` + `update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toastAlert("Template selected successfully");
      if (closeTemplateModal) closeTemplateModal();
      if (handleSubmit) handleSubmit();
    } else {
      alert("No Template Selected");
    }
  }

  function openModal(image) {
    setPreviewImage(image);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="transfer_body">
        <div className="transfer_boxes">
          {templateImages.map((d) => (
            <label className="transfer_bx" key={d.temp_id}>
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
                    onClick={() => openModal(d.image)}
                  />
                  <i className="bi bi-eye" /> {/* Eye icon */}
                  <h3>{d.temp_id}</h3>
                </div>
              </span>
            </label>
          ))}
        </div>
      </div>
      <button className="btn btn-secondary" onClick={handleTemplateUpdate}>
        Submit
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        style={{
          content: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            maxWidth: "80vw", // Adjust as needed
            maxHeight: "80vh", // Adjust as needed
            overflow: "auto",
          },
        }}
        // Add additional styling or className here if needed
      >
        <img src={previewImage} alt="Preview" style={{ width: "100%" }} />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
};

export default WFHTemplateOverview;
