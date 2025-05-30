import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { TextField, Button } from "@mui/material";

const EditVendorModal = ({
  isOpen,
  onClose,
  data,
  onSubmit,
  campaignList = [],
  pageOptions = [],
}) => {
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    setEditForm(data || {});
  }, [data]);

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(editForm);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={document.getElementById("root")}
      contentLabel="Edit Vendor Sale"
      style={{
        content: {
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
        },
      }}
    >
      <h3>Edit Vendor Sale</h3>
      <form onSubmit={handleFormSubmit}>
        <TextField
          fullWidth
          label="Amount"
          margin="normal"
          type="number"
          value={editForm.amount || ""}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
        />

        <TextField
          fullWidth
          label="Vendor Name"
          margin="normal"
          value={editForm.vendor_name || ""}
          onChange={(e) => handleChange("vendor_name", e.target.value)}
        />
        <TextField
          fullWidth
          label="Campaign Name"
          margin="normal"
          value={editForm.exe_campaign_name || ""}
          onChange={(e) => handleChange("exe_campaign_name", e.target.value)}
        />

        <TextField
          fullWidth
          label="Page Name"
          margin="normal"
          value={editForm.owner_info?.username || ""}
          onChange={(e) => {
            setEditForm((prev) => ({
              ...prev,
              owner_info: {
                ...prev.owner_info,
                username: e.target.value,
              },
            }));
          }}
        />

        <div className="mt-3 d-flex justify-content-end gap-2">
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditVendorModal;
