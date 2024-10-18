import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import FieldContainer from "../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import Swal from "sweetalert2";

export default function VendorMPriceModal({ open, onClose, rowData }) {
  const token = sessionStorage.getItem("token");
  const { toastAlert } = useGlobalContext();
  const [mWisePostPrice, setMWisePostPrice] = useState(0);
  const [mWiseStoryPrice, setMWiseStoryPrice] = useState(0);
  const [mWiseBothPrice, setMWiseBothPrice] = useState(0);

  useEffect(() => {
    if (!open) {
      setMWisePostPrice(0);
      setMWiseStoryPrice(0);
      setMWiseBothPrice(0);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        baseUrl + "v1/update_m_price_with_vendor_id",
        {
          vendor_id: rowData._id,
          m_post_price: mWisePostPrice,
          m_story_price: mWiseStoryPrice,
          m_both_price: mWiseBothPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const updatedPages = response.data.updatedPages;
        Swal.fire({
          title: "Success!",
          text: `Updated Pages: ${updatedPages.join(", ")}`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "No Updates",
          text: "No pages were updated.",
          icon: "info",
        });
      }
      onClose();
    } catch (error) {
      console.error("Error updating prices:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating prices.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>{""}</DialogTitle>
      <DialogContent>
        <FieldContainer
          label="Million Wise Post Price"
          type="number"
          fieldGrid={12}
          value={mWisePostPrice}
          onChange={(e) => setMWisePostPrice(e.target.value)}
        />
        <FieldContainer
          label="Million Wise Story Price"
          type="number"
          fieldGrid={12}
          value={mWiseStoryPrice}
          onChange={(e) => setMWiseStoryPrice(e.target.value)}
        />
        <FieldContainer
          label="Million Wise Both Price"
          type="number"
          fieldGrid={12}
          value={mWiseBothPrice}
          onChange={(e) => setMWiseBothPrice(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
