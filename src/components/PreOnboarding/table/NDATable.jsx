import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    lineHeight: 0,
  },
  tableRow: {
    flexDirection: "row",
    gap: 1,
    borderStyle: "solid",
    borderWidth: 0.5,
    // backgroundColor: '#fff',
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    padding: 2,
    backgroundColor: "#fff",
  },
  tableHeadCol: {
    width: "50%",
    borderStyle: "solid",
    padding: 2,
    backgroundColor: "#000",
    textAlign: "center",
    fontFamily: "PB",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",

    width: "100%",
    backgroundColor: "#fff",
  },
  tableCell1: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  tableHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    width: "100%",
    backgroundColor: "#000",
    color: "#fff",
  },
  ml:{
    marginLeft:"5px"
  },
  bold: {
    fontFamily: "TB",
  },
});

// Create Document Component
const NDATable = ({ UserDetails }) => {
  return (
    <>
      <View style={styles.table}>
        {/* Table Rows */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>For CREATIVEFUEL PRIVATE LIMITED
            (Disclosing Party)</Text>
            <Text>{" "}</Text>
            <Text style={styles.ml}>Name: Pallavi Tomar</Text>
            <Text style={styles.ml}>Designation: HR Manager</Text>
            <Text style={styles.ml}>Date:</Text>
            <Text>{" "}</Text>
            <Text>{" "}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>For ________________
            (Receiving Party)</Text>
            <Text style={styles.ml}>Name:</Text>
            <Text style={styles.ml}>Designation:</Text>
            <Text style={styles.ml}>Date:</Text>
            <Text>{" "}</Text>
            <Text>{" "}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default NDATable;
