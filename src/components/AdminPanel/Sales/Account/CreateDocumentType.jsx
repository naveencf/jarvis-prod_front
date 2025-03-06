import React, { useContext, useState } from "react";
import { useAddDocumentTypeMutation } from "../../../Store/API/Sales/DocumentTypeApi";
import { useGlobalContext } from "../../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { is } from "date-fns/locale";
// import FormContainer from "../../../FormContainer";
// import FieldContainer from "../../FieldContainer";
import { ApiContextData } from "../../APIContext/APIContext";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";


const CreateDocumentType = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [DocumentName, setDocumentName] = useState("");
  const [DocumentDescription, setDocumentDescription] = useState("");
  const [addDocumentType, { data, error, isLoading }] =
    useAddDocumentTypeMutation();
  const [isValidate, setIsValidate] = useState({
    DocumentName: false,
    DocumentDescription: false
  })
  const { userID } = useContext(ApiContextData);
  console.log(isValidate);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (DocumentName === "") {
      setIsValidate((prevState) => ({ ...prevState, DocumentName: true }));
    }

    if (DocumentDescription === "") {
      setIsValidate((prevState) => ({ ...prevState, DocumentDescription: true }));
    }

    if (DocumentName === "" || DocumentDescription === "") {
      toastError("Please fill all the fields");
      return;
    }

    const payload = {
      document_name: DocumentName,
      description: DocumentDescription,
      created_by: userID,
    };
    try {
      await addDocumentType(payload).unwrap();
      toastAlert("Document Added Sucessfully");
      navigate(-1);
    } catch (error) {
      toastError(error.data.message);
    }
  };

  return (
    <div>
      <FormContainer mainTitle={"Documents Master"} link={"/"} />
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create Document</h3>
        </div>
        <div className="card-body row">
          <div className="col-4">

            <FieldContainer
              type="text"
              label="Document Name"
              placeholder="Enter Document Name"
              astric
              fieldGrid={12}
              required
              value={DocumentName}
              onChange={(e) => {
                setDocumentName(e.target.value)
                setIsValidate({ ...isValidate, DocumentName: false })
              }
              }
            />
            {isValidate.DocumentName && <div className="form-error">
              Please Enter Document Name
            </div>}
          </div>
          <div className="col-4">

            <FieldContainer
              type="text"
              label="Document Description"
              placeholder="Enter Document Description"
              fieldGrid={4}
              required
              astric
              value={DocumentDescription}
              onChange={(e) => {
                setDocumentDescription(e.target.value)
                setIsValidate({ ...isValidate, DocumentDescription: false })
              }}
            />
            {isValidate.DocumentDescription && <div className="form-error">
              Please Enter Document Description
            </div>}
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

export default CreateDocumentType;
