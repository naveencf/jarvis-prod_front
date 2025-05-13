import { baseUrl } from "../../../utils/config";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { useGetAllPageListQuery } from "../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";

const SarcasmNetwork = ({ selectedData, setSelectedData }) => {
  const token = sessionStorage.getItem("token");
  const [planx, setPlanx] = useState(null); // Initialize with null
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const { refetch: refetchPageList } = useGetAllPageListQuery();

  const options = [
    { label: "Inventory Pages", value: 0 },
    { label: "Sarcasm Network", value: 1 },
    { label: "Own Pages", value: 2 },
    { label: "Advanced Pages", value: 3 },
    { label: "HandlePicked Pages", value: 5 },
    { label: "High Price Meme Pages", value: 6 },
    { label: "Black Listed Pages", value: 7 },
    { label: "Disable", value: 9 },
  ];

  const handleOptionChange = async (event, newValue) => {
    if (!selectedData || selectedData?.length === 0) {
      alert("Please Select Pages First!");
      return;
    }

    if (newValue) {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to select "${newValue.label}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm it!",
        cancelButtonText: "No, cancel",
      });

      if (confirmResult.isConfirmed) {
        try {
          for (const id of selectedData) {
            const pageStatus = newValue.value === 9 ? "disabled" : "active";

            const response = await axios.put(
              `${baseUrl}v1/pageMaster/${id._id}`,
              {
                page_layer: newValue.value,
                vendor_id: id.vendor_id,
                page_status: pageStatus,  
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`Response for ID ${id._id}:`, response.data);
          }
          refetchPageList();
          Swal.fire("Confirmed!", "Your selection has been saved.", "success");
          setPlanx(null);
          setSelectedData([]);
        } catch (error) {
          console.error("Error during PUT requests:", error);
          Swal.fire(
            "Error",
            "An error occurred while saving your selection.",
            "error"
          );
        }
      }
    }
  };

  return (
    <div className="row thm_form">
      <div className="col-md-12">
        <Autocomplete
          value={options.find((option) => option.value === planx) || null}
          onChange={handleOptionChange}
          options={options}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Plan X" />}
        />
      </div>
    </div>
  );
};

export default SarcasmNetwork;
