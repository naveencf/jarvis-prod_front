import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";

// let showCol = true;
export const ViewAccountTypeColumns = [
  { key: "Serial_no", name: "S.NO", renderRowCell: (row, index) => index + 1, width: 50, showCol: true, sortable: true },
  { key: "account_type_name", name: "Account Name", renderRowCell: (row) => row.account_type_name, width: 100, sortable: true, showCol: true },
  { key: "description", name: "Description", renderRowCell: (row) => row.description, width: 100, sortable: true, showCol: true },
  { key: "createdAt", name: "Created Date", renderRowCell: (row) => DateISOtoNormal(row.createdAt), width: 100, sortable: true, showCol: true },
  { key: "action", name: "Actions", renderRowCell: (row) => <button className="icon-1" onClick={() => alert(JSON.stringify(row))} ><i className="bi bi-pencil" /></button>, width: 100, sortable: true, showCol: true },

];
