import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";
const MyTemplate1 = ({ rowData }) => {
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

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>INVOICE</Text>
            <View style={styles.invoiceInfo}>
              <Text>Invoice Number: {rowData?.attendence_id}</Text>
              <Text>Date:{rowData?.Creation_date.split("T")[0]}</Text>
            </View>
          </View>

          <View style={styles.clientInfo}>
            <Text>Name: {rowData?.user_name}</Text>
            <Text>Email: {rowData?.user_email_id}</Text>
            <Text>Payment Mode: {rowData?.payment_mode}</Text>{" "}
            {/* Add Payment Mode */}
            <Text>Bank Account: {rowData?.bank_account}</Text>{" "}
            {/* Add Bank Account */}
            <Text>PAN: {rowData?.pan}</Text> {/* Add PAN */}
            <Text>PF: {rowData?.pf}</Text> {/* Add PF */}
            <Text>Address: {rowData?.current_address}</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>S.NO</Text>
              <Text style={styles.tableCell}>Particular</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Amount</Text>
              {/* <Text style={styles.tableCell}>Absent Days</Text> */}
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>1</Text>
              <Text style={styles.tableCell}>
                {rowData?.month} {rowData?.year}
              </Text>
              <Text style={styles.tableCell}>1</Text>
              <Text style={styles.tableCell}>{rowData?.net_salary}</Text>
              <Text style={styles.tableCell}>{rowData?.noOfabsent}</Text>
            </View>
          </View>
          <View style={[styles.tableRow2, styles.tableHeader]}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>TDS</Text>
            <Text style={styles.tableCell}>{rowData?.tds_deduction}</Text>
          </View>

          <View style={[styles.tableRow2, styles.tableHeader]}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>Net Amount</Text>
            <Text style={styles.tableCell}>{rowData?.toPay}</Text>
          </View>
          <View style={styles.tableRow2}></View>

          {/* Additional static information */}
          <Text style={{ marginTop: 20 }}>Additional Information:</Text>
        </Page>
      </Document>
    </>
  );
};

export default MyTemplate1;
