import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../../../Context/Context";
import { ApiContextData } from "../../../APIContext/APIContext";
import FormContainer from "../../../FormContainer";
import FieldContainer from "../../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import CustomSelect from "../../../../ReusableComponents/CustomSelect";
import {
  useAddBonusMasterMutation,
  useEditBonusMasterMutation,
  useGetAllBonusMasterDataQuery,
  useGetBonusMasterByIdQuery,
} from "../../../../Store/API/Sales/SalesBonusApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const BonusMastAddEdit = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [BonusName, setBonusName] = useState("");
  const [designationData, setDesignationData] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [trigerType, setTrigerType] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [slabName, setSlabName] = useState("");
  const [slabData, setSlabData] = useState([
    { min: 0, max: 0, bonus_type: "fixed", bonus_amount: 0 },
  ]);

  const TrigerData = [
    { key: "every_day", value: "Every Day" },
    { key: "every_week", value: "Every Week" },
    { key: "every_month", value: "Every Month" },
    { key: "every_quarter", value: "Every Quarter" },
    { key: "every_year", value: "Every Year" },
    { key: "45_day", value: "45 Day" },
    { key: "100_day", value: "100 Day" },
    { key: "date_range", value: "Date Range" },
    { key: "specific_date", value: "Specific Date" },
    { key: "welcome_bonus", value: "Welcome Bonus" },
  ];
  // Skip query if id is "0" or not present
  const {
    data: bonusMastByIdData,
    isLoading: BonusLoading,
    refetch: refetchBonusMastById,
  } = useGetBonusMasterByIdQuery(id, {
    skip: !id || id === "0",
  });

  const [editBonusMast, { isLoading: isEditing, error: editError }] =
    useEditBonusMasterMutation();

  const { refetch: getAllBonus } = useGetAllBonusMasterDataQuery();

  useEffect(() => {
    if (id && id !== "0" && bonusMastByIdData) {
      setBonusName(bonusMastByIdData?.bonus_name || "");
      setDesignation(bonusMastByIdData?.designation || []);
      setTrigerType(bonusMastByIdData?.trigger_type || "");
      setSlabName(bonusMastByIdData?.slabName || "");
      setSlabData(
        bonusMastByIdData?.slabData?.map((slab) => ({
          min: slab.min || 0,
          max: slab.max || 0,
          bonus_type: slab.bonus_type || "fixed",
          bonus_amount: slab.bonus_amount || 0,
          slab_id: slab.slab_id || "",
        })) || []
      );
    }
  }, [bonusMastByIdData]);

  const [addBonusMaster, { data, error, isLoading }] =
    useAddBonusMasterMutation();

  const { userID } = useContext(ApiContextData);

  useEffect(() => {
    axios.get(baseUrl + "get_all_designations").then((res) => {
      setDesignationData(res.data.data);
    });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (BonusName === "" || designation.length === 0) {
      toastError("Please fill all the fields");
      return;
    }

    const payload = {
      bonus_name: BonusName,
      designation: designation,
      trigger_type: trigerType,
      created_by: userID,
      slabName: slabName,
      slabData: slabData,
    };

    try {
      if (id == "0") {
        // Add new bonus
        await addBonusMaster(payload).unwrap();
        toastAlert("Bonus Added Successfully");
        getAllBonus();
      } else {
        // Update existing bonus
        const editPayload = {
          ...payload,
          id,
          slabId: bonusMastByIdData?.slabId,
        }; // Include the ID for backend reference
        await editBonusMast(editPayload).unwrap();
        toastAlert("Bonus Updated Successfully");
        refetchBonusMastById();
        getAllBonus();
      }
      navigate(-1);
    } catch (error) {
      toastError(error?.data?.message);
    }
  };

  return (
    <div>
      <FormContainer mainTitle={"Bonus Master"} link={"/"} />
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add/Edit Bonus</h3>
        </div>
        <div className="card-body row">
          <div className="col-4">
            <FieldContainer
              type="text"
              label="Bonus Name"
              placeholder="Bonus Name"
              astric
              fieldGrid={12}
              required
              value={BonusName}
              onChange={(e) => {
                setBonusName(e.target.value);
                setIsValidate({ ...isValidate, BonusName: false });
              }}
            />
          </div>
          <div className="form-group col-4">
            <CustomSelect
              label={"Designation"}
              fieldGrid={12}
              dataArray={designationData}
              optionId={"desi_id"}
              optionLabel={"desi_name"}
              selectedId={designation}
              setSelectedId={setDesignation}
              required={true}
              multiple={true}
            />
          </div>
          <div className="form-group col-4">
            <CustomSelect
              label={"Type"}
              fieldGrid={12}
              dataArray={TrigerData}
              optionId={"key"}
              optionLabel={"value"}
              selectedId={trigerType}
              setSelectedId={setTrigerType}
              required={true}
              multiple={false}
            />
          </div>

          {trigerType === "date_range" && (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="form-group col-4">
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className="form-group col-4">
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
              </LocalizationProvider>
            </>
          )}
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create Slab</h3>
        </div>
        <div className="card-body row">
          <div className="col-12">
            <FieldContainer
              type="text"
              label="Slab Name"
              placeholder="Slab Name"
              value={slabName}
              onChange={(e) => {
                setSlabName(e.target.value);
              }}
              astric
              fieldGrid={12}
              required
            />
          </div>
          {slabData.map((item, index) => (
            <>
              <div className="form-group col-3" key={index}>
                <FieldContainer
                  type="number"
                  label={`Min ${index + 1}`}
                  placeholder={`Min ${index + 1}`}
                  value={item.min}
                  onChange={(e) => {
                    const newSlabData = [...slabData];
                    newSlabData[index].min = e.target.value;
                    setSlabData(newSlabData);
                  }}
                  astric
                  fieldGrid={12}
                  required
                />
              </div>
              <div className="form-group col-3" key={index}>
                <FieldContainer
                  type="number"
                  label={`Max ${index + 1}`}
                  placeholder={`Max ${index + 1}`}
                  value={item.max}
                  onChange={(e) => {
                    const newSlabData = [...slabData];
                    newSlabData[index].max = e.target.value;
                    setSlabData(newSlabData);
                  }}
                  astric
                  fieldGrid={12}
                  required
                />
              </div>
              {/* <div className="form-group col-3" key={index}>
                <CustomSelect
                  label={`Bonus Type ${index + 1}`}
                  fieldGrid={12}
                  dataArray={[
                    { key: "fixed", value: "Fixed" },
                    { key: "percentage", value: "Percentage" },
                  ]}
                  optionId={"key"}
                  optionLabel={"value"}
                  selectedId={item.bonus_type}
                  setSelectedId={(value) => {
                    const newSlabData = [...slabData];
                    newSlabData[index].bonus_type = value;
                    setSlabData(newSlabData);
                  }}
                  required={true}
                  multiple={false}
                  disabled={true}
                />
              </div> */}
              <div className="form-group col-3" key={index}>
                <FieldContainer
                  type="number"
                  label={`Bonus Amount ${index + 1}`}
                  placeholder={`Bonus Amount ${index + 1}`}
                  value={item.bonus_amount}
                  onChange={(e) => {
                    const newSlabData = [...slabData];
                    newSlabData[index].bonus_amount = e.target.value;
                    setSlabData(newSlabData);
                  }}
                  astric
                  fieldGrid={12}
                  required
                />
              </div>
              <div className="form-group col-3 mt-1" key={index}>
                <button
                  className="icon-1 mt-4"
                  onClick={() => {
                    const newSlabData = slabData.filter((_, i) => i !== index);
                    setSlabData(newSlabData);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </>
          ))}

          <div className="col-12">
            <button
              className="btn btn-primary cmnbtn"
              onClick={() => {
                setSlabData([
                  ...slabData,
                  {
                    min:
                      slabData.length > 0
                        ? slabData[slabData.length - 1].max
                        : 0,
                    max: 0,
                    bonus_type: "fixed",
                    bonus_amount: 0,
                  },
                ]);
              }}
            >
              Add Slab
            </button>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary cmnbtn"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </button>
    </div>
  );
};

export default BonusMastAddEdit;
