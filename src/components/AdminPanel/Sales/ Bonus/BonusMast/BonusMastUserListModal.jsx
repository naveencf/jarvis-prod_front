import React, { useState } from "react";
import View from "../../Account/View/View";
import {
  useAddAssigntoUserMutation,
  useAssigntoUserRemoveMutation,
  useGetAllBonusMasterDataQuery,
  useGetBonusUserListByIdQuery,
} from "../../../../Store/API/Sales/SalesBonusApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteButton from "../../../DeleteButton";
import { useAPIGlobalContext } from "../../../APIContext/APIContext";
import Select from "react-select";
import { useGlobalContext } from "../../../../../Context/Context";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 700,
  overflowY: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const BonusMastUserListModal = ({ rowData, closeModal }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const { userContextData } = useAPIGlobalContext();
  const {
    data: getBonusUserList,
    isLoading: bonusUserListLoading,
    isFetching: bonusUserListFetching,
    refetch,
  } = useGetBonusUserListByIdQuery(rowData);
  const [user, setUser] = useState("");
  // useAddAssigntoUserMutation
  const [AssignBonustoUser, { data, error, isLoading }] =
    useAddAssigntoUserMutation();
  const [AssignBonustoUserRemove] = useAssigntoUserRemoveMutation();
  const { refetch: getAllBonus } = useGetAllBonusMasterDataQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user === "") {
      toastError("Please Enter User Name");
      return;
    }

    const payload = {
      user_id: user,
      bonus_id: rowData,
    };

    try {
      await AssignBonustoUser(payload).unwrap();
      toastAlert("Bonus Added Successfully");
      setUser("");
      refetch();
      getAllBonus();

      navigate(-1);
    } catch (error) {
      toastError(error?.data?.message);
    }
  };
  const handleRemove = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this bonus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const payload = {
          user_id: row.user_id,
          bonus_id: rowData,
        };

        try {
          await AssignBonustoUserRemove(payload).unwrap();
          toastAlert("Bonus Removed Successfully");
          refetch();
          getAllBonus();
          navigate(-1);
        } catch (error) {
          toastError(error?.data?.message);
        }
      } else {
        console.log("User cancelled the bonus removal");
      }
    });
  };

  const assignedUserColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },
    {
      key: "user_name",
      name: "User Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "Action",
      name: "Action",
      renderRowCell: (row) => (
        <>
          <button
            onClick={() => handleRemove(row)}
            className="btn cmnbtn btn-outline-danger btn_sm mr-2"
          >
            X
          </button>
        </>
      ),
      showCol: true,
      width: 100,
    },
  ];
  return (
    <>
      <Box sx={style}>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="card p-3">
          <h3>Assign Bonus to User</h3>
          <div className="form-group col-12">
            <label className="form-label">User Name</label>
            <Select
              className=""
              options={userContextData
                .filter((option) => option.dept_id === 36)
                .map((option) => ({
                  value: option.user_id,
                  label: `${option.user_name}`,
                }))}
              value={{
                value: user,
                label:
                  userContextData?.find((val) => val.user_id === user)
                    ?.user_name || "",
              }}
              onChange={(e) => setUser(e.value)}
            />
          </div>
          <div className="">
            <button
              onClick={handleSubmit}
              className="btn cmnbtn btn-primary btn_sm mr-2 ml-2"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="lg:col-span-12 col-span-12">
          <View
            columns={assignedUserColumns}
            data={getBonusUserList}
            isLoading={bonusUserListLoading || bonusUserListFetching}
            title={"Assigned User Name"}
            tableName={"Bonus Structure"}
            pagination
          />
        </div>
      </Box>
    </>
  );
};

export default BonusMastUserListModal;
