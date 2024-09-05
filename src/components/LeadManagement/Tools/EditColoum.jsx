export const columns = [
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    cellClassName: "actions",
    getActions: ({ id }) => {
      isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      // console.log(isInEditMode);
      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveAsIcon />}
            label="Save"
            sx={{
              color: "primary.main",
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<ClearIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
          // color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ];
    },
  },
  {
    field: "leadmast_id",
    headerName: "ID",
    width: 90,
  },
  {
    field: "lead_name",
    headerName: "First name",
    width: 150,
    type: "text",
    editable: true,
  },
  {
    field: "mobile_no",
    headerName: "Contact Detail",
    type: "number",
    width: 120,
    editable: true,
  },
  {
    field: "alternate_mobile_no",
    headerName: "Alternate Number",
    type: "number",
    width: 120,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    type: "email",
    width: 150,
    editable: true,
  },

  {
    field: "assign_to",
    headerName: "Assign to",
    type: "text",
    width: 110,
    editable: true,
  },

  {
    field: "leadsource",
    headerName: "Category",
    type: "text",
    width: 110,
    editable: false,
  },
  {
    field: "dept",
    headerName: "Department",
    type: "text",
    width: 110,
    editable: false,
  },

  {
    field: "city",
    headerName: "City",
    width: 90,
    editable: false,
  },
  {
    field: "addr",
    headerName: "Address",
    width: 90,
    editable: false,
  },
  {
    field: "country",
    headerName: "Country",
    width: 150,
    editable: false,
  },
  {
    field: "loc",
    headerName: "Location",
    width: 150,
    editable: false,
  },
  {
    field: "status",
    headerName: "Status",
    // type: "number",
    width: 110,
    editable: false,
  },
  {
    field: "remark",
    headerName: "Remark",
    width: 90,
    editable: false,
  },
  {
    field: "state",
    headerName: "State",
    width: 150,
    editable: false,
  },
  {
    field: "leadtype",
    headerName: "Leadtype",
    width: 150,
    editable: false,
  },
  {
    field: "Created_by",
    headerName: "Upload by",
    width: 90,
    editable: false,
  },
  {
    field: "Creation_date",
    headerName: "Upload Date",
    width: 150,
    editable: false,
  },
  {
    field: "Last_updated_by",
    headerName: "Last Update by",
    width: 150,
    editable: false,
  },
  {
    field: "Last_updated_date",
    headerName: "Last Update Date",
    width: 90,
    editable: false,
  },
];
