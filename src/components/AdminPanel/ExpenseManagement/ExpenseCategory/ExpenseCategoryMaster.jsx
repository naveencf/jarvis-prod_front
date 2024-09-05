import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Modal } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ExpenseCategoryMaster = ({
  openExpenseCategory,
  handleCloseExpenseCategory,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [expenseCategory, setExpenseCategory] = useState("");
  const [error, setError] = useState("");

  //   const getAccount = async () => {
  //     try {
  //       const res = await axios.get(`${baseUrl}get_all_expense_accounts`);
  //       console.log(res.data, "account");
  //     } catch (error) {
  //       toastError("Failed to fetch accounts. Please try again.");
  //     }
  //   };

  const handleSave = async () => {
    if (expenseCategory.trim() === "") {
      setError(<div style={{ color: "red" }}>Expense Category is required</div>);
      return;
    }
    try {
      await axios.post(`${baseUrl}add_expense_category`, {
        category_name: expenseCategory,
      });
      // getAccount();
      setExpenseCategory("");
      setError("");
      handleCloseExpenseCategory();
      toastAlert("Created Account Successfully");
    } catch (error) {
      setError("Failed to save account. Please try again.");
    }
  };
  //   useEffect(() => {
  //     getAccount();
  //   }, [account]);
  return (
    <div>
      <Modal
        open={openExpenseCategory}
        onClose={handleCloseExpenseCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Expense Category
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Expense Category"
            variant="outlined"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            error={!!error}
            helperText={error}
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
    </div>
  );
};

export default ExpenseCategoryMaster;
