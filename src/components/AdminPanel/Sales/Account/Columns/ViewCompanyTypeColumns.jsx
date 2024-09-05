import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";

export const ViewCompanyTypeColumns = [
  { key: "Serial_no", name: "S.NO", renderRowCell: (row, index) => index + 1, width: 50, sortable: true },
  { key: "company_type_name", name: "Company Name", renderRowCell: (row) => row.company_type_name, width: 100, sortable: true, showCol: true },
  { key: "description", name: "Description", renderRowCell: (row) => row.description, width: 100, sortable: true, showCol: true },
  { key: "createdAt", name: "Created Date", renderRowCell: (row) => DateISOtoNormal(row.createdAt), width: 100, sortable: true, showCol: true },
  { key: "action", name: "Actions", renderRowCell: () => <button className="icon-1"><i className="bi bi-pencil" /></button>, width: 100, sortable: true, showCol: true },

];