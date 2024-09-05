import React, { useEffect, useState } from "react";
import { Box, Typography, Modal } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { DataGrid } from "@mui/x-data-grid";
import DeleteButton from "../../DeleteButton";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const OverViewCampaign = ({ openCamp, handleCloseCampaign }) => {
  const [campaign, setCampaign] = useState([]);


  const getCampaign = async () => {
    const res = await axios.get(`${baseUrl}exe_campaign`);
    setCampaign(res.data.data);
  };
  const getAgency = async () => {
    const res = await axios.get(`${baseUrl}agency`);
    console.log(res?.data?.result);
  };

  const handleEditClick = (params) => {
    console.log(params?.row, "kkkkkk");
  };

  useEffect(() => {
    getCampaign();
  }, [openCamp]);
  useEffect(() => {
    getAgency();
  }, []);
  const formatString = (s) => {
    let formattedString = s?.replace(/^_+/, "");
    if (formattedString) {
      formattedString = formattedString
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    }
    return formattedString;
  };
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = campaign.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exe_campaign_name",
      headerName: "Campaign",
      width: 150,
      renderCell: (params) => {
        return formatString(params.row.exe_campaign_name) || "N/A";
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      width: 150,
      renderCell: (params) => {
        return formatString(params.row.brand_id) || "N/A";
      },
    },
    {
      field: "Agency  ",
      headerName: "Agency",
      width: 250,
      renderCell: (params) => {
        return formatString(params.row.agency_id) || "N/A";
      },
    },

    {
      field: "exe_hash_tag",
      headerName: "Hashtag",
      width: 150,
      renderCell: (params) => {
        return formatString(params.row.exe_hash_tag) || "N/A";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <DeleteButton
              endpoint="exe_campaign"
              id={params.row._id}
              getData={getCampaign}
            />
            <button
              icon={<EditIcon />}
              label="Edit"
              className="icon-1"
              onClick={() => handleEditClick(params)}
              color="inherit"
            >
              <i className="bi bi-pencil"></i>
            </button>
            ,
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Modal
        open={openCamp}
        onClose={handleCloseCampaign}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography> Campaign</Typography>
          <DataGrid
            rows={campaign}
            columns={columns}
            getRowId={(row) => row._id}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default OverViewCampaign;
