import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import Select from "react-select";

const minerStatus = ["Pending", "Record As No Bill", "Uploaded in Zoho"];

const ExpenseManagementUpdate = () => {
  const { id } = useParams();
  const [allAccount, setAllAccount] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState();
  const [refNo, setRefNo] = useState();
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [allExpenseCategory, setAllExpenseCategory] = useState([]);
  const [expenseCat, setExpenseCat] = useState("");
  const [user, setUser] = useState([]);
  const [userName, setUserName] = useState("");
  const [minorStatus, setMinorStatus] = useState("");
  const [bill, setBill] = useState("");

  const getSingleExpense = async () => {
    const res = await axios.get(`${baseUrl}get_single_expense/${id}`);
    // setSingleExpense(res.data.data);
    setAccountName(res.data.data[0]?.account_details);
    setAmount(res.data.data?.[0]?.amount);
    setRefNo(res.data.data?.[0]?.reference_number);
    setDescription(res.data.data[0]?.description);
    setDate(res.data.data[0]?.transaction_date);
    setExpenseCat(res.data.data[0]?.expense_category);
    setUserName(res.data.data[0]?.assigned_to);
    setMinorStatus(res.data.data[0]?.minor_status);
    setBill(res.data.data[0]?.upload_bill);
    console.log(res.data.data, "hrello");
  };

  const getExpenseCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_expense_categories`);
      setAllExpenseCategory(res.data);
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
      setAllAccount(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSingleExpense();
    getExpenseCategory();
    getAccountDateling();
    getAllUsers();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_id", id);
    formData.append("account_details", accountName);
    formData.append("amount", amount);
    formData.append("reference_number", refNo);
    formData.append("transaction_date", date);
    formData.append("assigned_to", userName);
    formData.append("expense_category", expenseCat);
    formData.append("description", description);
    formData.append("minor_status", minorStatus);
    formData.append("upload_bill", bill);
    // formData.append("created_by", loginUserId);
    if (minorStatus === "Pending") {
      formData.append("major_status", "open");
    } else if (minorStatus === "Record As No Bill") {
      formData.append("major_status", "closed");
    } else {
      formData.append("major_status", "closed");
    }
    const res = await axios.put(`${baseUrl}update_expense`, formData);
    console.log(res);
  };

  return (
    <>
      <FormContainer
        mainTitle="Expense Management Update"
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
                options={allAccount?.map((status) => ({
                  value: status?._id,
                  label: status?.account_name,
                }))}
                value={{
                  value: accountName,
                  label:
                    allAccount.find((user) => user._id === accountName)
                      ?.account_name || "",
                }}
                onChange={(option) => setAccountName(option.value)}
                required
              />
            </div>
          </div>
        </div>

        <FieldContainer
          label="Amount"
          type="number"
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
          value={date ? date.split("T")[0] : ""}
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
                options={allExpenseCategory?.map((status) => ({
                  value: status?._id,
                  label: status?.category_name,
                }))}
                value={{
                  value: expenseCat,
                  label:
                    allExpenseCategory.find((user) => user._id === expenseCat)
                      ?.category_name || "",
                }}
                onChange={(option) => setExpenseCat(option.value)}
                required
              />
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
            value={{
              value: userName,
              label:
                user.find((user) => user.user_id === userName)?.user_name || "",
            }}
            onChange={(option) => setUserName(option.value)}
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
            value={{ value: minorStatus, label: minorStatus }}
            onChange={(option) => setMinorStatus(option.value)}
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
    </>
  );
};

export default ExpenseManagementUpdate;
