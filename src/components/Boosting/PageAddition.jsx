import React, { useCallback, useState } from "react";
import { Button } from "@mui/material";
import PageAdditionModal from "./PageAdditionModal";
import {
  useCreatorAnalysisBoostingMutation,
  useDeleteBoostingCreatorMutation,
  useGetBoostingCreatorsQuery,
} from "../Store/API/Boosting/BoostingApi";
import View from "../AdminPanel/Sales/Account/View/View";
import Swal from "sweetalert2";
import CreatorAnalysisModel from "./CreatorAnalysisModel";
import formatString from "../../utils/formatString";

const PageAddition = () => {
  const [open, setOpen] = useState(false);
  const [openCreatorModel, setOpenCreatorModel] = useState(false);
  const [creatorData, setCreatorData] = useState([]);

  const [selectedPage, setSelectedPage] = useState(null);
  const {
    data: boostedPages,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetBoostingCreatorsQuery();
  const [deleteBoostingCreator] = useDeleteBoostingCreatorMutation();
  const [creatorAnalysis] = useCreatorAnalysisBoostingMutation();

  const handleCreatorBoosting = useCallback(
    async (row) => {
      try {
        setOpenCreatorModel(true);

        const response = await creatorAnalysis({ creatorName: row }).unwrap();
        console.log(response.data.post_data, "reposn lalit ");
        setCreatorData(response.data.post_data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    },
    [creatorAnalysis]
  );

  const handleEdit = (row) => {
    setSelectedPage(row);
    setOpen(true);
  };
  const columns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      name: "Creator Name",
      key: "creatorName",
      width: 150,
      renderRowCell: (row) => formatString(row.creatorName),
    },
    {
      name: "Post Min Likes",
      key: "post_min_count",
      width: 100,
      renderRowCell: (row) => row.post_min_count,
    },
    {
      name: "Post Max Likes",
      key: "post_max_count",
      width: 100,
      renderRowCell: (row) => row.post_max_count,
    },
    {
      name: "Reel Min Likes",
      key: "reel_min_count",
      width: 100,
      renderRowCell: (row) => row.reel_min_count,
    },
    {
      name: "Reel Max Likes",
      key: "reel_max_count",
      width: 100,
      renderRowCell: (row) => row.reel_max_count,
    },
    {
      name: "Share Min Likes",
      key: "share_min_count",
      width: 100,
      renderRowCell: (row) => row.share_min_count,
    },
    {
      name: "Share Max Likes",
      key: "share_max_count",
      width: 100,
      renderRowCell: (row) => row.share_max_count,
    },
    {
      name: "Action",
      key: "action",
      width: 100,
      renderRowCell: (row) => (
        <div className="d-flex gap-2">
          {/* {
            <button
              className="btn btn-sm cmnbtn btn-danger"
              onClick={() => handleDelete(row?._id)}
              title="Save"
              // disabled={row.audit_status !== "purchased"}
            >
              Delete
            </button>
          } */}
          <div
            className="btn btn-sm cmnbtn btn-success ml-2"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            Edit
          </div>
          <div
            className="btn btn-sm cmnbtn btn-primary ml-2"
            title="Creator"
            onClick={() => handleCreatorBoosting(row.creatorName)}
          >
            Creator Boosting
          </div>
        </div>
      ),
    },
  ];
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedPage("");
  };

  const handleCloseCreatorModal = () => {
    setOpenCreatorModel(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBoostingCreator(id).unwrap();
          refetch();
          Swal.fire(
            "Deleted!",
            "The boosting creator has been deleted.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
          console.error("Error deleting:", error);
        }
      }
    });
  };
  return (
    <div>
      {/* <Button
        variant="contained"
        className="mb-3"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Add Page
      </Button>
      <PageAdditionModal
        open={open}
        handleClose={handleCloseModal}
        selectedPage={selectedPage}
        refetch={refetch}
      /> */}
      <CreatorAnalysisModel
        open={openCreatorModel}
        handleClose={handleCloseCreatorModal}
        creatorData={creatorData}
        // refetch={refetch}
      />
      <View
        pagination
        version={1}
        data={boostedPages}
        columns={columns}
        title={`Records`}
        // rowSelectable={true}
        // selectedData={handleSelection}
        tableName={"boosting-pages"}
        isLoading={isFetching || isLoading}
      />
    </div>
  );
};

export default PageAddition;
