import React, { useContext, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "./View/View";
import {
  useGetAllDocumentTypeQuery,
  useEditDocumentTypeMutation,
} from "../../../Store/API/Sales/DocumentTypeApi";
import { ApiContextData } from "../../APIContext/APIContext";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { WidthFull } from "@mui/icons-material";

const DocumentTypeOverview = () => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const {
    data: allDocumentType,
    error: allDocumentTypeError,
    isLoading,
    refetch,
  } = useGetAllDocumentTypeQuery();
  const [editDocument, { isLoading: isEditing, error: editError }] =
    useEditDocumentTypeMutation();
  const { userID } = useContext(ApiContextData);
  const { toastAlert, toastError } = useGlobalContext();
  const HandleSave = async (row, setEditFlag) => {
    // let id = row._id
    const payload = {
      id: row._id,
      updated_by: userID,
      document_name: row.document_name,
      description: row.description,
    };
    try {
      await editDocument(payload).unwrap();
      setEditFlag(false);
      toastAlert("Document Type Updated Successfully");
      // refetch();


    } catch (error) {
      setEditFlag(false);

      console.error(error);
      toastError(error.data.message);
    }
  };
  const ViewDocumentTypeColumns = [
    {
      key: "sno",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      Width: 50,
    },
    {
      key: "document_name",
      name: "Document Name",
      editable: true,
      Width: 100,

    },
    {
      key: "description",
      name: "Description",
      editable: true,
      Width: 100,
    },
    {
      key: "Action_edits",
      name: "Actions",
      Width: 100,
      renderRowCell: (row, index, setEditFlag, editflag) => {
        return (
          <div className="flex-row">
            <button
              className="icon-1"
              title="Edit"
              onClick={() => {
                setEditFlag(index);
              }}
            >
              <i className="bi bi-pencil" />
            </button>

            {editflag === index && <button
              className="icon-1"
              title="Cancel Edit"
              onClick={() => {
                setEditFlag(false);
              }}
            >
              <i className="bi bi-x-square-fill" />
            </button>}

            {editflag === index && <button
              className="icon-1"
              title="Save"
              onClick={() => {
                HandleSave(row, setEditFlag);
              }}
            >
              <i className="bi bi-save" />
            </button>}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Document Type"} link={true} />
        </div>
        {loginUserRole === 1 && <div className="action_btns">
          <Link to={"/admin/sales-document-type-master"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add Document Type
            </button>
          </Link>
        </div>}
      </div>
      <View
        columns={ViewDocumentTypeColumns}
        data={allDocumentType}
        // rowSelectable={true}
        pagination
        isLoading={isLoading}
        title={"Document Type overview"}
        tableName={"DocumentTypeOverview"}
      />
    </div>
  );
};

export default DocumentTypeOverview;
