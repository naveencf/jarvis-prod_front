import axios from "axios";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { useEffect, useState } from "react";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AccountMaster from "./AccountDetail/AccountMaster";
import AccountOverview from "./AccountDetail/AccountOverview";
import ExpenseCategoryMaster from "./ExpenseCategory/ExpenseCategoryMaster";
import ExpenseCategoryOverview from "./ExpenseCategory/ExpenseCategoryOverview";
const minerStatus = ["Pending", " Record As No Bill", "Uploaded in Zoho"];
const ExpenseManagementMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [openAccount, setOpenAccount] = useState(false);
  const handleOpenAccount = () => setOpenAccount(true);
  const handleCloseAccount = () => setOpenAccount(false);

  const [openExpenseCategory, setOpenExpenseCategory] = useState(false);
  const handleExpenseCategory = () => setOpenExpenseCategory(true);
  const handleCloseExpenseCategory = () => setOpenExpenseCategory(false);

  const [openAccountView, setOpenAccountView] = useState(false);
  const handleAccountViewClick = () => setOpenAccountView(true);
  const handleCloseAccountViewClick = () => setOpenAccountView(false);

  const [openExpnseCategoryView, setOpenExpnseCategoryView] = useState(false);
  const handleExpenseCategoryViewClick = () => setOpenExpnseCategoryView(true);
  const handleCloseExpnseCategoryViewClick = () =>
    setOpenExpnseCategoryView(false);

  const [account, setAccount] = useState([]);
  const [updateAccount, setUpdateAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [refNo, setRefNo] = useState(0);
  const [description, setDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [updateExpenseCategory, setUpdateExpenseCategory] = useState("");
  const [user, setUser] = useState([]);

  const [assignedUser, setAssignedUser] = useState(null);
  const [minorStatus, setMinorStatus] = useState("");
  const [bill, setBill] = useState([]);
  console.log(assignedUser);

  const getExpenseCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_expense_categories`);
      setExpenseCategory(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_users`);
      setUser(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAccountDateling = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_expense_accounts`);
      setAccount(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getExpenseCategory();
    getAccountDateling();
    getAllUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("account_details", updateAccount);
    formData.append("amount", amount);
    formData.append("reference_number", refNo);
    formData.append("transaction_date", date);
    formData.append("assigned_to", assignedUser.value);
    formData.append("expense_category", updateExpenseCategory);
    formData.append("description", description);
    formData.append("minor_status", minorStatus.label);
    formData.append("upload_bill", bill);
    formData.append("created_by", loginUserId);
    if (minorStatus.label === "Pending") {
      formData.append("major_status", "open");
    } else if (minorStatus.label === "Record As No Bill") {
      formData.append("major_status", "closed");
    } else {
      formData.append("major_status", "closed");
    }
    try {
      const res = await axios.post(`${baseUrl}add_expense`, formData);
      console.log(res);
      setAccount("");
      setAmount(0);
      setDate("");
      setRefNo(0);
      setDescription("");
      setExpenseCategory("");
      setUser("");
      setMinorStatus("");
      setBill(null);
      navigate("/admin/expense-Overview");
      toastAlert("Created Successfully");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <FormContainer
        mainTitle="Expense Management Master"
        handleSubmit={handleSubmit}
      >
        <div className="col-md-6 mb16">
          <div className="form-group m0">
            <label className="form-label">
              Account Details <sup style={{ color: "red" }}>*</sup>
            </label>
            <div className="input-group inputAddGroup">
              <Select
                className="w-100"
                options={account?.map((status) => ({
                  value: status?._id,
                  label: status?.account_name,
                }))}
                onChange={(option) => setUpdateAccount(option.value)}
                required
              />
              <IconButton
                onClick={handleOpenAccount}
                variant="contained"
                color="primary"
                aria-label="Add Platform.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleAccountViewClick}
                variant="contained"
                color="primary"
                aria-label="Platform Info.."
              >
                <InfoIcon />
              </IconButton>
            </div>
          </div>
        </div>

        <FieldContainer
          label="Amount"
          type="text"
          fieldGrid={4}
          astric
          value={amount}
          required={false}
          onChange={(e) => setAmount(e.target.value)}
        />
        <FieldContainer
          label="Ref. No"
          type="number"
          fieldGrid={4}
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
          required={false}
        />
        <FieldContainer
          label="Date"
          type="date"
          astric
          fieldGrid={4}
          value={date}
          required={false}
          onChange={(e) => setDate(e.target.value)}
        />
        <FieldContainer
          label="Description"
          type="text"
          fieldGrid={4}
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="col-md-6 mb16">
          <div className="form-group m0">
            <label className="form-label">
              Expense Category <sup style={{ color: "red" }}>*</sup>
            </label>
            <div className="input-group inputAddGroup">
              <Select
                className="w-100"
                options={expenseCategory?.map((status) => ({
                  value: status?._id,
                  label: status?.category_name,
                }))}
                onChange={(option) => setUpdateExpenseCategory(option.value)}
                required
              />
              <IconButton
                onClick={handleExpenseCategory}
                variant="contained"
                color="primary"
                aria-label="Add Platform.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleExpenseCategoryViewClick}
                variant="contained"
                color="primary"
                aria-label="Platform Info.."
              >
                <InfoIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="form-group col-12">
          <label className="form-label">
            Assigned To <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={user?.map((status) => ({
              value: status?.user_id,
              label: status?.user_name,
            }))}
            onChange={(option) => setAssignedUser(option)}
            required={false}
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">
            Status <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={minerStatus.map((status) => ({
              value: status,
              label: status,
            }))}
            value={minorStatus}
            onChange={(option) => setMinorStatus(option)}
            required
          />
        </div>
        <div>
          <label className="col-form-label">Upload Bill</label>
          <input
            type="file"
            className="form-control"
            id="recipient-name"
            onChange={(e) => setBill(e.target.files[0])}
          />
        </div>
      </FormContainer>
      <>
        {/* Account Curd */}
        <AccountMaster
          openAccount={openAccount}
          handleOpenAccount={handleOpenAccount}
          handleCloseAccount={handleCloseAccount}
        />
        <AccountOverview
          openAccountView={openAccountView}
          handleAccountViewClick={handleAccountViewClick}
          handleCloseAccountViewClick={handleCloseAccountViewClick}
        />
      </>
      <>
        {/* Expense Category Curd */}
        <ExpenseCategoryMaster
          openExpenseCategory={openExpenseCategory}
          handleExpenseCategory={handleExpenseCategory}
          handleCloseExpenseCategory={handleCloseExpenseCategory}
        />
        <ExpenseCategoryOverview
          openExpnseCategoryView={openExpnseCategoryView}
          handleExpenseCategoryViewClick={handleExpenseCategoryViewClick}
          handleCloseExpnseCategoryViewClick={
            handleCloseExpnseCategoryViewClick
          }
        />
      </>
    </>
  );
};

export default ExpenseManagementMaster;
