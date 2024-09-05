import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";

const MyTemplate2 = ({ rowData }) => {
  const styles2 = StyleSheet.create({
    logo: {
      alignContent: "center",
      alignItems: "center",
      // flexDirection: "row",
      color: "#4b5563",
      marginBottom: 10,
      textAlign: "center",
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
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      display: "block",
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
    tableHeader: {
      backgroundColor: "#f0f0f0",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      fontSize: 13,
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
  });

  return (
    <>
      <Document>
        <Page size="A4" style={styles2.page}>
          <Text style={styles2.title}>Invoice</Text>
          <View style={styles2.header}>
            <View style={styles2.clientInfo}>
              <Text>Name: {rowData?.user_name}</Text>
              <Text>Email: {rowData?.user_email_id}</Text>
              <Text>Department: {rowData?.dept_name}</Text>{" "}
              {/* Add Department */}
              <Text>Designation: {rowData?.designation}</Text>{" "}
              <Text>Payment Mode: {rowData?.payment_mode}</Text>{" "}
              {/* Add Payment Mode */}
              <Text>Bank Account: {rowData?.bank_account}</Text>{" "}
              {/* Add Bank Account */}
              <Text>PAN: {rowData?.pan_no}</Text> {/* Add PAN */}
              <Text>PF: {rowData?.pf}</Text> {/* Add PF */}
              <Text>Address: {rowData?.current_address}</Text>
              {/* Add Designation */}
            </View>
            <View style={styles2.invoiceInfo}>
              <Text>Invoice Number: {rowData?.attendence_id}</Text>
              <Text>Date: {rowData?.Creation_date.split("T")[0]}</Text>
            </View>
          </View>
          <View style={styles2.table}>
            <View style={[styles2.tableRow, styles2.tableHeader]}>
              <Text style={styles2.tableCell}>S.No.</Text>
              <Text style={styles2.tableCell}>Particular</Text>
              <Text style={styles2.tableCell}>Qty.</Text>
              <Text style={styles2.tableCell}>Price</Text>
              <Text style={styles2.tableCell}>Amount</Text>
            </View>
            <View style={styles2.tableRow}>
              <Text style={styles2.tableCell}>{1}</Text>
              <Text style={styles2.tableCell}>
                {rowData?.month} {rowData?.year}
              </Text>
              <Text style={styles2.tableCell}>1</Text>
              <Text style={styles2.tableCell}>{rowData?.total_salary}</Text>
              <Text style={styles2.tableCell}>{rowData?.total_salary}</Text>
            </View>
            <View style={[styles2.tableRow]}>
              <Text style={styles2.tableCell}></Text>
              <Text style={styles2.tableCell}></Text>
              <Text style={styles2.tableCell}></Text>
              <Text style={styles2.tableCell}>TDS</Text>
              <Text style={styles2.tableCell}>{rowData?.tds_deduction}</Text>
            </View>
            <View style={[styles2.tableRow]}>
              <Text style={styles2.tableCell}></Text>
              <Text style={styles2.tableCell}></Text>
              <Text style={styles2.tableCell}></Text>
              <Text style={(styles2.tableCell, styles2.newAmount)}>
                Net Amount
              </Text>
              <Text style={styles2.tableCell}>{rowData?.toPay}</Text>
            </View>
          </View>

          <View style={styles2.additionalInfo}>
            <Text>Additional Information:</Text>
            <Text>
              This is some additional static information that you want to
              include in the PDF.
            </Text>
          </View>

          {/* You can add more text or components as needed */}
        </Page>
      </Document>
    </>
  );
};

export default MyTemplate2;
