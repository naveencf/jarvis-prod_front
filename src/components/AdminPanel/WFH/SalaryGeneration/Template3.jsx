import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";

const MyTemplate3 = ({ rowData }) => {
  const styles3 = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      color: "#fff",
      backgroundColor: "#783cd7",
    },
    logo: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoImage: {
      width: 50,
      height: 50,
    },
    logoName: {
      marginLeft: 8,
      fontWeight: "bold",
      fontSize: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      padding: 10,
    },
    info: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      lineHeight: 2,
      marginTop: 15,
      marginRight: 20,
      marginBottom: 2,
      fontSize: 13,
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
    text: {
      fontSize: 14,
    },
    table: {
      flexDirection: "column",
      marginBottom: 20,
      fontSize: 13,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      alignItems: "center",
      paddingVertical: 5,
    },
    tableHeader: {
      color: "#fff",
      backgroundColor: "#783cd7", // Changed background color to green
    },
    tableCell: {
      flex: 1,
      textAlign: "center",
      padding: 5,
      fontSize: 13, // Removed quotes to make it a number
    },
    additionalInfo: {
      marginTop: 20,
      fontSize: 13,
    },
    invoiceNo: {
      color: "red",
      fontWeight: "bold",
      marginBottom: 5,
    },
    invoiceNO_header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    newAmount: {
      fontSize: 15,
      fontWeight: "800",
    },
  });

  return (
    <>
      <Document>
        <Page size="A4" style={styles3.page}>
          <View style={styles3.header}>
            <Text style={styles3.title}>Invoice</Text>
          </View>
          <View style={styles3.invoiceNO_header}>
            <View>
              <Text>Date: {rowData?.Creation_date.split("T")[0]}</Text>
            </View>
            <View>
              <Text style={styles3.invoiceNo}>
                Invoice No : {rowData?.attendence_id}
              </Text>
            </View>
          </View>

          <View style={styles3.info}>
            <View style={styles3.column}>
              <Text>Name: {rowData?.user_name}</Text>
              <Text>Email: {rowData?.user_email_id}</Text>
              <Text>Department:{rowData?.dept_name}</Text>
              <Text>Designation: React js Developer{rowData?.designation}</Text>
            </View>
            <View style={styles3.column}>
              <Text>PAN: {rowData?.pan_no}</Text>
              <Text>PF: {rowData?.pf} 2999</Text>
              <Text>Payment Mode: {rowData?.payment_mode}</Text>
              <Text>Bank Account: {rowData?.bank_account}</Text>
            </View>
          </View>
          <View style={{ marginBottom: "40px", fontSize: 13 }}>
            <Text>Address: {rowData?.current_address}</Text>
          </View>

          <View style={styles3.table}>
            <View style={[styles3.tableRow, styles3.tableHeader]}>
              <Text style={styles3.tableCell}>S.No.</Text>
              <Text style={styles3.tableCell}>Particular</Text>
              <Text style={styles3.tableCell}>Qty.</Text>
              <Text style={styles3.tableCell}>Price</Text>
              <Text style={styles3.tableCell}>Amount</Text>
            </View>
            <View style={styles3.tableRow}>
              <Text style={styles3.tableCell}>{1}</Text>
              <Text style={styles3.tableCell}>
                {rowData?.month} {rowData?.year}
              </Text>
              <Text style={styles3.tableCell}>1</Text>
              <Text style={styles3.tableCell}>{rowData?.total_salary}</Text>
              <Text style={styles3.tableCell}>{rowData?.total_salary}</Text>
            </View>
            <View style={[styles3.tableRow]}>
              <Text style={styles3.tableCell}></Text>
              <Text style={styles3.tableCell}></Text>
              <Text style={styles3.tableCell}></Text>
              <Text style={styles3.tableCell}>TDS</Text>
              <Text style={styles3.tableCell}>{rowData?.tds_deduction}</Text>
            </View>
            <View style={[styles3.tableRow]}>
              <Text style={styles3.tableCell}></Text>
              <Text style={styles3.tableCell}></Text>
              <Text style={styles3.tableCell}></Text>
              <Text style={(styles3.tableCell, styles3.newAmount)}>
                Net Amount
              </Text>
              <Text style={styles3.tableCell}>{rowData?.toPay}</Text>
            </View>
          </View>

          <View style={styles3.additionalInfo}>
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

export default MyTemplate3;
