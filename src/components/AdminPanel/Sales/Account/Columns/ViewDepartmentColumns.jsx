export const ViewDepartmentColumns = [
  {
    key: "Serial_no",
    name: "S.NO",
    renderRowCell: (row, index) => index + 1,
    width: 50,
    showCol: true,
    sortable: true,
  },
  { key: "department_name", name: "Department" },
];
