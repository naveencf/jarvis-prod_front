import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import FormContainer from "../FormContainer";
import {baseUrl} from '../../../utils/config'

const DashboardWFHCardDetails = () => {
  const { id } = useParams();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const getData = () => {
    axios
      .post(baseUrl+"dept_id_with_wfh", {
        dept_id: id,
      })
      .then((res) => {
        const response = res.data;
        setFilterData(response);
        setData(response);
      });
  };
  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    const result = data.filter((d) => {
      return (
        d.user_name.toLowerCase().match(search.toLowerCase()) ||
        d.desi_name.toLowerCase().match(search.toLowerCase()) ||
        d.user_email_id.toLowerCase().match(search.toLocaleLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dept_name,
    },
    {
      name: "Designation",
      selector: (row) => row.desi_name,
    },
    {
      name: "E-mail",
      selector: (row) => row.user_email_id,
    },
    {
      name: "DOJ",
      selector: (row) =>
        row.joining_date.split("T")[0].split("-").reverse().join("-"),
    },
    {
      name: "Salary",
      selector: (row) => row.salary + " ₹",
    },
  ];

  const handleExcelExport = () => {
    const formattedData = filterData.map((row, index) => ({
      "S.No": index + 1,
      "Employee Name": row.user_name,
      Department: row.dept_name,
      Designation: row.desi_name,
      "E-mail": row.user_email_id,
      DOJ: row.joining_date.split("T")[0].split("-").reverse().join("-"),
      Salary: `${row.salary} ₹`,
    }));

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const styles = StyleSheet.create({
    logo: {
      alignItems: "center",
      flexDirection: "row",
      color: "#4b5563",
      marginBottom: 10,
    },
    logoName: {
      marginLeft: 10,
      fontWeight: 600,
      fontSize: "25px",
    },
    page: {
      fontFamily: "Helvetica",
      fontSize: 12,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      backgroundColor: "pink",
      padding: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    invoiceInfo: {
      flexDirection: "column",
    },
    invoiceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    clientInfo: {
      marginTop: 10,
      lineHeight: 2,
    },
    table: {
      flexDirection: "column",
      marginTop: 20,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableRow2: {
      flexDirection: "row",

      borderBottomWidth: 1,
      borderColor: "#000",
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableHeader: {
      backgroundColor: "pink",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      textAlign: "center",
    },

    totals: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: "center",
      fontSize: 10,
      color: "gray",
    },
    // tableHeader: {
    //   backgroundColor: "#f2f2f2",
    // },

    // tableCell: {
    //   padding: 5,
    //   fontSize: 12,
    //   textAlign: "center",
    // },

    // Styles for the TDS and Net Invoice sections
    tdsSection: {
      marginTop: 10,
      borderTop: "1px solid #ccc",
      padding: "5px 0",
    },

    netInvoiceSection: {
      marginTop: 10,
      borderTop: "1px solid #ccc",
      padding: "5px 0",
      fontWeight: "bold",
    },
  });

  const pdfTemplate = () => (
    <Document>
      <Page size="A1" style={styles.page}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-evenly" }}
        ></View>

        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Text>Department: {filterData?.dept_name}</Text>
          <Text>WFH employee details</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>S.NO</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              Employee Name
            </Text>
            <Text style={styles.tableCell}>Department</Text>
            <Text style={styles.tableCell}>Designation</Text>
            <Text style={styles.tableCell}>Email</Text>
            <Text style={styles.tableCell}>DOJ</Text>
            <Text style={styles.tableCell}>Salary</Text>
          </View>
        </View>

        {filterData?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {item?.user_name}
            </Text>
            <Text style={styles.tableCell}>{item?.dept_name}</Text>
            <Text style={styles.tableCell}>{item?.desi_name}</Text>
            <Text style={styles.tableCell}>{item.user_email_id}</Text>
            <Text style={styles.tableCell}>
              {item.joining_date.split("T")[0].split("-").reverse().join("-")}
            </Text>
            <Text style={styles.tableCell}>{item.salary}</Text>
          </View>
        ))}

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.salary))
                .reduce((a, b) => a + b, 0)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <FormContainer mainTitle="WFH" link="/admin" buttonAccess={false} />
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="WFH Employees"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <>
                {filterData.length > 0 && (
                  <button
                    className="btn btn-primary me-2"
                    size="medium"
                    onClick={handleExcelExport}
                    variant="outlined"
                    color="secondary"
                  >
                    Export Excel
                  </button>
                )}

                <div className="d-flex">
                  <PDFDownloadLink
                    document={pdfTemplate()}
                    fileName={" invoice"}
                    style={{
                      // textDecoration: "none",
                      // padding: "10px",
                      color: "#4a4a4a",
                      // backgroundColor: "#f2f2f2",
                      // border: "1px solid #4a4a4a",
                    }}
                  >
                    <button
                      className="btn btn-outline-primary me-3"
                      type="button"
                    >
                      PDF Download
                    </button>
                  </PDFDownloadLink>
                </div>

                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default DashboardWFHCardDetails;
