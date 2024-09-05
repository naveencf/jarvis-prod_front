import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import DeleteButton from "../../DeleteButton";
import CampaignDetails from "../CampaignDetails";
import ReplacementModal from "./ReplacementModal";
import formatString from "../CampaignMaster/WordCapital";

const CampPlanOverview = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const getPlan = async () => {
    try {
      const res = await axios.get(`${baseUrl}opcampaignplan/${id}`);
      setPlan(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    handleOpen();
  };

  const columns = [
    {
      field: "S. no",
      headerName: "S.No",
      width: 90,
      renderCell: (params) => {
        const rowIndex = plan.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        const formattedPageName = formatString(params.row.page_name);

        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {formattedPageName}
              </a>
            )}
          </div>
        );
      },
    },
    { field: "follower_count", headerName: "Follower Count", width: 120 },
    { field: "page_link", headerName: "Link", width: 250 },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            className="form-control"
            value={params?.row?.postPerPage}
          />
        );
      },
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            className="form-control"
            type="number"
            value={params?.row?.storyPerPage}
          />
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <DeleteButton
              endpoint="opcampaignplansingle"
              id={params.row._id}
              getData={getPlan}
            />
          </>
        );
      },
    },
    {
      field: "replace",
      headerName: "Replace Pages",
      width: 150,
      renderCell: (params) => {
        return (
          <button
            className="icon-1"
            onClick={() => handleOpenModal(params.row)}
          >
            <i className="bi bi-arrow-repeat" />
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <h1> Plan Overview </h1>
      <CampaignDetails cid={""} />
      <div className="d-flex justify-content-end mb-3">
        <div className="border d-flex justify-content-between align-items-center p-2 w-16 border-danger rounded-pill">
          <span>Delete Plan</span>
          <DeleteButton endpoint="opcampaignplan" id={id} getData={getPlan} />
        </div>
      </div>
      <DataGrid rows={plan} columns={columns} getRowId={(row) => row.p_id} />
      <>
        <ReplacementModal
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          selectedRow={selectedRow}
          plan={plan}
          id={id}
        />
      </>
    </div>
  );
};

export default CampPlanOverview;
