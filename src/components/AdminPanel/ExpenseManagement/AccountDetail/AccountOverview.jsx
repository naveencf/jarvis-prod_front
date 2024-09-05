import React, { useEffect, useState } from "react";
import { Box, Typography, Modal, TextField } from "@mui/material";
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
  width: 500,
  height: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: "300px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AccountOverview = ({
  openAccountView,
  handleAccountViewClick,
  handleCloseAccountViewClick,
}) => {
  const [account, setAccount] = useState([]);
  const [id, setId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accName, setAccName] = useState("");

  const getAccount = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_expense_accounts`);
      setAccount(res.data);
    } catch (error) {
      toastError("Failed to fetch accounts. Please try again.");
    }
  };

  const handleEditClick = (params) => {
    setId(params.row?._id);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };
  const getSingle = async () => {
    const res = await axios.get(`${baseUrl}get_single_expense_account/${id}`);
    setAccName(res.data.account_name);
  };
  useEffect(() => {
    getAccount();
    if (id) {
      getSingle();
    }
  }, [id]);

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = account.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "account_name",
      headerName: "Account Name",
      width: 150,
      renderCell: (params) => {
        return params.row.account_name || "N/A";
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
              endpoint="delete_expense_account"
              id={params.row._id}
              getData={getAccount}
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
          </>
        );
      },
    },
  ];

  const handleSave = async () => {
    try {
      const res = await axios.put(`${baseUrl}update_expense_account`, {
        _id: id,
        account_name: accName,
      });
      if (res.status === 200) {
        handleEditModalClose();
        getAccount();
      }
    } catch (error) {
      toastError("Failed to update account. Please try again.");
    }
  };
  return (
    <div>
      <Modal
        open={openAccountView}
        onClose={handleCloseAccountViewClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography> Account Details</Typography>
          <DataGrid
            rows={account}
            columns={columns}
            getRowId={(row) => row._id}
          />
        </Box>
      </Modal>
      <>
        <Modal
          open={editModalOpen}
          onClose={handleEditModalClose}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={styles}>
            <Typography>Edit Account</Typography>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              value={accName}
              onChange={(e) => setAccName(e.target.value)}
            />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-danger rounded-pill"
                onClick={handleSave}
              >
                Submit
              </button>
            </div>
          </Box>
        </Modal>
      </>
    </div>
  );
};

export default AccountOverview;
