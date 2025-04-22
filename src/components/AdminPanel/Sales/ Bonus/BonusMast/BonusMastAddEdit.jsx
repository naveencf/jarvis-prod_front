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
  useGetBonusMasterByIdQuery,
} from "../../../../Store/API/Sales/SalesBonusApi";

const BonusMastAddEdit = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [BonusName, setBonusName] = useState("");
  const [designationData, setDesignationData] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [trigerType, setTrigerType] = useState("");
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
  const { data: bonusMastByIdData, isLoading: BonusLoading } =
    useGetBonusMasterByIdQuery(id, {
      skip: !id || id === "0",
    });

  useEffect(() => {
    if (id && id !== "0" && bonusMastByIdData) {
      setBonusName(bonusMastByIdData?.bonus_name || "");
      setDesignation(bonusMastByIdData?.designation || []);
      setTrigerType(bonusMastByIdData?.trigger_type || "");
    }
  }, [id, bonusMastByIdData]);

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
    };
    try {
      await addBonusMaster(payload).unwrap();
      toastAlert("Document Added Sucessfully");
      navigate(-1);
    } catch (error) {
      toastError(error.data.message);
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
              label={"Designation"}
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
