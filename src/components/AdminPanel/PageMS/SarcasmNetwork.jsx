import { baseUrl } from "../../../utils/config";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { useGetAllPageListQuery } from "../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";

const SarcasmNetwork = ({ selectedData }) => {
  const token = sessionStorage.getItem("token");
  const [planx, setPlanx] = useState("");
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const {
    refetch: refetchPageList,
  } = useGetAllPageListQuery();

  const options = [
    { label: "Sarcasm Network", value: 1 },
    { label: "Advanced Pages", value: 3 },
    { label: "Inventory Pages", value: 0 },
  ];

  const handleOptionChange = async (event, newValue) => {
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
        setPlanx(newValue.value);

        // Use async/await to make API calls one by one
        for (const id of selectedData) {
          try {
            const response = await axios.put(
              `${baseUrl}v1/pageMaster/${id._id}`,
              { page_layer: newValue.value, vendor_id: id.vendor_id },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
            }
        );
        refetchPageList()
            console.log(`Response for ID ${id._id}:`, response.data);
          } catch (error) {
            console.error(`Error for ID ${id._id}:`, error);
          }
        }

        Swal.fire("Confirmed!", "Your selection has been saved.", "success");
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
