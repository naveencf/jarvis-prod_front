import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useGlobalContext } from "../../../../Context/Context";
import Select from "react-select";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const selectOptions = [
  {
    value: "Low",
    label: "Low",
  },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "High",
    label: "High",
  },
];
const mandatoryOption = [
  {
    value: true,
    label: "Yes",
  },
  {
    value: false,
    label: "No",
  },
];

const PreonboardingDocumentsUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const [documentType, setDocumentType] = useState("");
  const [mandatory, setMandatory] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [jobType, setJobType] = useState([]);
  const [jobTypeData, setJobTypeData] = useState([]);
  const [period, setPeriod] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    async function getJobtTypes() {
      const jobTypeResponse = await axios.get(baseUrl + "get_all_job_types");
      setJobTypeData(jobTypeResponse.data.data);
    }
    getJobtTypes();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}` + `get_doc/${id}`);
      const data = response.data.data;
      setDocumentType(data.doc_type);
      setPeriod(data.period);
      setPriority(data.priority);
      setDescription(data.description);
      setMandatory(data.isRequired);
      setDocumentNumber(data.doc_number);
      setJobType(data.job_type);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl + "update_doc", {
        _id: id,
        doc_type: documentType,
        priority: priority,
        period: Number(period),
        isRequired: mandatory,
        doc_number: documentNumber,
        job_type: jobType,
        description: description,
      })
      .then(() => {
        setDocumentType("");
        setPeriod(null);
        setDescription("");
        toastAlert("Document Created");
        navigate("/admin/preonboarding-documents-overview");
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Document"
        title="Document Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          astric
          label="Document Type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        />
        <FieldContainer
          astric
          label="Period (days)"
          type="number"
          fieldGrid={3}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <div className="form-group col-3">
          <label className="form-label">Priority</label>
          <sup style={{ color: "red" }}>*</sup>
          <Select
            value={selectOptions.find((option) => option.value === priority)}
            label={selectOptions.find((option) => option.value === priority)}
            options={selectOptions}
            onChange={(e) => setPriority(e.value)}
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Mandatory <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            value={mandatoryOption.find((option) => option.value === mandatory)}
            label={mandatory}
            options={mandatoryOption}
            onChange={(e) => setMandatory(e.value)}
            required
          />
        </div>
        <FieldContainer
          fieldGrid={3}
          label="Document Number"
          astric
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Job Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            isMulti
            options={jobTypeData?.map((option) => ({
              value: `${option.job_type}`,
              label: `${option.job_type}`,
            }))}
            value={jobType?.map((type) => ({
              value: type,
              label: type,
            }))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setJobType(selectedValues);
            }}
            required
          />
        </div>

        <FieldContainer
          astric
          Tag="textarea"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default PreonboardingDocumentsUpdate;
