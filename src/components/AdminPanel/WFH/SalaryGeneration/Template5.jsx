import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";

const MyTemplate5 = ({ rowData }) => {
  const styles5 = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    info: {
      marginTop: 15,
      marginRight: 20,
    },
    invoiceInfo: {
      marginLeft: "auto",
    },
    table: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: "row",
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      alignItems: "center",
      padding: 5,
    },
    tableHeader: {
      backgroundColor: "#ccc",
    },
    tableCell: {
      flex: 1,
      textAlign: "center",
    },
    additionalInfo: {
      marginTop: 20,
    },
  });
  return (
    <>
      <Document>
        <Page size="A4" style={styles5.page}>
          <Text style={styles5.title}>PAYSLIP</Text>
          <View style={styles5.header}>
            <View style={styles5.info}>
              <Text>Name: {rowData?.user_name}</Text>
              <Text>Address: NA</Text>
              <Text>Email: NA</Text>
              <Text>Payment Mode: {rowData?.payment_mode}</Text>
              <Text>Bank Account: {rowData?.bank_account}</Text>
              <Text>PAN: {rowData?.pan}</Text>
              <Text>PF: {rowData?.pf}</Text>
              <Text>Department: {rowData?.department}</Text>
              <Text>Designation: {rowData?.designation_name}</Text>
            </View>
            <View style={styles5.invoiceInfo}>
              <Text>Invoice Number: {rowData?.attendence_id}</Text>
              <Text>Date: {rowData?.Creation_date.split("T")[0]}</Text>
            </View>
          </View>
          <View style={styles5.table}>
            <View style={[styles5.tableRow, styles5.tableHeader]}>
              <Text style={styles5.tableCell}>Employee Name</Text>
              <Text style={styles5.tableCell}>Department</Text>
              <Text style={styles5.tableCell}>Designation</Text>
              <Text style={styles5.tableCell}>Working Days</Text>
              <Text style={styles5.tableCell}>Month</Text>
              <Text style={styles5.tableCell}>Absent Days</Text>
            </View>
            <View style={styles5.tableRow}>
              <Text style={styles5.tableCell}>{rowData?.user_name}</Text>
              <Text style={styles5.tableCell}>IT</Text>
              <Text style={styles5.tableCell}>React Developer</Text>
              <Text style={styles5.tableCell}>26</Text>
              <Text style={styles5.tableCell}>{rowData?.month}</Text>
              <Text style={styles5.tableCell}>{rowData?.noOfabsent}</Text>
            </View>
          </View>
          <View style={[styles5.tableRow, styles5.tableHeader]}>
            <Text style={styles5.tableCell}>Present Days</Text>
            <Text style={styles5.tableCell}>Basic Salary</Text>
            <Text style={styles5.tableCell}>HRA</Text>
            <Text style={styles5.tableCell}>Bonus</Text>
            <Text style={styles5.tableCell}>TDS</Text>
            <Text style={styles5.tableCell}>Net Salary</Text>
          </View>
          <View style={styles5.tableRow}>
            <Text style={styles5.tableCell}>{26 - rowData?.noOfabsent}</Text>
            <Text style={styles5.tableCell}>{rowData?.total_salary}</Text>
            <Text style={styles5.tableCell}>2000</Text>
            <Text style={styles5.tableCell}>2000</Text>
            <Text style={styles5.tableCell}>{rowData?.tds_deduction}</Text>
            <Text style={styles5.tableCell}>{rowData?.net_salary}</Text>
          </View>
          {/* Additional static information */}
          <Text style={styles5.additionalInfo}>Additional Information:</Text>
          <Text>
            This is some additional static information that you want to include
            in the PDF.
          </Text>

          {/* You can add more text or components as needed */}
        </Page>
      </Document>
    </>
  );
};

export default MyTemplate5;
