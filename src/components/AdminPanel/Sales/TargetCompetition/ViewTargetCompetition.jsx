import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import { Link } from "react-router-dom";
import {
  useDeleteTargetCompetitionMutation,
  useEditTargetCompetitionMutation,
  useGetAllTargetCompetitionsQuery,
} from "../../../Store/API/Sales/TargetCompetitionApi";
import View from "../Account/View/View";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { formatIndianNumber } from "../../../../utils/formatIndianNumber";
import { useGlobalContext } from "../../../../Context/Context";
import Loader from "../../../Finance/Loader/Loader";

const ViewTargetCompetition = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const {
    data: allTargetCompetitionsData,
    refetch: refetchTargetCompetitions,
    isError: targetCompetitionsError,
    isLoading: targetCompetitionsLoading,
  } = useGetAllTargetCompetitionsQuery();

  const [deleteTargetCompetition, { isLoading: deleting }] =
    useDeleteTargetCompetitionMutation();

  const [
    updateTargetCompetition,
    { isLoading: paymentUpdating, isError: paymentUpdateError },
  ] = useEditTargetCompetitionMutation();

  const handleDelete = async (id) => {
    try {
      await deleteTargetCompetition(id).unwrap();
      toastAlert("Booking Deleted Successfully");
      refetchTargetCompetitions();
    } catch (error) {
      toastError("Error deleting target competition", error);
    }
  };

  const handleUpdateStatus = async (row) => {
    try {
      await updateTargetCompetition({
        id: row._id,
        status: Number(!row.status),
      }).unwrap();
      toastAlert("Status changed successfully");
      refetchTargetCompetitions();
    } catch (error) {
      toastError(error.message);
    }
  };

  const columns = [
    {
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "competition_name",
      width: 200,
      name: "Competition Name",
    },
    {
      key: "target_amount",
      width: 150,
      name: "Target Amount",
      renderRowCell: (row) => formatIndianNumber(row?.target_amount),
    },
    {
      key: "start_date",
      width: 150,
      name: "Start Date",
      renderRowCell: (row) => DateISOtoNormal(row.start_date),
      compare: true,
    },
    {
      key: "end_date",
      width: 150,
      name: "End Date",
      renderRowCell: (row) => DateISOtoNormal(row.end_date),
      compare: true,
    },
    {
      key: "status",
      name: "Status",
      compare: true,
      renderRowCell: (row, index) => {
        console.log(row, "harshal");
        if (row.status == 0) {
          return (
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={() => handleUpdateStatus(row)}
            >
              Inactive
            </button>
          );
        } else {
          return (
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={() => handleUpdateStatus(row)}
            >
              Active
            </button>
          );
        }
      },
    },
    {
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row gap16">
          <Link to={`/admin/create-target-competition/${row._id}`}>
            <div className="icon-1" title="Edit">
              <i className="bi bi-pencil" />
            </div>
          </Link>
          <button
            className="icon-1"
            onClick={() => handleDelete(row._id)}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {paymentUpdating && <Loader />}
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Target Competition"
            link="/admin/create-target-competition"
            submitButton={false}
          />
        </div>
        <div className="action_btns">
          <Link to={"/admin/create-target-competition"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add Target Competition
            </button>
          </Link>
        </div>
      </div>
      <div className="page_height">
        <View
          version={1}
          title={"Target Competition"}
          columns={columns}
          data={allTargetCompetitionsData}
          pagination
          isLoading={targetCompetitionsLoading}
          tableName={"TargetCompetitionOverview"}
        />
      </div>
    </>
  );
};

export default ViewTargetCompetition;
